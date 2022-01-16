import { Renderer } from "../common/renderer";

export class MapBackgroundRenderer extends Renderer {
  render(chart, controller) {
    chart.svg
      .append("rect")
      .attr("class", "ltv-map-chart-background")
      .attr("width", chart.config.width)
      .attr("height", chart.config.height)
      .attr("fill", "white")
      .on("click", (e) => {
        chart.makeUpdateInsensible();
        controller.filters.locations.clear();
        chart.makeUpdateSensible();
        chart.emit("click", event, null);
      });
  }
}
