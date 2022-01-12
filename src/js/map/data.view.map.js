import * as d3 from "d3";

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
export function dataViewMap(data) {
  let byLocationLabel = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.location,
    (d) => d.label
  );

  let byLocationStack = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.location,
    (d) => d.stack
  );

  let locationToSum = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.location
  );

  let max = d3.max(locationToSum, (item) => item[1]);
  let maxLabel = d3.max(byLocationLabel, (i) => d3.max(i[1], (d) => d[1]));
  let maxStack = d3.max(byLocationStack, (i) => d3.max(i[1], (d) => d[1]));

  return {
    labels: data.labels(),
    stacks: data.stacks(),
    locations: data.locations(),
    max: max,
    maxLabel,
    maxStack,
    byLocationLabel,
    byLocationStack,
    locationToSum,
  };
}
