import { Renderer } from "../common/renderer";

export class PlotGridRenderer extends Renderer {
  render(chart, controller) {
    if (!chart) return;
    if (!chart.config.drawGrid) return;

    chart.svg
      .append("g")
      .attr("class", "ltv-plot-grid ltv-plot-grid-x")
      .attr(
        "transform",
        "translate(0," +
          (chart.preferredHeight - chart.config.margin.bottom) +
          ")"
      )
      .call(chart.xAxisGrid);

    chart.svg
      .append("g")
      .attr("class", "ltv-plot-grid ltv-plot-grid-y")
      .attr("transform", `translate(${chart.config.margin.left},0)`)
      .call(chart.yAxisGrid);
  }
}
