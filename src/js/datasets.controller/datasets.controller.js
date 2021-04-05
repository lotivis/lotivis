import {combineByDate, combineByLocation, combineByStacks} from "../data.juggle/data.combine";
import {sumOfDataset, sumOfLabel, sumOfStack} from "../data.juggle/data.sum";
import {d3LibraryAccess} from "../shared/d3libaccess";
import {DefaultDateAccess} from "../data.date.assessor/date.assessor";
import {InvalidFormatError} from "../data.juggle/data.validate.error";

/**
 * Controls a collection of datasets.
 * @class DatasetsController
 */
export class DatasetsController {

  /**
   * Creates a new instance of DatasetsController
   * @param datasets The datasets to control.
   * @param config
   */
  constructor(datasets, config) {
    if (!Array.isArray(datasets)) throw new InvalidFormatError();
    this.initialize(config || {});
    this.setDatasets(datasets);
  }

  initialize(config) {
    this.config = config;
    this.dateAccess = this.config.dateAccess || DefaultDateAccess;
    this.locationFilters = this.config.locationFilters || [];
    this.dateFilters = this.config.dateFilters || [];
    this.datasetFilters = this.config.datasetFilters || [];
  }

  getFlatDataCombinedStacks() {
    return combineByStacks(this.flatData);
  }

  getFlatDataCombinedDates() {
    return combineByDate(this.flatData);
  }

  getFlatDataCombinedLocations() {
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
    return d3LibraryAccess.max(this.workingDatasets, function (dataset) {
      return d3LibraryAccess.max(dataset.data, function (item) {
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

  /**
   * Returns a string that can be used as filename for downloads.
   */
  getFilename() {
    return this.labels.join(',');
  }
}
