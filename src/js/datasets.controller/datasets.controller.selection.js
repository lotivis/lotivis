import {DatasetsController} from "./datasets.controller";
import {copy} from "../shared/copy";
import {flatDatasets} from "../data.juggle/data.flat";
import {
  extractDatesFromDatasets, extractDatesFromFlatData,
  extractLabelsFromDatasets,
  extractLocationsFromDatasets, extractLocationsFromFlatData,
  extractStacksFromDatasets
} from "../data.juggle/data.extract";
import {DatasetsColorsController} from "./datasets.controller.colors";
import {lotivis_log} from "../shared/debug";

/**
 * Returns the current selection.
 */
DatasetsController.prototype.getSelection = function () {
  return this.selection;
};

/**
 * Calculates the current selection dependant on the set filters.
 */
DatasetsController.prototype.calculateSelection = function () {
  let selectedData = this.enabledDatasets();
  let flatData = flatDatasets(selectedData);
  this.selection = {
    labels: extractLabelsFromDatasets(selectedData),
    stacks: extractStacksFromDatasets(selectedData),
    dates: extractDatesFromFlatData(flatData),
    locations: extractLocationsFromFlatData(flatData),
    datasets: selectedData,
    flatData: flatData,
  };
};

/**
 * Calculates the additional data.
 */
DatasetsController.prototype.calculateAdditionalData = function () {
  let dateAccess = this.dateAccess;

  this.datasets = copy(this.datasets)
    .sort((left, right) => left.label > right.label);

  this.datasets.forEach(function (dataset) {
    dataset.isEnabled = true;
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
  this.calculateSelection();
  this.notifyListeners(DatasetsController.NotificationReason.datasetsUpdate);
};
