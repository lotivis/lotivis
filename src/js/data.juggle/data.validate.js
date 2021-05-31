import {
  InvalidFormatError,
  MissingPropertyError
} from "./data.validate.error";

/**
 * Validates the given datasets.
 * @param datasets The datasets to validate.
 * @throws InvalidFormatError
 */
export function validateDatasets(datasets) {

  if (!datasets) {
    throw new InvalidFormatError(`No dataset given.`);
  } else if (!Array.isArray(datasets)) {
    throw new InvalidFormatError(`Expecting array of datasets.`);
  }

  for (let index = 0; index < datasets.length; index++) {
    validateDataset(datasets[index]);
  }
}

/**
 * Validates the given dataset.
 * @param dataset The dataset to validate.
 * @throws InvalidFormatError
 * @throws MissingPropertyError
 */
export function validateDataset(dataset) {
  if (!dataset) {
    throw new InvalidFormatError(`No dataset given.`);
  } else if (!dataset.label) {
    throw new MissingPropertyError(`Missing label for dataset. ${dataset}`);
  } else if (!dataset.data) {
    throw new MissingPropertyError(`Invalid data. Property is not an array. Dataset: ${dataset.label}`);
  } else if (!Array.isArray(dataset.data)) {
    throw new InvalidFormatError(`Invalid data. Property is not an array. Dataset: ${dataset.label}`);
  }

  let data = dataset;
  for (let index = 0; index < data.length; index++) {
    validateDataItem(data[index]);
  }
}

/**
 * Validates the given datasets.controller item by ensuring it has a valid `time`, `location` and `value` property value.
 * @param item The datasets.controller item to validate.
 * @throws MissingPropertyError
 */
export function validateDataItem(item) {
  if (!item.date) {
    throw new MissingPropertyError(`Missing date property for item.`, item);
  } else if (!item.location) {
    throw new MissingPropertyError(`Missing location property for item.`, item);
  }
}
