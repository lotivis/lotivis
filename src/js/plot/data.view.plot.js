import * as d3 from "d3";
import { Data } from "../data/flat.data";
import { flatDatasets } from "../data/parse.datasets";

export function dataViewPlot(data) {
  let dates = data.dates();

  let byLabelDate = d3.rollups(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.label,
    (d) => d.date
  );

  let datasets = byLabelDate.map((d) => {
    let label = d[0];
    let data = d[1]
      .map((d) => {
        return { date: d[0], value: d[1] };
      })
      .filter((d) => d.value > 0);

    let sum = d3.sum(data, (d) => d.value);
    let firstDate = data[0]?.date;
    let lastDate = data[data.length - 1]?.date;
    let duration = dates.indexOf(lastDate) - dates.indexOf(firstDate);

    return {
      label,
      data,
      sum,
      firstDate,
      lastDate,
      duration,
    };
  });

  return {
    datasets,
    data: Data(flatDatasets(datasets)),
    dates,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
    labels: data.labels(),
    labelsCount: datasets.length,
    max: d3.max(datasets, (d) => d3.max(d.data, (i) => i.value)),
  };
}
