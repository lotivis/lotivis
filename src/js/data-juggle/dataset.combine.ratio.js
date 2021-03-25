import {combine, combineByDate} from "./dataset.combine";
import '../shared/arrays';
import {sumOfValues} from "./dataset.sum";
import {verbose_log} from "../shared/debug";
import {copy} from "../shared/copy";

/**
 * Combines each `ratio` entries to one.
 * @param datasets The datasets collection.
 * @param ratio The ratio.
 */
export function combineDatasetsByRatio(datasets, ratio) {
  let copied = copy(datasets);
  for (let index = 0; index < copied.length; index++) {
    let dataset = copied[index];
    let data = dataset.data;
    dataset.data = combineDataByGroupsize(data, ratio);
    copied[index] = dataset;
  }
  return copied;
}

/**
 *
 * @param data
 * @param ratio
 */
export function combineDataByGroupsize(data, ratio) {
  if (!data || data.length <= ratio) return data;
  let combined = combineByDate(data);
  let newData = [];

  while (combined.length > 0) {
    let dateGroup = combined.splice(0, ratio);
    let firstItem = dateGroup.first();
    let lastItem = dateGroup.last();
    let item = {};
    item.dataset = firstItem.dataset;
    item.stack = firstItem.stack;
    item.date = firstItem.date;
    item.date = firstItem.date;
    item.from = firstItem.date;
    item.till = lastItem.date;
    item.value = sumOfValues(dateGroup);
    newData.push(item);
  }

  return newData;
}
