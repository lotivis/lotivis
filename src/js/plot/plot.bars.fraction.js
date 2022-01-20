import { hash_str } from "../common/hash";
import { PlotColors } from "../common/colors";
import { Renderer } from "../common/renderer";
import { PLOT_CHART_TYPE, PLOT_COLOR_MODE } from "./plot.config";
import { LOTIVIS_CONFIG } from "../common/config";

export class PlotBarsFractionsRenderer extends Renderer {
  render(chart, controller) {
    if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;

    let radius = LOTIVIS_CONFIG.barRadius;
    let max = chart.dataView.max;
    let data = chart.dataView.byLabelDate;

    let colors = PlotColors(max);
    let brush = max / 2;
    let colorGenerator = controller.colorGenerator;
    let colorMode = chart.config.colorMode;

    chart.barsData = chart.svg.append("g").selectAll("g").data(data).enter();

    chart.bars = chart.barsData
      .append("g")
      .attr("transform", (d) => `translate(0,${chart.yChartPadding(d[0])})`)
      .attr("id", (d) => "ltv-plot-rect-" + hash_str(d[0]))
      .attr(`fill`, (d) =>
        colorMode === PLOT_COLOR_MODE.single ? colorGenerator.label(d[0]) : null
      )
      .selectAll(".rect")
      .data((d) => d[1]) // map to dates data
      .enter()
      .filter((d) => d[1] > 0)
      .append("rect")
      .attr("class", "ltv-plot-bar")
      .attr(`fill`, (d) =>
        colorMode === PLOT_COLOR_MODE.single ? null : colors(d[1])
      )
      .attr("opacity", (d) =>
        colorMode === PLOT_COLOR_MODE.single
          ? (d[1] + brush) / (max + brush)
          : 1
      )
      .attr("rx", radius)
      .attr("ry", radius)
      .attr("x", (d) => chart.xChart(d[0]))
      .attr("width", chart.xChart.bandwidth())
      .attr("height", chart.yChartPadding.bandwidth());
  }
}
