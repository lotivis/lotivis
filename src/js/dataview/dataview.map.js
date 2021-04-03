import {DatasetsController} from "../data/datasets.controller";

/**
 * Returns a new generated map data view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getMapDataview = function () {

  let dateAccess = this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};

  return dataview;
};
