import { hash_str } from "../common/hash.js";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";

export class PlotLabelsFractionsRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;
    if (!chart.config.labels) return;

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let yBandwidth = chart.yChart.bandwidth() / 2;

    chart.labels = chart.barsData
      .append("g")
      .attr("transform", (d) => `translate(0,${chart.yChartPadding(d[0])})`)
      .attr("id", (d) => "rect-" + hash_str(d[0]))
      .selectAll(".text")
      .data((d) => d[1]) // map to dates data
      .enter()
      .filter((d) => d[1] > 0)
      .append("text")
      .attr("class", "ltv-plot-label")
      .attr("y", (d) => yBandwidth)
      .attr("x", (d) => chart.xChart(d[0]) + 4)
      .text((d) => (d.sum === 0 ? null : numberFormat(d[1])));
  }
}
