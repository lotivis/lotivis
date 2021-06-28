import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets,
  extractStacksFromDatasets
} from "../data.juggle/data.extract";
import {DatasetsController} from "./datasets.controller";
import {flatDatasets} from "../data.juggle/data.flat";
import {objectsEqual} from "../shared/equal";
import {lotivis_log} from "../shared/debug";
import {copy} from "../shared/copy";

/**
 * Resets all filters.  Notifies listeners.
 */
DatasetsController.prototype.resetFilters = function (notifyListeners = true) {
  this.locationFilters = [];
  this.dateFilters = [];
  this.datasetFilters = [];
  this.calculateSelection();
  if (!notifyListeners) return;
  this.notifyListeners(DatasetsController.NotificationReason.resetFilters);
};

/**
 * Sets the locations filter.  Notifies listeners.
 * @param locations The locations to filter.
 */
DatasetsController.prototype.setLocationsFilter = function (locations) {
  let stringVersions = locations.map(location => String(location)).filter(item => item.length > 0);
  if (objectsEqual(this.locationFilters, stringVersions)) {
    return lotivis_log(`[lotivis]  Location filters not changed.`);
  }
  this.locationFilters = stringVersions;
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.filterLocations);
};

/**
 * Sets the dates filter.  Notifies listeners.
 * @param dates The dates to filter.
 */
DatasetsController.prototype.setDatesFilter = function (dates) {
  let stringVersions = dates.map(date => String(date)).filter(item => item.length > 0);
  if (objectsEqual(this.dateFilters, stringVersions)) return lotivis_log(`[lotivis]  Date filters not changed.`);
  this.dateFilters = stringVersions;
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.filterDates);
};

/**
 * Sets the datasets filter.  Notifies listeners.
 * @param datasets The datasets to filter.
 */
DatasetsController.prototype.setDatasetsFilter = function (datasets) {
  let stringVersions = datasets.map(dataset => String(dataset)).filter(item => item.length > 0);
  if (objectsEqual(this.datasetFilters, stringVersions)) return lotivis_log(`[lotivis]  Dataset filters not changed.`);
  this.datasetFilters = stringVersions;
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.filterDataset);
};

/**
 * Toggles the enabled of the dataset with the given label.
 * @param label The label of the dataset.
 * @param notifyListeners A boolean value indicating whether to notify the listeners.  Default is `true`.
 */
DatasetsController.prototype.toggleDataset = function (label, notifyListeners = true) {
  this.datasets.forEach((dataset) => {
    if (dataset.label !== label) return;
    dataset.isEnabled = !dataset.isEnabled;
  });

  // let index = this.datasetFilters.indexOf(label);
  // if (index !== -1) {
  //   this.datasetFilters.splice(index, 1);
  // } else {
  //   this.datasetFilters.push(String(label));
  // }

  if (!notifyListeners) return;
  this.notifyListeners('dataset-toggle');
};

/**
 * Enables all datasets.  Notifies listeners.
 */
DatasetsController.prototype.enableAllDatasets = function () {
  this.datasets.forEach(dataset => dataset.isEnabled = true);
  this.notifyListeners('dataset-enable-all');
};

/**
 * Returns the flat version of the collection of enabled datasets.
 * @returns {[]}
 */
DatasetsController.prototype.enabledFlatData = function () {
  return flatDatasets(this.enabledDatasets());
};

/**
 * Returns the set of labels of the enabled datasets.
 * @returns {*[]} The set of labels.
 */
DatasetsController.prototype.enabledLabels = function () {
  return extractLabelsFromDatasets(this.enabledDatasets());
};

/**
 * Returns the set of stacks of the enabled datasets.
 * @returns {*[]} The set of stacks.
 */
DatasetsController.prototype.enabledStacks = function () {
  return extractStacksFromDatasets(this.enabledDatasets());
};

/**
 * Returns the set of dates of the enabled datasets.
 * @returns {*[]} The set of dates.
 */
DatasetsController.prototype.enabledDates = function () {
  return extractDatesFromDatasets(this.enabledDatasets());
};

/**
 * Returns a newly generated collection containing all enabled datasets.
 * @returns {*} The collection of enabled datasets.
 */
DatasetsController.prototype.enabledDatasets = function () {
  let aCopy = copy(this.datasets);

  let enabled = aCopy
    .filter(dataset => dataset.isEnabled === true);

  if (this.datasetFilters && this.datasetFilters.length > 0) {
    let datasetFilters = this.datasetFilters;
    enabled = enabled.filter(function (dataset) {
      return datasetFilters.includes(String(dataset.label));
    });
  }

  if (this.locationFilters && this.locationFilters.length > 0) {
    let locationFilters = this.locationFilters;
    enabled = enabled.map(function (dataset) {
      dataset.data = dataset.data
        .filter(data => locationFilters.includes(String(data.location))) || [];
      return dataset;
    });
  }

  if (this.dateFilters && this.dateFilters.length > 0) {
    let dateFilters = this.dateFilters;
    enabled = enabled.map(function (dataset) {
      dataset.data = dataset.data
        .filter(data => dateFilters.includes(String(data.date))) || [];
      return dataset;
    });
  }

  return enabled.filter(dataset => dataset.data.length > 0);
};
