import {DatasetsController} from "../data/datasets.controller";
import {combineByLocation, combineByStacks} from "../data.juggle/data.combine";

/**
 * Returns a new generated map data view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getMapDataview = function () {

  let dataview = {};
  let flatData = this.enabledFlatData();
  let combinedByStack = combineByStacks(flatData);
  dataview.combinedData = combineByLocation(combinedByStack);

  return dataview;
};
