import {combineByDate, combineByLocation, combineByStacks} from "../data.juggle/data.combine";
import {sumOfDataset, sumOfLabel, sumOfStack} from "../data.juggle/data.sum";
import {d3LibraryAccess} from "../shared/d3libaccess";
import {DefaultDateAccess} from "../data.date.assessor/date.assessor";
import {InvalidFormatError} from "../data.juggle/data.validate.error";
import {DataViewCache} from "../dataview/data.view.cache";

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
    if (!Array.isArray(datasets)) {
      throw new InvalidFormatError(`Datasets are not an array.`);
    }
    this.initialize(config || {});
    this.setDatasets(datasets);
  }

  initialize(config) {
    this.config = config;
    this.dateAccess = this.config.dateAccess || DefaultDateAccess;
    this.locationFilters = this.config.locationFilters || [];
    this.dateFilters = this.config.dateFilters || [];
    this.datasetFilters = this.config.datasetFilters || [];
    this.filters = {};
    this.cache = new DataViewCache();
    if (this.config.filters) {
      this.filters.locations = this.config.filters.locations || [];
      this.filters.dates = this.config.filters.dates || [];
      this.filters.datasets = this.config.filters.datasets || [];
    }
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
    return d3LibraryAccess.max(this.datasets, function (dataset) {
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
    if (!this.labels) return 'Unknown';
    let labels = this.labels.map(label => label.split(` `).join(`-`));
    if (labels.length > 10) {
      labels = labels.splice(0, 10);
    }
    return labels.join(',');
  }
}

/**
 *
 * @type {{
 * datasetsUpdate: string,
 * filterDates: string,
 * filterDataset: string,
 * filterLocations: string
 * resetFilters: string,
 * registration: string,
 * none: string,
 * datasetsSet: string
 * }}
 */
DatasetsController.NotificationReason = {
  none: 'none',
  registration: 'registration',
  datasetsSet: 'datasets-set',
  datasetsUpdate: 'datasets-update',
  filterDataset: 'dataset-filter',
  filterDates: 'dates-filter',
  filterLocations: 'location-filter',
  resetFilters: 'reset-filters'
};
