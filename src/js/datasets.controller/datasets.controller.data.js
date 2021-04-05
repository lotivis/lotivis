import {DatasetsController} from "./datasets.controller";
import {copy} from "../shared/copy";

/**
 * Updates the datasets of this controller.
 * @param datasets The new datasets.
 */
DatasetsController.prototype.setDatasets = function (datasets) {
  this.originalDatasets = datasets;
  this.datasets = copy(datasets);
  this.update();
};

/**
 * Appends the given dataset to this controller.
 * @param additionalDataset The dataset to append.
 */
DatasetsController.prototype.addDataset = function (additionalDataset) {
  if (this.datasets.find(dataset => dataset.label === additionalDataset.label)) {
    throw new Error(`DatasetsController already contains a dataset with the same label (${additionalDataset.label}).`);
  }
  this.datasets.push(additionalDataset);
  this.calculateSelection();
  this.update();
};

/**
 * Removes the dataset with the given label from this controller. Will do nothing if no dataset
 * with the given label exists.
 * @param label The label of the dataset to removeDataset.
 */
DatasetsController.prototype.removeDataset = function (label) {
  if (!this.datasets || !Array.isArray(this.datasets)) return;
  let candidate = this.datasets.find(dataset => dataset.label === label);
  if (!candidate) return;
  let index = this.datasets.indexOf(candidate);
  if (index < 0) return;
  this.datasets = this.datasets.splice(index, 1);
  this.calculateSelection();
  this.update();
};
