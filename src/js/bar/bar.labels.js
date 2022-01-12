import { Renderer } from "../common/renderer";

export class BarLabelsRenderer extends Renderer {
  render(chart, controller) {
    let stackedDatasets = chart.dataView.stacked;

    for (let i = 0; i < stackedDatasets.length; i++) {
      let stackedDataset = stackedDatasets[i];
      let xChartRef = chart.xChartScale;
      let yChartRef = chart.yChart;
      let xStackRef = chart.xStack;
      let numberFormat = chart.config.numberFormat;
      let labelColor = chart.config.labelColor;
      let numberOfSeries = stackedDataset.series.length;
      let seriesIndex = 0;
      let bandwidth = xStackRef.bandwidth() / 2;

      chart.svg
        .append("g")
        .selectAll("g")
        .data(stackedDataset)
        .enter()
        .append("g")
        .attr("fill", labelColor)
        .selectAll(".text")
        .data((dataset) => dataset.series)
        .enter()
        .append("text")
        .attr("class", "ltv-bar-chart-label")
        .attr("transform", function (item) {
          console.log("item", item);
          let x =
            xChartRef(item.data.date) + xStackRef(stack.label) + bandwidth;
          let y = yChartRef(item[1]) - 5;
          return `translate(${x},${y})rotate(-60)`;
        })
        .text(function (item, index) {
          if (index === 0) seriesIndex += 1;
          if (seriesIndex !== numberOfSeries) return;
          let value = item[1];
          return value === 0 ? "" : numberFormat.format(value);
        });
    }
  }
}
