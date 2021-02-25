/**
 * Returns the sum of data values for the given dataset.
 *
 * @param flatData The flat data array.
 * @param dataset The dataset name.
 * @returns {*} The sum.
 */
export function sumOfDataset(flatData, dataset) {
  return flatData
    .filter(item => item.dataset === dataset)
    .map(item => item.value)
    .reduce((acc, next) => acc + next, 0);
}

/**
 * Returns the sum of data values for the given stack.
 *
 * @param flatData The flat data array.
 * @param stack The stack name.
 * @returns {*} The sum.
 */
export function sumOfStack(flatData, stack) {
  return flatData
    .filter(item => item.stack === stack)
    .map(item => item.value)
    .reduce((acc, next) => acc + next, 0);
}
