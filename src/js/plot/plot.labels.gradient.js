import hash_str from "../common/hash";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";

export class PlotLabelRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.gradient) return;
    if (!chart.config.labels) return;

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let xBandwidth = chart.yChart.bandwidth();
    let xChart = chart.xChart;

    chart.labels = chart.barsData
      .append("text")
      .attr("transform", `translate(0,${xBandwidth / 2 + 4})`)
      .attr("class", "ltv-plot-label")
      .attr("id", (d) => "rect-" + hash_str(d.label))
      .attr("x", (d) => xChart(d.firstDate) + xBandwidth / 2)
      .attr("y", (d) => chart.yChart(d.label))
      .attr("height", chart.yChartPadding.bandwidth())
      .attr(
        "width",
        (d) => xChart(d.lastDate) - xChart(d.firstDate) + xBandwidth
      )
      .text(function (dataset) {
        if (dataset.sum === 0) return;
        return `${numberFormat(dataset.sum)} (${dataset.duration + 1} years)`;
      });
  }
}
