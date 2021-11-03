import {DatasetsController} from "./datasets.controller";
import {copy} from "../shared/copy";
import {validateDatasets} from "../data.juggle/data.validate";
import "./datasets.controller.snapshot";

/*
CRUD:
- create
- read
- update
- delete
 */

/**
 * Sets the given dataset.
 * @param dataset The new dataset.
 */
DatasetsController.prototype.setDataset = function (dataset) {
  this.cache.invalidate();
  this.setDatasets([dataset]);
};

/**
 * Updates the datasets of this controller.
 * @param datasets The new datasets.
 */
DatasetsController.prototype.setDatasets = function (datasets) {
  this.cache.invalidate();
  this.originalDatasets = datasets;
  this.datasets = copy(datasets);
  validateDatasets(datasets);
  this.datasetsDidChange();
};

/**
 * Appends the given dataset to this controller.
 * @param dataset The dataset to append.
 */
DatasetsController.prototype.addDataset = function (dataset) {
  this.cache.invalidate();
  this.addDatasets([dataset]);
};

/**
 * Appends the given datasets to this controller.
 * @param datasets The collection of datasets to add.
 */
DatasetsController.prototype.addDatasets = function (datasets) {
  if (!this.datasets || !Array.isArray(this.datasets)) return;
  if (!datasets || !Array.isArray(datasets)) return;
  if (this.datasets.find(dataset => dataset.label === datasets.label)) {
    throw new Error(`DatasetsController already contains a dataset with the same label (${datasets.label}).`);
  }
  this.cache.invalidate();
  datasets.forEach(dataset => this.datasets.push(dataset));
  this.datasetsDidChange();
  this.notifyListeners('datasets-update');
};

/**
 * Removes the dataset with the given label from this controller.  Will do nothing if no dataset
 * with the given label exists.
 *
 * @param label The label of the dataset to remove.
 */
DatasetsController.prototype.removeDataset = function (label) {
  this.cache.invalidate();
  this.removeDatasets([label]);
};

/**
 * Removes the given datasets from this controller.  Datasets this controller already containing will be ignored.
 * @param labels The collection of labels to remove.
 */
DatasetsController.prototype.removeDatasets = function (labels) {
  if (!this.datasets || !Array.isArray(this.datasets)) return;
  if (!labels || !Array.isArray(labels)) return;
  this.cache.invalidate();
  labels.forEach(function (label) {
    let candidate = this.datasets.find(dataset => dataset.label === label);
    if (!candidate) return;
    let index = this.datasets.indexOf(candidate);
    if (index < 0) return;
    this.datasets = this.datasets.splice(index, 1);
  }.bind(this));
  this.datasetsDidChange();
};
