import { isValue } from "../common/is.value.js";

export function DataItem(item) {
  return { date: item.date, location: item.location, value: item.value };
}

export function Dataset(item) {
  let set = { label: item.label, data: [DataItem(item)] };
  if (isValue(item.stack)) set.stack = item.stack;
  return set;
}

export function toDataset(data) {
  let datasets = [],
    item,
    set;

  for (let i = 0; i < data.length; i++) {
    item = data[i];
    set = datasets.find((d) => d.label === item.label);

    if (set) {
      set.data.push(DataItem(item));
    } else {
      datasets.push(Dataset(item));
    }
  }

  return datasets;
}
