import {verbose_log} from "../shared/debug";

export function createDatasets(flatData) {
  let datasetsByLabel = {};
  for (let itemIndex = 0; itemIndex < flatData.length; itemIndex++) {
    let item = flatData[itemIndex];
    let dataset = datasetsByLabel[item.label];
    if (dataset) {
      dataset.data.push({
        date: item.date,
        location: item.location,
        value: item.value
      });
    } else {
      datasetsByLabel[item.label] = {
        label: item.label,
        stack: item.stack,
        data: [{
          date: item.date,
          location: item.location,
          value: item.value
        }]
      };
    }
  }

  let datasets = [];
  let properties = Object.getOwnPropertyNames(datasetsByLabel);

  for (let index = 0; index < properties.length; index++) {
    let label = properties[index];
    if (label.length === 0) continue;
    datasets.push(datasetsByLabel[label]);
  }

  return datasets;
}
