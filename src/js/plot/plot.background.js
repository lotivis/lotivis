import { Renderer } from "../common/renderer";

export class PlotBackgroundRenderer extends Renderer {
  render(chart, controller) {
    chart.svg
      .append("rect")
      .attr("width", chart.width || chart.config.width)
      .attr("height", chart.height)
      .attr("class", `ltv-plot-chart-background`)
      .on("click", (e, b) => {
        chart.controller.filters.labels.clear();
        chart.emit("click", e, null);
      });
  }
}
