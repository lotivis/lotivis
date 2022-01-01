import { DatasetsController } from "../datasets.controller/datasets.controller";
import {
  combineByLocation,
  combineByStacks
} from "../data.juggle/data.combine";
import "../datasets.controller/datasets.controller.cache";

/**
 * Returns a new generated location data view for the current selected datasets.controller of datasets of this controller.
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
DatasetsController.prototype.getLocationDataview = function() {
  let cachedDataView = this.getCached("location");
  if (cachedDataView) {
    return cachedDataView;
  }

  let dataView = {};

  let flatData = this.snapshot.flatData;
  let combinedByStack = combineByStacks(flatData);
  let combinedByLocation = combineByLocation(combinedByStack);

  dataView.stacks = this.stacks;
  dataView.combinedData = combinedByLocation;

  dataView.combinedData.forEach(item => {
    item.stack = item.stack || item.label || item.dataset;
  });

  this.setCached(dataView, "location");

  return dataView;
};
