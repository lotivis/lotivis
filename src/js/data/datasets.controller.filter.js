import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets,
  extractStacksFromDatasets
} from "../data.juggle/dataset.extract";
import {DatasetsController} from "./datasets.controller";
import {flatDatasets} from "../data.juggle/dataset.flat";
import {copy} from "../shared/copy";
import {objectsEqual} from "../shared/equal";
import {debug_log} from "../shared/debug";

/**
 * Resets all filters.  Notifies listeners.
 */
DatasetsController.prototype.resetFilters = function (notifyListeners = true) {
  this.locationFilters = [];
  this.dateFilters = [];
  this.datasetFilters = [];
  if (!notifyListeners) return;
  this.notifyListeners(DatasetsController.NotificationReason.resetFilters);
};

/**
 * Sets the locations filter.  Notifies listeners.
 * @param locations The locations to filter.
 */
DatasetsController.prototype.setLocationsFilter = function (locations) {
  let stringVersions = locations.map(location => String(location));
  if (objectsEqual(this.locationFilters, stringVersions)) {
    return debug_log(`Date filters not changed.`);
  }
  this.resetFilters(false);
  this.locationFilters = stringVersions;
  this.notifyListeners(DatasetsController.NotificationReason.locationFilters);
};

/**
 * Sets the dates filter.  Notifies listeners.
 * @param dates The dates to filter.
 */
DatasetsController.prototype.setDatesFilter = function (dates) {
  let stringVersions = dates.map(date => String(date));
  if (objectsEqual(this.dateFilters, stringVersions)) {
    return debug_log(`Date filters not changed.`);
  }
  this.resetFilters(false);
  this.dateFilters = stringVersions;
  this.notifyListeners(DatasetsController.NotificationReason.dateFilters);
};

/**
 * Sets the datasets filter.  Notifies listeners.
 * @param datasets The datasets to filter.
 */
DatasetsController.prototype.setDatasetsFilter = function (datasets) {
  let stringVersions = datasets.map(dataset => String(dataset));
  if (objectsEqual(this.datasetFilters, stringVersions)) {
    return debug_log(`Dataset filters not changed.`);
  }
  this.resetFilters(false);
  this.datasetFilters = stringVersions;
  this.notifyListeners(DatasetsController.NotificationReason.filterDataset);
};

/**
 * Toggles the enabled of the dataset with the given label.
 * @param label The label of the dataset.
 * @param notifyListeners A boolean value indicating whether to notify the listeners.  Default is `true`.
 */
DatasetsController.prototype.toggleDataset = function (label, notifyListeners=true) {
  this.workingDatasets.forEach(function (dataset) {
    if (dataset.label === label) {
      dataset.isEnabled = !dataset.isEnabled;
    }
  });
  if (!notifyListeners) return;
  this.notifyListeners('dataset-toggle');
};

/**
 * Enables all datasets.  Notifies listeners.
 */
DatasetsController.prototype.enableAllDatasets = function () {
  this.workingDatasets.forEach(function (dataset) {
    dataset.isEnabled = true;
  });
  this.notifyListeners('dataset-enable-all');
};

/**
 * Returns a newly generated collection containing all enabled datasets.
 * @returns {*} The collection of enabled datasets.
 */
DatasetsController.prototype.enabledDatasets = function () {
  let aCopy = copy(this.workingDatasets);

  let enabled = aCopy
    .filter(dataset => dataset.isEnabled === true);

  if (this.datasetFilters && this.datasetFilters.length > 0) {
    enabled = enabled.filter(dataset => this.datasetFilters.includes(dataset.label));
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

  return enabled;
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
