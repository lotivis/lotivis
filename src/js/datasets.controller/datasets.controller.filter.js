import {DatasetsController} from "./datasets.controller";
import {objectsEqual} from "../shared/equal";
import {lotivis_log} from "../shared/debug";
import {copy} from "../shared/copy";

/**
 * Resets all filters.  Notifies listeners.
 */
DatasetsController.prototype.resetFilters = function (notifyListeners = true) {
  this.filters.locations = [];
  this.filters.dates = [];
  this.filters.labels = [];
  this.calculateSnapshot();
  if (!notifyListeners) return;
  this.notifyListeners('reset-filters');
};

/**
 * Resets locations filters.  Notifies listeners.
 */
DatasetsController.prototype.resetLocationFilters = function (notifyListeners = true) {
  this.filters.locations = [];
  this.calculateSnapshot();
  if (!notifyListeners) return;
  this.notifyListeners('reset-location-filters');
};

/**
 * Resets date filters.  Notifies listeners.
 */
DatasetsController.prototype.resetDateFilters = function (notifyListeners = true) {
  this.filters.dates = [];
  this.calculateSnapshot();
  if (!notifyListeners) return;
  this.notifyListeners('reset-dates-filters');
};

/**
 * Resets label filters.  Notifies listeners.
 */
DatasetsController.prototype.resetLabelFilters = function (notifyListeners = true) {
  this.filters.labels = [];
  this.calculateSnapshot();
  if (!notifyListeners) return;
  this.notifyListeners('reset-dates-filters');
};

/**
 * Sets the locations filter.  Notifies listeners.
 *
 * @param locations The locations to filter.
 */
DatasetsController.prototype.setLocationsFilter = function (locations) {
  let stringVersions = locations.map(location => String(location)).filter(item => item.length > 0);
  if (objectsEqual(this.filters.locations, stringVersions)) {
    return lotivis_log(`[lotivis]  Location filters not changed.`);
  }
  this.filters.locations = stringVersions;
  this.calculateSnapshot();
  this.notifyListeners('filter-locations');
};

DatasetsController.prototype.toggleLocation = function (location) {
  const index = this.filters.locations.indexOf(location);
  if (index !== -1) {
    this.filters.locations.splice(index, 1);
  } else {
    this.filters.locations.push(location);
  }
  this.calculateSnapshot();
  this.notifyListeners('filter-locations');
};

/**
 * Sets the dates filter.  Notifies listeners.
 * @param dates The dates to filter.
 */
DatasetsController.prototype.setDatesFilter = function (dates) {
  let stringVersions = dates.map(date => String(date)).filter(item => item.length > 0);
  if (objectsEqual(this.filters.dates, stringVersions)) return lotivis_log(`[lotivis]  Date filters not changed.`);
  this.filters.dates = stringVersions;
  this.calculateSnapshot();
  this.notifyListeners('filter-dates');
  lotivis_log('filter-dates:', this.filters.dates);
};

DatasetsController.prototype.toggleDate = function (date) {
  const index = this.filters.dates.indexOf(date);
  if (index !== -1) {
    this.filters.dates.splice(index, 1);
  } else {
    this.filters.dates.push(date);
  }
  this.calculateSnapshot();
  this.notifyListeners('filter-dates');
};

/**
 * Sets the datasets filter.  Notifies listeners.
 *
 * @param datasets The datasets to filter.
 */
DatasetsController.prototype.setDatasetsFilter = function (datasets) {
  let stringVersions = datasets.map(dataset => String(dataset)).filter(item => item.length > 0);
  if (objectsEqual(this.filters.labels, stringVersions)) return lotivis_log(`[lotivis]  Dataset filters not changed.`);
  this.filters.labels = stringVersions;
  this.calculateSnapshot();
  this.notifyListeners('filter-labels');
  lotivis_log('filter-labels:', this.filters.labels);
};

/**
 * Toggles the enabled of the dataset with the given label.
 *
 * @param label The label of the dataset.
 * @param notifyListeners A boolean value indicating whether to notify the listeners.  Default is `true`.
 */
DatasetsController.prototype.toggleDataset = function (label, notifyListeners = true) {

  let index = this.filters.labels.indexOf(label);
  if (index !== -1) {
    this.filters.labels.splice(index, 1);
  } else {
    this.filters.labels.push(String(label));
  }

  if (!notifyListeners) return;
  this.calculateSnapshot();
  this.notifyListeners('dataset-toggle');
};

/**
 * Returns a newly generated collection containing all enabled datasets.
 *
 * @returns {*} The collection of enabled datasets.
 */
DatasetsController.prototype.filteredDatasets = function () {
  let filtered = copy(this.datasets);

  if (this.filters.labels && this.filters.labels.length > 0) {
    let datasetFilters = this.filters.labels;
    filtered = filtered.filter(function (dataset) {
      return datasetFilters.includes(String(dataset.label));
    });
  }

  if (this.filters.locations && this.filters.locations.length > 0) {
    let locationFilters = this.filters.locations;
    filtered = filtered.map(function (dataset) {
      dataset.data = dataset.data
        .filter(data => locationFilters.includes(String(data.location))) || [];
      return dataset;
    });
  }

  if (this.filters.dates && this.filters.dates.length > 0) {
    let dateFilters = this.filters.dates;
    filtered = filtered.map(function (dataset) {
      dataset.data = dataset.data
        .filter(data => dateFilters.includes(String(data.date))) || [];
      return dataset;
    });
  }

  return filtered.filter(dataset => dataset.data.length > 0);
};
