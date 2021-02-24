import {flatDatasets} from "./dataset-flat";

/**
 * Returns the set of stacks from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */

export function extractStacks(datasets) {
  return toSet(datasets.map(dataset => dataset.stack || dataset.label));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The set containing the dates.
 */
export function extractDates(datasets) {
  let flatData = flatDatasets(datasets);
  return toSet(flatData.map(item => item.date || "unknown"));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The set containing the locations.
 */
export function extractLocations(datasets) {
  let flatData = flatDatasets(datasets);
  return toSet(flatData.map(item => item.location || "unknown"));
}

function toSet(array) {
  return Array.from(new Set(array));
}
