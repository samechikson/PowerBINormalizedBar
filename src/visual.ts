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
   * @property {string} color             - Color of the bar.
   */
    interface BarDataPoint {
        value: number;
        category: string;
        color: string;
    };

    export class Visual implements IVisual {
        private target: HTMLElement;
        private svg: d3.Selection<SVGElement>;
        private barContainer: d3.Selection<SVGElement>;
        private updateCount: number;
        private barSettings: BarSettings;
        private barDataPoints: BarDataPoint[];
        private rawData: number[];

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            this.updateCount = 0;
            this.rawData = _.sortBy([1,23, 3,345,349,12]);

            this.barDataPoints = [
                {
                    value: findPercentile(this.rawData, 25),
                    category: 'section1',
                    color: '#EAEAEA'
                },
                {
                    value: findPercentile(this.rawData, 75),
                    category: 'section2',
                    color: '#9edae5'
                },
                {
                    value: findPercentile(this.rawData, 99),
                    category: 'section3',
                    color: '#EAEAEA'
                }
            ];

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
          this.svg.attr({
              width: width,
              height: height
          })
          let xScaleBar = d3.scale.linear()
              .domain([0,1])
              .range([0,width])

          this.updateAverage(options, viewModel);

          //let colorScale = d3.scale.ordinal().domain([0,3]).range(['#2ca02c', '#d62728', '#ff7f0e', '#9edae5']);
          let colorScale = d3.scale.ordinal<string>().range(['#2ca02c', '#9edae5'])
          // console.log('Visual update', viewModel.dataPoints);

          let bars = this.barContainer.selectAll('.bar').data(viewModel.dataPoints)
              .enter().append('rect')
              .attr('class', 'bar');

          bars.attr({
              width: d => xScaleBar(d.value),
              height: height/2,
              y: height/4,
              x: (d, i) => {
                  let xAccumulator = 0;
                  for (let j=0; j<i; j++) {
                      xAccumulator += xScaleBar(this.barDataPoints[j].value) + 2
                  }
                  return xAccumulator;
              },
              fill: (d, i) => d.color
          });

        }

        public updateAverage(options: VisualUpdateOptions, viewModel){
            let meanContainer = this.svg.append('g').classed('meanContainer', true);
            meanContainer.attr({
                transform: 'translate('+_.mean(this.rawData)+', '+options.viewport.height / 2+')'
            })
            meanContainer.append('rect')
              .attr({
                  width: 25,
                  height: 25,
                  fill: '#ffffff',
                  stroke: '#5A8F98',
                  'stroke-width': 5,
                  transform: 'rotate(45)'
              })
        }
    }
}
