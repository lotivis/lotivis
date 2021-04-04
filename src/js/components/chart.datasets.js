import {Chart} from "./chart";
import {DatasetsController} from "../data/datasets.controller";

/**
 * Sets a new datasets controller.  The chart is updated automatically.
 * @param newController The new datasets controller.
 */
Chart.prototype.setDatasetController = function (newController) {
  this.datasetController = newController;
  this.datasetController.addListener(this);
  this.update(newController, 'registration');
};

/**
 * Sets the datasets of this map chart.
 * @param newDatasets The new dataset.
 */
Chart.prototype.setDatasets = function (newDatasets) {
  this.setDatasetController(new DatasetsController(newDatasets));
};

/**
 * Returns the presented datasets.
 * @returns {[*]} The collection of datasets.
 */
Chart.prototype.getDatasets = function () {
  if (!this.datasetController || !Array.isArray(this.datasetController.datasets)) return [];
  return this.datasetController.datasets;
};
