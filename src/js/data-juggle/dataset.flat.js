/**
 * Returns a flat version of the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */
export function flatDatasets(datasets) {
  let flatData = [];
  datasets.forEach(function (dataset) {
    flatData = flatData.concat(flatDataset(dataset));
  });
  return flatData;
}

/**
 * Returns an array containing the flat data of the given dataset.
 *
 * @param dataset The dataset with data.
 * @returns {[]} The array containing the flat data.
 */
export function flatDataset(dataset) {
  let flatData = [];
  if (!dataset.data) {
    console.log('Lotivis: Flat data for dataset without data requested. Will return an empty array.');
    return flatData;
  }
  dataset.data.forEach(item => {
    item.dataset = dataset.label;
    item.stack = dataset.stack;
    flatData.push(item);
  });
  return flatData;
}
