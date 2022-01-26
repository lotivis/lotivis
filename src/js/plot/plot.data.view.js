import * as d3 from "d3";

export function dataViewPlot(dataController) {
  let dates = dataController.dates().sort();
  let data = dataController.snapshotOrData();

  let byLabelDate = d3.rollups(
    data,
    (v) => d3.sum(v, (d) => d.value),
    (d) => d.label,
    (d) => d.date
  );

  let datasets = byLabelDate.map((d) => {
    let label = d[0];
    let data = d[1]
      .filter((d) => d[1] > 0)
      .map((d) => {
        return { date: d[0], value: d[1] };
      })
      .sort((a, b) => a.date - b.date);

    let sum = d3.sum(data, (d) => d.value);
    let firstDate = (data[0] || {}).date;
    let lastDate = (data[data.length - 1] || {}).date;
    let duration = dates.indexOf(lastDate) - dates.indexOf(firstDate);

    return { label, data, sum, firstDate, lastDate, duration };
  });

  return {
    datasets,
    dates,
    byLabelDate,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
    labels: dataController.labels(),
    max: d3.max(datasets, (d) => d3.max(d.data, (i) => i.value)),
  };
}
