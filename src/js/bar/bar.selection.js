import { safeId } from "../common/safe.id.js";
import { Renderer } from "../common/renderer";

export class BarSelectionRenderer extends Renderer {
  render(chart, controller) {
    function createID(date) {
      return `ltv-bar-chart-selection-rect-id-${safeId(String(date))}`;
    }

    function redraw() {
      let filter = controller.filters.dates;
      chart.svg
        .selectAll(`.ltv-bar-chart-selection-rect`)
        .attr(`opacity`, (date) => (filter.contains(date) ? 0.15 : 0));
    }

    chart.addListener("click-date", redraw);

    let filter = controller.filters.dates;
    let margin = chart.config.margin;
    let dates = chart.config.dateLabels || chart.dataView.dates;
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
      .attr("opacity", (date) => (filter.includes(String(date)) ? 0.15 : 0))
      .attr("width", chart.xChartScale.bandwidth())
      .attr("height", chart.config.height - margin.bottom - margin.top);
  }
}
