/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
  /**
   * Interface for BarChart settings.
   *
   * @interface
   * @property {{show:boolean}} enableAxis - Object property that allows axis to be enabled.
   */
  interface BarSettings {
      enableAxis: {
          show: boolean;
      };

      generalView: {
          opacity: number;
      };
  }

  /**
   * Interface for BarChart data points.
   *
   * @interface
   * @property {number} value             - Data value for point.
   * @property {string} category          - Corresponding category of data value.
   *                                        and visual interaction.
   */
    interface BarDataPoint {
        value: PrimitiveValue;
        category: string;
    };

    export class Visual implements IVisual {
        private target: HTMLElement;
        private svg: d3.Selection<SVGElement>;
        private barContainer: d3.Selection<SVGElement>;
        private updateCount: number;
        private barSettings: BarSettings;
        private barDataPoints: BarDataPoint[];

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;

            this.barDataPoints = [
            {
                value: 10,
                category: 'a'
            },
            {
                value: 20,
                category: 'b'
            },
            {
                value: 1,
                category: 'c'
            },
            {
                value: 100,
                category: 'd'
            },
            {
                value: 500,
                category: 'e'
            }];

            let svg = this.svg = d3.select(options.element)
              .append('svg')
              .classed('barChart', true);

            this.barContainer = svg.append('g')
                .classed('barContainer', true);
        }

        public update(options: VisualUpdateOptions) {
          let viewModel = {
              dataPoints: this.barDataPoints,
              dataMax: 10,
              settings: this.barSettings,
          };
          let settings = this.barSettings = viewModel.settings;
          this.barDataPoints = viewModel.dataPoints;

          let width = options.viewport.width;
          let height = options.viewport.height;
          console.log('Visual update', viewModel.dataPoints);

          let bar = this.barContainer
            .append('rect')
            .attr('class', 'bar');

          bar.attr({
              width: 100,
              height: 20,
              y: 10,
              x: 10,
              fill: 0
          });

        }
    }
}
