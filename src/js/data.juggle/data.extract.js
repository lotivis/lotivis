import {flatDatasets} from "./data.flat";
import {toValue} from "../shared/value";

/**
 * Returns the set of dataset names from the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
export function extractLabelsFromDatasets(datasets) {
  return toSet(datasets.map(dataset => toValue(dataset.label)));
}

/**
 * Returns the set of stacks from the given dataset collection.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The array containing the flat samples.
 */
export function extractStacksFromDatasets(datasets) {
  return toSet(datasets.map(dataset => toValue(dataset.stack || dataset.label)));
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
 * Returns the set of dataset names from the given flat samples array.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The array containing the flat samples.
 */
export function extractLabelsFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.dataset)));
}

/**
 * Returns the set of stacks from the given flat samples array.
 * Will fallback on dataset property if stack property isn't present.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The array containing the flat samples.
 */
export function extractStacksFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.stack || item.dataset)));
}

/**
 * Returns the set of dates from the given dataset collection.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The set containing the dates.
 */
export function extractDatesFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.date)));
}

/**
 * Returns the set of locations from the given dataset collection.
 *
 * @param flatData The flat samples array.
 * @returns {[]} The set containing the locations.
 */
export function extractLocationsFromFlatData(flatData) {
  return toSet(flatData.map(item => toValue(item.location)));
}

/**
 * Return an array containing each equal item of the given array only once.
 *
 * @param array The array to create a set of.
 * @returns {any[]} The set version of the array.
 */
function toSet(array) {
  return Array.from(new Set(array));
}

/**
 * Returns the earliest date.chart occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The earliest date.chart.
 */
export function extractEarliestDate(flatData, dateAccess = (date) => date) {
  return extractDatesFromFlatData(flatData)
    .sort((left, right) => dateAccess(left) - dateAccess(right)).shift();
}

/**
 * Returns the earliest date.chart occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The earliest date.chart.
 */
export function extractEarliestDateWithValue(flatData, dateAccess = (date) => date) {
  return extractEarliestDate(filterWithValue(flatData), dateAccess);
}

/**
 * Returns the latest date.chart occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The latest date.chart.
 */
export function extractLatestDate(flatData, dateAccess = (date) => date) {
  return extractDatesFromFlatData(flatData)
    .sort((left, right) => dateAccess(left) - dateAccess(right)).pop();
}

/**
 * Returns the latest date.chart occurring in the flat array of items.
 *
 * @param flatData The flat samples array.
 * @param dateAccess
 * @returns {*} The latest date.chart.
 */
export function extractLatestDateWithValue(flatData, dateAccess = (date) => date) {
  return extractLatestDate(filterWithValue(flatData), dateAccess);
}

/**
 * Returns a filtered collection containing all items which have a valid value greater than 0.
 *
 * @param flatData The flat samples to filter.
 * @returns {*} All items with a value greater 0.
 */
export function filterWithValue(flatData) {
  return flatData.filter(item => (item.value || 0) > 0);
}
