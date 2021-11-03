import {Chart} from "./chart";
import {DatasetsController} from "../datasets.controller/datasets.controller";

/**
 * Sets a new datasets controller.  The chart is updated automatically.
 * @param newController The new datasets controller.
 */
Chart.prototype.setDatasetsController = function (newController) {
  if (this.datasetController) this.datasetController.removeListener(this);
  this.datasetController = newController;
  this.datasetController.addListener(this);
  this.update(newController, 'registration');
};

/**
 * Sets the datasets of this map.chart chart.
 * @param newDatasets The new dataset.
 */
Chart.prototype.setDatasets = function (newDatasets) {
  this.setDatasetsController(new DatasetsController(newDatasets));
};

/**
 * Returns the presented datasets.
 * @returns {[*]} The collection of datasets.
 */
Chart.prototype.getDatasets = function () {
  if (!this.datasetController || !Array.isArray(this.datasetController.datasets)) return [];
  return this.datasetController.datasets;
};
