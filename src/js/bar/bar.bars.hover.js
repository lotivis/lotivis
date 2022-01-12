import { safeId } from "../common/safe.id.js";
import { Renderer } from "../common/renderer";

export class BarHoverRenderer extends Renderer {
  render(chart, controller) {
    function createID(date) {
      return `ltv-date-chart-hover-bar-id-${safeId(String(date))}`;
    }

    function hideAll() {
      chart.svg.selectAll(`.ltv-date-chart-hover-bar`).attr(`opacity`, 0);
    }

    function onMouseEnter(event, date) {
      hideAll();
      chart.svg.select(`#${createID(date)}`).attr("opacity", 0.3);
      chart.fire("mouseenter", event, date);
    }

    function onMouserOut(event, date) {
      hideAll();
      chart.fire("mouseout", event, date);

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
      chart.fire("click-date", event, date);
    }

    let config = chart.config;
    let margin = config.margin;
    let dates = chart.config.dateLabels || chart.dataView.dates;

    chart.svg
      .append("g")
      .selectAll("rect")
      .data(dates)
      .enter()
      .append("rect")
      .attr("class", "ltv-date-chart-hover-bar")
      .attr("id", (date) => createID(date))
      .attr("opacity", 0)
      .attr("x", (date) => chart.xChartScale(date))
      .attr("y", margin.top)
      .attr("width", chart.xChartScale.bandwidth())
      .attr("height", config.height - margin.bottom - margin.top)
      .on("mouseenter", onMouseEnter)
      .on("mouseout", onMouserOut)
      .on("mousedrag", onMouserOut)
      .on("click", onMouseClick);
  }
}
