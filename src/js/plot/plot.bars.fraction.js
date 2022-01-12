import hash_str from "../common/hash";
import { MapColors } from "../common/colors";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";
import { LOTIVIS_CONFIG } from "../common/config";

export class PlotBarsFractionsRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;

    let radius = LOTIVIS_CONFIG.barRadius;
    let max = chart.dataView.data.max();
    let data = chart.dataView.data.filter((d) => d.value > 0);
    let colors = MapColors(max);

    chart.barsData = chart.svg.append("g").selectAll("g").data(data).enter();

    chart.bars = chart.barsData
      .append("rect")
      .attr("id", (d) => `ltv-plot-bar-${hash_str(d.label)}`)
      .attr("id", (d) => "ltv-plot-rect-" + hash_str(d.label))
      .attr("class", "ltv-plot-bar")
      .attr(`fill`, (d) => colors(d.value))
      .attr("rx", radius)
      .attr("ry", radius)
      .attr("x", (d) => chart.xChart(d.date))
      .attr("y", (d) => chart.yChartPadding(d.label))
      .attr("width", chart.xChart.bandwidth())
      .attr("height", chart.yChartPadding.bandwidth())
      .on("mouseenter", (e, d) => chart.fire("mouseenter", e, d))
      .on("mouseout", (e, d) => chart.fire("mouseout", e, d));
  }
}
