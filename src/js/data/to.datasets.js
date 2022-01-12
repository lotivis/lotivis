import { isValue } from "../common/is.value.js";

export function toDataset(data) {
  let datasets = {},
    item,
    dataset;

  for (let i = 0; i < data.length; i++) {
    item = data[i];
    dataset = datasets[item.label];

    if (dataset) {
      dataset.data.push({
        date: item.date,
        location: item.location,
        value: item.value,
        stack: isValue(item.stack) ? item.stack : undefined,
      });
    } else {
      datasets[item.label] = {
        label: item.label,
        stack: isValue(item.stack) ? item.stack : undefined,
        data: [
          {
            date: item.date,
            location: item.location,
            value: item.value,
          },
        ],
      };
    }
  }

  return datasets;
}
