import {DatasetsController} from "../data/datasets.controller";
import {combineByLocation, combineByStacks} from "../data.juggle/data.combine";

/**
 * Returns a new generated location dataview for the current selected data of datasets of this controller.
 *
 * A location dataview has the following form:
 * ```
 * {
 *   stacks: [String],
 *   items: [
 *     {
 *       dataset: String,
 *       stack: String,
 *       location: Any,
 *       value: Number
 *     }
 *   ]
 * }
 * ```
 */
DatasetsController.prototype.getLocationDataview = function () {

  let dataview = {};
  let flatData = this.enabledFlatData();
  let combinedByStack = combineByStacks(flatData);
  let combinedByLocation = combineByLocation(combinedByStack);

  dataview.stacks = this.stacks;
  dataview.combinedData = combinedByLocation;

  return dataview;
};
