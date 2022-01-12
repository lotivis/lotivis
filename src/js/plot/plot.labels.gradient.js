import hash_str from "../common/hash";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";

export class PlotLabelRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.gradient) return;
    if (!chart.config.labels) return;

    let xBandwidth = chart.yChart.bandwidth();
    let xChart = chart.xChart;

    chart.labels = chart.barsData
      .append("g")
      .attr("transform", `translate(0,${xBandwidth / 2 + 4})`)
      .append("text")
      .attr("class", "ltv-plot-label")
      .attr("id", (d) => "rect-" + hash_str(d.label))
      .attr("x", (d) => xChart(d.firstDate) + xBandwidth / 2)
      .attr("y", (d) => chart.yChart(d.label))
      .attr(
        "width",
        (d) => xChart(d.lastDate) - xChart(d.firstDate) + xBandwidth
      )
      .text(function (dataset) {
        if (dataset.sum === 0) return;
        let formatted = chart.config.numberFormat.format(dataset.sum);
        return `${dataset.duration + 1} years, ${formatted} items`;
      });
  }
}
