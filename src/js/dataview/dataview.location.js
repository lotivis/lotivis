import {DatasetsController} from "../datasets.controller/datasets.controller";
import {combineByLocation, combineByStacks} from "../data.juggle/data.combine";
import {lotivis_log} from "../shared/debug";

/**
 * Returns a new generated location dataview for the current selected datasets.controller of datasets of this controller.
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

  let cachedDataView = this.getCached('location');
  if (cachedDataView) {
    return cachedDataView;
  }

  let dataview = {};
  let flatData = this.enabledFlatData();
  let combinedByStack = combineByStacks(flatData);
  let combinedByLocation = combineByLocation(combinedByStack);

  dataview.stacks = this.stacks;
  dataview.combinedData = combinedByLocation;

  dataview.combinedData.forEach(item => {
    item.stack = item.stack || item.label || item.dataset;
  });

  this.setCached(dataview, 'location');

  return dataview;
};
