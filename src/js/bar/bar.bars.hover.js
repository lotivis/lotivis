import { safeId } from "../common/safe.id.js";
import { Renderer } from "../common/renderer";

export class BarHoverRenderer extends Renderer {
  render(chart, controller) {
    let selectionOpacity = 0.3;

    function opacity(date) {
      return controller.filters.dates.contains(date) ? selectionOpacity : 0;
    }

    function createID(date) {
      return `ltv-bar-chart-hover-bar-id-${safeId(String(date))}`;
    }

    function hideAll() {
      chart.svg
        .selectAll(`.ltv-bar-chart-hover-bar`)
        .attr("opacity", 0)
        .raise();
    }

    function onMouseEnter(event, date) {
      hideAll();
      chart.svg.select(`#${createID(date)}`).attr("opacity", selectionOpacity);
      chart.emit("mouseenter", event, date);
    }

    function onMouserOut(event, date) {
      hideAll();
      chart.emit("mouseout", event, date);

      // check for mouse down
      if (event.buttons === 1) {
        onMouseClick(event, date);
      }
    }

    function onMouseClick(event, date) {
      if (chart.config.selectable) {
        chart.makeUpdateInsensible();
        controller.filters.dates.toggle(date);
        chart.makeUpdateSensible();
      }
      chart.emit("click-date", event, date);
    }

    let config = chart.config;
    let margin = config.margin;
    let dates = chart.config.dates || chart.dataView.dates;

    chart.svg
      .append("g")
      .selectAll("rect")
      .data(dates)
      .enter()
      .append("rect")
      .attr("class", "ltv-bar-chart-hover-bar")
      .attr("id", (date) => createID(date))
      .attr("opacity", 0)
      .attr("x", (d) => chart.xChartScale(d))
      .attr("y", margin.top)
      .attr("width", chart.xChartScale.bandwidth())
      .attr("height", config.height - margin.bottom - margin.top)
      .on("mouseenter", onMouseEnter)
      .on("mouseout", onMouserOut)
      .on("mousedrag", onMouserOut)
      .on("click", onMouseClick)
      .raise();
  }
}
