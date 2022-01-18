import { rollup, sum } from "d3";

export function DataViewLabels(dataController) {
  return {
    labels: dataController.labels(),
    stacks: dataController.stacks(),
    locations: dataController.locations(),
    byLabel: rollup(
      dataController.data,
      (v) => sum(v, (d) => d.value),
      (d) => d.label
    ),
    byStackLabel: rollup(
      dataController.data,
      (v) => sum(v, (d) => d.value),
      (d) => d.stack || d.label,
      (d) => d.label
    ),
  };
}
