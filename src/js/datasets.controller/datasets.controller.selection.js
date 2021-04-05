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

/**
 *
 */
DatasetsController.prototype.getSelection = function () {
  return this.selection;
};

/**
 *
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
 *
 */
DatasetsController.prototype.update = function () {
  if (!this.datasets || !Array.isArray(this.datasets)) return;

  let dateAccess = this.dateAccess;
  this.workingDatasets = copy(this.datasets)
    .sort((left, right) => left.label > right.label);
  this.workingDatasets.forEach(function (dataset) {
    dataset.isEnabled = true;
    dataset.data.forEach(function (item) {
      item.dateNumeric = dateAccess(item.date);
    });
    dataset.data = dataset.data
      .sort((left, right) => left.dateNumeric - right.dateNumeric);
  });

  this.flatData = flatDatasets(this.workingDatasets);
  this.labels = extractLabelsFromDatasets(this.datasets);
  this.stacks = extractStacksFromDatasets(this.datasets);
  this.dates = extractDatesFromDatasets(this.datasets)
    .sort((left, right) => dateAccess(left) - dateAccess(right));

  this.locations = extractLocationsFromDatasets(this.datasets);
  this.datasetsColorsController = new DatasetsColorsController(this.workingDatasets, this.stacks);

  this.calculateSelection();

  // this.dateAccess = function (date) {
  //   return Date.parse(date);
  // };

  // this.locationFilters = [];
  // this.dateFilters = [];
  // this.datasetFilters = [];
  this.notifyListeners(DatasetsController.NotificationReason.datasetsUpdate);
};
