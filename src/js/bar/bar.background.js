import { Renderer } from "../common/renderer";

export class BarBackgroundRenderer extends Renderer {
  render(chart, controller) {
    function click(e, b) {
      if (controller) controller.filters.dates.clear();
    }

    chart.on("click-background", click);

    let background = chart.svg
      .append("g")
      .append("rect")
      .attr("width", chart.config.width)
      .attr("height", chart.config.height)
      .attr("fill", "white")
      .attr("opacity", 0)
      .attr("cursor", "pointer")
      .on("click", (e, b) => chart.emit("click-background", e, b));
  }
}
