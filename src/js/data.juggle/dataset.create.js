/**
 * Returns a dataset collection created from the given flat samples collection.
 * @param flatData The flat samples collection.
 * @returns {[]} A collection of datasets.
 */
export function createDatasets(flatData) {
  let datasetsByLabel = {};

  for (let itemIndex = 0; itemIndex < flatData.length; itemIndex++) {
    let item = flatData[itemIndex];

    if (!validateDataItem(item)) {
      // console.log('item');
      // console.log(item);
    }

    let label = item.dataset || item.label;
    let dataset = datasetsByLabel[label];

    if (dataset) {
      dataset.data.push({
        date: item.date,
        location: item.location,
        value: item.value
      });
    } else {
      datasetsByLabel[label] = {
        label: label,
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
  let labels = Object.getOwnPropertyNames(datasetsByLabel);

  for (let index = 0; index < labels.length; index++) {
    let label = labels[index];
    if (label.length === 0) continue;
    datasets.push(datasetsByLabel[label]);
  }

  return datasets;
}

function validateDataItem(item) {
  return (item.label || item.dataset) && item.date && item.location && (item.value || item.value === 0)  ;
}
