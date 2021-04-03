import {copy} from "../shared/copy";

function containsValue(value) {
  return value || value === 0;
}

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
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.location)) entry.location = listItem.location;
      if (containsValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (containsValue(listItem.date)) entry.date = listItem.date;
      if (containsValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (containsValue(listItem.locationName)) entry.locationName = listItem.locationName;
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
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.location)) entry.location = listItem.location;
      if (containsValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (containsValue(listItem.date)) entry.date = listItem.date;
      if (containsValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
      if (containsValue(listItem.locationName)) entry.locationName = listItem.locationName;
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
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.date)) entry.date = listItem.date;
      if (containsValue(listItem.dateTotal)) entry.dateTotal = listItem.dateTotal;
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
      if (containsValue(listItem.label)) entry.label = listItem.label;
      if (containsValue(listItem.dataset)) entry.dataset = listItem.dataset;
      if (containsValue(listItem.stack)) entry.stack = listItem.stack;
      if (containsValue(listItem.location)) entry.location = listItem.location;
      if (containsValue(listItem.locationTotal)) entry.locationTotal = listItem.locationTotal;
      if (containsValue(listItem.locationName)) entry.locationName = listItem.locationName;
      entry.value = listItem.value;
      combined.push(entry);
    }
  }
  return combined;
}
