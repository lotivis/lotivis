import { rollup, sum, max } from "d3";

/**
 * Returns a new generated location data view for the current selected datasets.controller of datasets of this controller.
 *
 * A location dataView has the following form:
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
export function dataViewMap(dataController) {
  let data = dataController.snapshotOrData();
  // console.log("data", data);

  let byLocationLabel = rollup(
    data,
    (v) => sum(v, (d) => d.value),
    (d) => d.location,
    (d) => d.label
  );

  let byLocationStack = rollup(
    data,
    (v) => sum(v, (d) => d.value),
    (d) => d.location,
    (d) => d.stack
  );

  let locationToSum = rollup(
    data,
    (v) => sum(v, (d) => d.value),
    (d) => d.location
  );

  let maxLocation = max(locationToSum, (item) => item[1]);
  let maxLabel = max(byLocationLabel, (i) => max(i[1], (d) => d[1]));
  let maxStack = max(byLocationStack, (i) => max(i[1], (d) => d[1]));

  return {
    labels: dataController.labels(),
    stacks: dataController.stacks(),
    locations: dataController.locations(),
    max: maxLocation,
    maxLabel,
    maxStack,
    byLocationLabel,
    byLocationStack,
    locationToSum,
  };
}
