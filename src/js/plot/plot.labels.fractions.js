import hash_str from "../common/hash.js";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";

export class PlotLabelsFractionsRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;
    if (!chart.config.labels) return;

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let xBandwidth = chart.yChart.bandwidth();

    chart.labels = chart.barsData
      .append("g")
      .attr("transform", `translate(0,${xBandwidth / 2 + 4})`)
      .append("text")
      .attr("class", "ltv-plot-label")
      .attr("id", (d) => "rect-" + hash_str(d.label))
      .attr("x", (d) => chart.xChart(d.date) + 4)
      .attr("y", (d) => chart.yChart(d.label))
      .text((d) => (d.sum === 0 ? null : numberFormat.format(d.value)));
  }
}
