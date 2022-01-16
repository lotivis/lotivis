import * as d3 from "d3";
import { toDataset } from "../parse/data.to.datasets";

export function dataViewBar(dataController) {
  let snapshot = dataController.snapshot;
  let data = snapshot || dataController.data;
  console.log("data", data);
  console.log("snapshot", snapshot);

  let dates = dataController.dates();
  let stacks = dataController.stacks();
  let labels = dataController.labels();
  let enabledStacks = dataController.stacks();

  let byDateLabel = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.date,
    (d) => d.label
  );

  let byDateStack = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.date,
    (d) => d.stack || d.label
  );

  let byDateStackLabel = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.date,
    (d) => d.stack || d.label,
    (d) => d.label
  );

  let byDatesStackSeries = new d3.InternMap();
  dates.forEach((date) => {
    let byStackLabel = byDateStackLabel.get(date);
    if (!byStackLabel) return;
    byDatesStackSeries.set(date, new d3.InternMap());

    stacks.forEach((stack) => {
      let byLabel = byStackLabel.get(stack);
      if (!byLabel) return;
      let value = 0;
      let series = Array.from(byLabel)
        .reverse()
        .map((item) => [value, (value += item[1]), item[0]]);
      byDatesStackSeries.get(date).set(stack, series);
    });
  });

  let max = d3.max(byDateStack, (d) => d3.max(d[1], (d) => d[1]));

  return {
    dates,
    stacks,
    enabledStacks,
    byDateLabel,
    byDateStack,
    byDatesStackSeries,
    labels,
    max,
  };
}
