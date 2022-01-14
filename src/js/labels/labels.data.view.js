import * as d3 from "d3";

export function DataViewLabels(data) {
  let byStackLabel = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.stack,
    (d) => d.label
  );

  return {
    labels: data.labels(),
    stacks: data.stacks(),
    locations: data.locations(),
    byStackLabel,
  };
}
