/**
 * Returns the sum of samples values for the given dataset.
 *
 * @param flatData The flat samples array.
 * @param dataset The dataset name.
 * @returns {*} The sum.
 */
export function sumOfDataset(flatData, dataset) {
  return sumOfValues(flatData.filter(item => item.dataset === dataset));
}

/**
 * Returns the sum of samples values for the given label.
 *
 * @param flatData The flat samples array.
 * @param label The label.
 * @returns {*} The sum.
 */
export function sumOfLabel(flatData, label) {
  return sumOfValues(flatData.filter(item => item.label === label));
}

/**
 * Returns the sum of samples values for the given stack.
 *
 * @param flatData The flat samples array.
 * @param stack The stack name.
 * @returns {*} The sum.
 */
export function sumOfStack(flatData, stack) {
  return sumOfValues(flatData.filter(item => item.stack === stack));
}

/**
 * Returns the sum of the value properties of each item.
 *
 * @param flatData
 * @returns {*}
 */
export function sumOfValues(flatData) {
  return flatData
    .map(item => +(item.value || 0))
    .reduce((acc, next) => acc + next, 0);
}
