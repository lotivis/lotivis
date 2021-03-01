import {flatDatasets} from "./dataset-flat";

/**
 * Returns the set of dataset names from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */
export function extractLabelsFromDatasets(datasets) {
  return toSet(datasets.map(dataset => dataset.label || 'unknown'));
}

/**
 * Returns the set of stacks from the given dataset collection.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat data.
 */
export function extractStacksFromDatasets(datasets) {
  return toSet(datasets.map(dataset => dataset.stack || 'unknown'));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The set containing the dates.
 */
export function extractDatesFromDatasets(datasets) {
  return extractDatesFromFlatData(flatDatasets(datasets));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The set containing the locations.
 */
export function extractLocationsFromDatasets(datasets) {
  return extractLocationsFromFlatData(flatDatasets(datasets));
}

/**
 * Returns the set of dataset names from the given flat data array.
 *
 * @param flatData The flat data array.
 * @returns {[]} The array containing the flat data.
 */
export function extractLabelsFromFlatData(flatData) {
  return toSet(flatData.map(item => item.dataset || 'unknown'));
}

/**
 * Returns the set of stacks from the given flat data array.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param flatData The flat data array.
 * @returns {[]} The array containing the flat data.
 */
export function extractStacksFromFlatData(flatData) {
  return toSet(flatData.map(item => item.stack || item.dataset || 'unknown'));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param flatData The flat data array.
 * @returns {[]} The set containing the dates.
 */
export function extractDatesFromFlatData(flatData) {
  return toSet(flatData.map(item => item.date || 'unknown'));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param flatData The flat data array.
 * @returns {[]} The set containing the locations.
 */
export function extractLocationsFromFlatData(flatData) {
  return toSet(flatData.map(item => item.location || "unknown"));
}

/**
 * Return an array containing each equal item of the given array only once.
 *
 * @param array The array to create a set of.
 * @returns {any[]} The set version of the array.
 */
function toSet(array) {
  return Array.from(new Set(array)).sort();
}

/**
 * Returns the earliest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The earliest date.
 */
export function extractEarliestDate(flatData) {
  return extractDatesFromFlatData(flatData).shift();
}

/**
 * Returns the earliest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The earliest date.
 */
export function extractEarliestDateWithValue(flatData) {
  let withValue = flatData.filter(item => (item.value || 0) > 0);
  return extractDatesFromFlatData(withValue).shift();
}

/**
 * Returns the latest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The latest date.
 */
export function extractLatestDate(flatData) {
  return extractDatesFromFlatData(flatData).pop();
}

/**
 * Returns the latest date occurring in the flat array of items.
 *
 * @param flatData The flat data array.
 * @returns {*} The latest date.
 */
export function extractLatestDateWithValue(flatData) {
  let withValue = flatData.filter(item => (item.value || 0) > 0);
  return extractDatesFromFlatData(withValue).pop();
}
