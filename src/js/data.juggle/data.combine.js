import {copy} from "../shared/copy";
import {isValue} from "../shared/value";

/**
 *
 * @param flattenList
 * @returns {[]}
 */
export function combine(flattenList) {
  let combined = [];
  let copiedList = copy(flattenList);
  for (let index = 0; index < copiedList.length; index++) {
    let listItem = copiedList[index];
    let entry = combined.find(function (entryItem) {
      return entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location
        && entryItem.date === listItem.date;
    });
    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.location)) entry.location = listItem.location;
      if (isValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (isValue(listItem.date)) entry.date = listItem.date;
      if (isValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (isValue(listItem.locationName)) entry.locationName = listItem.locationName;
      entry.value = (listItem.value || 0);
      combined.push(entry);
    }
  }
  return combined;
}

/**
 * Returns
 *
 * @param flattenList
 * @returns {[]}
 */
export function combineByStacks(flattenList) {
  let combined = [];
  for (let index = 0; index < flattenList.length; index++) {
    let listItem = flattenList[index];

    let entry = combined.find(function (entryItem) {
      return entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location
        && entryItem.date === listItem.date;
    });

    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.location)) entry.location = listItem.location;
      if (isValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (isValue(listItem.date)) entry.date = listItem.date;
      if (isValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (isValue(listItem.locationName)) entry.locationName = listItem.locationName;
      entry.value = (listItem.value || 0);
      combined.push(entry);
    }
  }
  return combined;
}

/**
 *
 * @param flatData
 * @returns {[]}
 */
export function combineByDate(flatData) {
  let combined = [];
  for (let index = 0; index < flatData.length; index++) {
    let listItem = flatData[index];
    let entry = combined.find(function (entryItem) {
      return entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.date === listItem.date;
    });
    if (entry) {
      entry.value += (listItem.value + 0);
    } else {
      let entry = {};
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.date)) entry.date = listItem.date;
      if (isValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      entry.value = (listItem.value || 0);
      combined.push(entry);
    }
  }
  return combined;
}

/**
 *
 * @param flatData
 * @returns {[]}
 */
export function combineByLocation(flatData) {
  let combined = [];
  for (let index = 0; index < flatData.length; index++) {
    let listItem = flatData[index];
    let entry = combined.find(function (entryItem) {
      return entryItem.dataset === listItem.dataset
        && entryItem.stack === listItem.stack
        && entryItem.label === listItem.label
        && entryItem.location === listItem.location;
    });
    if (entry) {
      entry.value += listItem.value;
    } else {
      let entry = {};
      if (isValue(listItem.label)) entry.label = listItem.label;
      if (isValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (isValue(listItem.stack)) entry.stack = listItem.stack;
      if (isValue(listItem.location)) entry.location = listItem.location;
      if (isValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (isValue(listItem.locationName)) entry.locationName = listItem.locationName;
      entry.value = listItem.value;
      combined.push(entry);
    }
  }
  return combined;
}
