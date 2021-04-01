export function validateDataset(dataset) {
  if (!dataset) {
    throw Error(`No dataset given.`);
  } else if (!dataset.label) {
    throw Error(`Missing label for dataset. ${dataset}`);
  } else if (dataset.data && !Array.isArray(dataset.data)) {
    throw Error(`Invalid data. Property is not an array. Dataset: ${dataset.label}`);
  }
}

export function validateDatasets(datasets) {
  if (!datasets) {
    throw Error(`No dataset given.`);
  } else if (!Array.isArray(datasets)) {
    throw Error(`Datasets argument is not an array.`);
  }

  for (let index = 0; index < datasets.length; index++) {
    let dataset = datasets[index];
    validateDataset(dataset);
  }
}
