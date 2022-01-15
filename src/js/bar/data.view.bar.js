import * as d3 from "d3";
import { toDataset } from "../parse/data.to.datasets";

export function createBarStackModel(dataController) {
  let stacks = dataController.stacks();
  let byDate = d3.rollup(
    dataController.data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.date,
    (d) => d.label
  );

  // console.log("byDate", byDate);

  return stacks.map(function (stack) {
    let stackData = dataController.data.filter((d) => d.stack === stack);
    let stackLabels = Array.from(d3.group(stackData, (d) => d.label).keys());
    let stackBuilder = d3
      .stack()
      .value((d, key) => d[1].get(key))
      .keys(stackLabels);
    let series = stackBuilder(byDate);

    let model = { series, stack, label: stack };

    return model;
  });
}

// export function dataViewBarStacked(data) {
//   let datasets = createDatasets(combine(data));
//   let dates = data.dates();
//   let stacks = data.stacks();
//   let datasetStacks = createBarStackModel(this, data);
//   let max = d3.max(datasets, (d) => d3.max(d.series, (d) => d[1]));
//   let max2 = d3.max(datasets, (stack) =>
//     d3.max(stack.series, (series) => d3.max(series.map((item) => item["1"])))
//   );

//   console.log("max", max);
//   console.log("max2", max2);

//   return {
//     datasets,
//     dates,
//     stacks,
//     datasetStacks,
//     max,
//   };
// }

export function dataViewBar(dataController) {
  let dates = dataController.dates();
  let stacks = dataController.stacks();
  let labels = dataController.labels();
  let enabledStacks = dataController.stacks();
  let datasets = toDataset(dataController);
  let stacked = createBarStackModel(dataController);
  let max = d3.max(stacked, (d) =>
    d3.max(d.series, (s) => d3.max(s.map((i) => i["1"])))
  );

  let byDateLabel = d3.rollup(
    dataController.data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.date,
    (d) => d.label
  );

  let byDateStack = d3.rollup(
    dataController.data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.date,
    (d) => d.stack || d.label
  );

  // console.log("byDateLabel", byDateLabel);

  return {
    datasets,
    stacked,
    data: dataController.data,
    dates,
    stacks,
    enabledStacks,
    byDateLabel,
    byDateStack,
    labels,
    max,
  };
}
