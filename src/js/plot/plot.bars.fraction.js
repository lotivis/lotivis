import hash_str from "../common/hash";
import { MapColors } from "../common/colors";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE } from "./plot.config";
import { LOTIVIS_CONFIG } from "../common/config";

export class PlotBarsFractionsRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;

    let radius = LOTIVIS_CONFIG.barRadius;
    let max = chart.dataView.max;
    let data = chart.dataView.byLabelDate;
    let colors = MapColors(max);

    chart.barsData = chart.svg.append("g").selectAll("g").data(data).enter();

    chart.bars = chart.barsData
      .append("g")
      .attr("transform", (d) => `translate(0,${chart.yChartPadding(d[0])})`)
      .attr("id", (d) => "ltv-plot-rect-" + hash_str(d[0]))
      .selectAll(".rect")
      .data((d) => d[1]) // map to dates data
      .enter()
      .filter((d) => d[1] > 0)
      .append("rect")
      .attr("class", "ltv-plot-bar")
      .attr(`fill`, (d) => colors(d[1]))
      .attr("rx", radius)
      .attr("ry", radius)
      .attr("x", (d) => chart.xChart(d[0]))
      .attr("width", chart.xChart.bandwidth())
      .attr("height", chart.yChartPadding.bandwidth())
      .on("mouseenter", (e, d) => chart.fire("mouseenter", e, d))
      .on("mouseout", (e, d) => chart.fire("mouseout", e, d));
  }
}
