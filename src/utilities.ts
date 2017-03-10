module powerbi.extensibility.visual {

    /**
    *
    * @function
    * @param {Array<number>} data
    * @param {number} percentile
    */
    export function findPercentile(data: Array<number>, percentile: number): number {
        let sortedData = _.sortBy(data);
        let k = Math.round((percentile / 100) * sortedData.length);

        return sortedData[k];
    }
}
