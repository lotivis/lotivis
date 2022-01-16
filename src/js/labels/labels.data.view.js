import * as d3 from "d3";

export function DataViewLabels(dataController) {
  return {
    labels: dataController.labels(),
    stacks: dataController.stacks(),
    locations: dataController.locations(),
    byLabel: d3.rollup(
      dataController.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.label
    ),
    byStackLabel: d3.rollup(
      dataController.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.stack || d.label,
      (d) => d.label
    ),
  };
}
