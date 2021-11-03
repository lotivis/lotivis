import {DatasetsController} from "./datasets.controller";
import {flatDatasets} from "../data.juggle/data.flat";
import {
  extractDatesFromDatasets,
  extractDatesFromFlatData,
  extractLabelsFromDatasets, extractLocationsFromDatasets,
  extractLocationsFromFlatData,
  extractStacksFromDatasets
} from "../data.juggle/data.extract";
import {copy} from "../shared/copy";
import {DatasetsColorsController} from "./datasets.controller.colors";
import {lotivis_log} from "../shared/debug";

/**
 */
DatasetsController.prototype.calculateSnapshot = function () {
  this.snapshot = {};
  this.snapshot.datasets = this.filteredDatasets();
  this.snapshot.flatData = flatDatasets(this.snapshot.datasets);
  this.snapshot.labels = extractLabelsFromDatasets(this.snapshot.datasets);
  this.snapshot.stacks = extractStacksFromDatasets(this.snapshot.datasets);
  this.snapshot.dates = extractDatesFromFlatData(this.snapshot.datasets)
    .sort((left, right) => this.dateAccess(left) - this.dateAccess(right));
  this.snapshot.locations = extractLocationsFromFlatData(this.snapshot.datasets);
};

/**
 * Calculates the additional data.
 */
DatasetsController.prototype.calculateAdditionalData = function () {
  let dateAccess = this.dateAccess;

  this.datasets = copy(this.datasets)
    .sort((left, right) => left.label > right.label);

  this.datasets.forEach(function (dataset) {
    dataset.data.forEach(function (item) {
      item.dateNumeric = dateAccess(item.date);
    });
    dataset.data = dataset.data
      .sort((left, right) => left.dateNumeric - right.dateNumeric);
  });

  this.flatData = flatDatasets(this.datasets);
  this.labels = extractLabelsFromDatasets(this.datasets);
  this.stacks = extractStacksFromDatasets(this.datasets);
  this.dates = extractDatesFromDatasets(this.datasets)
    .sort((left, right) => dateAccess(left) - dateAccess(right));

  this.locations = extractLocationsFromDatasets(this.datasets);
  this.datasetsColorsController = new DatasetsColorsController(this.datasets, this.stacks);
};

/**
 * Tells this datasets controller that its datasets did change.
 */
DatasetsController.prototype.datasetsDidChange = function () {
  if (!this.datasets || !Array.isArray(this.datasets)) {
    lotivis_log('[lotivis]  No datasets.');
    return;
  }

  this.calculateAdditionalData();
  this.calculateSnapshot();
  this.notifyListeners('datasets-update');
};
