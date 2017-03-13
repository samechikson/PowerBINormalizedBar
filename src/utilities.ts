module powerbi.extensibility.visual {

    /**
    *
    * @function
    * @param {Array<number>} sortedData Assumes sorted.
    * @param {number} percentile
    */
    export function findPercentile(sortedData: Array<number>, percentile: number): number {
        let k = Math.round((percentile / 100) * sortedData.length);
        if (k > sortedData.length-1) k = sortedData.length-1

        return sortedData[k]/sortedData[sortedData.length-1];
    }
}
