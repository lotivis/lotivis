import {copy} from "../shared/copy";

/**
 * Returns a flat version of the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
export function flatDatasets(datasets) {
  let flatData = [];
  let datasetsCopy = datasets;
  for (let datasetIndex = 0; datasetIndex < datasetsCopy.length; datasetIndex++) {
    let dataset = datasetsCopy[datasetIndex];
    let flatDataChunk = flatDataset(dataset);
    flatData = flatData.concat(flatDataChunk);
  }
  return flatData;
}

/**
 * Returns an array containing the flat samples of the given dataset.
 *
 * @param dataset The dataset with samples.
 * @returns {[]} The array containing the flat samples.
 */
export function flatDataset(dataset) {
  let flatData = [];
  if (!dataset.data) {
    console.log('Lotivis: Flat samples for dataset without samples requested. Will return an empty array.');
    return flatData;
  }
  dataset.data.forEach(item => {
    let newItem = {};
    newItem.dataset = dataset.label;
    newItem.stack = item.stack;
    newItem.location = item.location;
    newItem.date = item.date;
    newItem.dateNumeric = item.dateNumeric;
    newItem.value = item.value;
    flatData.push(newItem);
  });
  return flatData;
}
