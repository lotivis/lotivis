import { safeId } from "../common/safe.id.js";
import { Renderer } from "../common/renderer";

export class BarSelectionRenderer extends Renderer {
  render(chart, controller) {
    let selectionOpacity = 0.1;

    function opacity(date) {
      return controller.filters.dates.contains(date) ? selectionOpacity : 0;
    }

    function createID(date) {
      return `ltv-bar-chart-selection-rect-id-${safeId(String(date))}`;
    }

    function redraw() {
      chart.svg
        .selectAll(`.ltv-bar-chart-selection-rect`)
        .attr(`opacity`, (date) => opacity(date))
        .raise();
    }

    chart.on("click-date", redraw);

    let margin = chart.config.margin;
    let dates = chart.config.dates || chart.dataView.dates;
    let selection = chart.svg
      .append("g")
      .selectAll("rect")
      .data(dates)
      .enter()
      .append("rect")
      .attr("class", "ltv-bar-chart-selection-rect")
      .attr("id", (date) => createID(date))
      .attr("x", (date) => chart.xChartScale(date))
      .attr("y", margin.top)
      .attr("opacity", (date) => opacity(date))
      .attr("width", chart.xChartScale.bandwidth())
      .attr("height", chart.config.height - margin.bottom - margin.top)
      .raise();
  }
}
