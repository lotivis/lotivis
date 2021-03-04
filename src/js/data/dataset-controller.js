import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets,
  extractLocationsFromDatasets, extractStacksFromDatasets
} from "../data-juggle/dataset-extract";
import {flatDatasets} from "../data-juggle/dataset-flat";
import {copy} from "../shared/copy";
import {combineByDate, combineByLocation, combineByStacks} from "../data-juggle/dataset-combine";
import {sumOfDataset, sumOfLabel, sumOfStack} from "../data-juggle/dataset-sum";
import {log_debug} from "../shared/debug";

/**
 *
 * @class DatasetController
 */
export class DatasetController {

  constructor(datasets) {
    this.datasets = copy(datasets);
    this.workingDatasets = copy(datasets)
      .sort((left, right) => left.label > right.label);
    this.workingDatasets.forEach(dataset => dataset.isEnabled = true);
    this.flatData = flatDatasets(this.workingDatasets);
    this.labels = extractLabelsFromDatasets(datasets);
    this.stacks = extractStacksFromDatasets(datasets);
    this.dates = extractDatesFromDatasets(datasets);
    this.locations = extractLocationsFromDatasets(datasets);
  }

  get flatDataCombinedStacks() {
    return combineByStacks(this.flatData);
  }

  get flatDataCombinedDates() {
    return combineByDate(this.flatData);
  }

  get flatDataCombinedLocations() {
    return combineByLocation(this.flatData);
  }

  getSumOfLabel(label) {
    return sumOfLabel(this.flatData, label);
  }

  getSumOfDataset(dataset) {
    return sumOfDataset(this.flatData, dataset);
  }

  getSumOfStack(stack) {
    return sumOfStack(this.flatData, stack);
  }
}
