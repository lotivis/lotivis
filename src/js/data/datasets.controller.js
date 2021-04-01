import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets,
  extractLocationsFromDatasets,
  extractStacksFromDatasets
} from "../data-juggle/dataset.extract";
import {flatDatasets} from "../data-juggle/dataset.flat";
import {copy} from "../shared/copy";
import {combineByDate, combineByLocation, combineByStacks} from "../data-juggle/dataset.combine";
import {sumOfDataset, sumOfLabel, sumOfStack} from "../data-juggle/dataset.sum";
import {DatasetsColorsController} from "./datasets.colors.controller";

/**
 *
 * @class DatasetsController
 */
export class DatasetsController {

  /**
   * Creates a new instance of DatasetsController
   * @param datasets The datasets to control.
   */
  constructor(datasets) {
    this.setDatasets(datasets);
  }

  // setDatasets(datasets) {
  //   this.datasets = copy(datasets);
  //   this.workingDatasets = copy(datasets)
  //     .sort((left, right) => left.label > right.label);
  //   this.workingDatasets.forEach(dataset => dataset.isEnabled = true);
  //   this.flatData = flatDatasets(this.workingDatasets);
  //   this.labels = extractLabelsFromDatasets(datasets);
  //   this.stacks = extractStacksFromDatasets(datasets);
  //   this.dates = extractDatesFromDatasets(datasets);
  //   this.locations = extractLocationsFromDatasets(datasets);
  //   this.datasetsColorsController = new DatasetsColorsController(this);
  //   this.dateAccess = function (date) {
  //     return Date.parse(date);
  //   };
  //
  //   this.locationFilters = [];
  //   this.dateFilters = [];
  //   this.datasetFilters = [];
  // }

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

  getMax() {
    return d3.max(this.workingDatasets, function (dataset) {
      return d3.max(dataset.data, function (item) {
        return item.value;
      });
    });
  }

  // MARK: - Colors

  getColorForDataset(label) {
    return this.datasetsColorsController.colorForDataset(label);
  }

  getColorForStack(stack) {
    return this.datasetsColorsController.colorForStack(stack);
  }

  getColorsForStack(stack) {
    return this.datasetsColorsController.colorsForStack(stack);
  }
}
