/**
 * Returns a flat version of the given dataset collection.
 *
 * @param datasets The collection of datasets.
 * @returns {[]} The flat list of data items.
 */
export function flattenDatasets(datasets) {
  let flattenList = [];
  datasets.forEach(function (dataset) {
    dataset.data.forEach(item => {
      item.dataset = dataset.label;
      item.stack = dataset.stack;
      flattenList.push(item);
    });
  });
  return flattenList;
}

/**
 * Returns
 *
 * @param flattenList
 * @returns {[]}
 */
export function combine(flattenList) {
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
      entry.value += listItem.value;
    } else {
      let entry = {};
      if (listItem.label) entry.label = listItem.label;
      if (listItem.stack) entry.stack = listItem.stack;
      if (listItem.location) entry.location = listItem.location;
      if (listItem.locationTotal) entry.locationTotal = listItem.locationTotal;
      if (listItem.date) entry.date = listItem.date;
      if (listItem.dateTotal) entry.dateTotal = listItem.dateTotal;
      if (listItem.locationName) entry.locationName = listItem.locationName;
      if (listItem.value) entry.value = listItem.value;
      combined.push(entry);
    }
  }
  return combined;
}
