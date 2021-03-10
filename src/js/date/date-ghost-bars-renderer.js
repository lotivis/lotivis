import {log_debug} from "../shared/debug";
import {Constants} from "../shared/constants";

/**
 *
 * @class DateGhostBarsRenderer
 */
export class DateGhostBarsRenderer {

  constructor(dateChart) {

    function createID(date) {
      return `ghost-rect-${String(date).replaceAll('.', '-')}`;
    }

    this.hideAll = function () {
      dateChart.svg
        .selectAll('.lotivis-selection-rect')
        .transition()
        .attr("opacity", 0);
    };

    function onMouseEnter(event, date) {
      this.hideAll();
      let controller = dateChart.datasetController;
      let id = createID(date);

      dateChart.updateSensible = false;
      controller.setDatesFilter([date]);
      dateChart.updateSensible = true;
      dateChart
        .svg
        .select(`#${id}`)
        .transition()
        .attr("opacity", 0.3);

      dateChart.tooltipRenderer.showTooltip(event, date);
    }

    function onMouserOut(event, date) {
      this.hideAll();
      dateChart.tooltipRenderer.hideTooltip(event, date);
      dateChart.datasetController.resetFilters();
    }

    this.renderGhostBars = function () {
      let dates = dateChart.datasetController.dates;
      dateChart
        .svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", 'lotivis-selection-rect')
        .attr("id", date => createID(date))
        .attr("opacity", 0)
        .attr("rx", Constants.barRadius)
        .attr("ry", Constants.barRadius)
        .attr("x", (date) => dateChart.xChart(date))
        .attr("y", dateChart.margin.bottom)
        .attr("width", dateChart.xChart.bandwidth())
        .attr("height", dateChart.height - dateChart.margin.bottom - dateChart.margin.top)
        .on('mouseenter', onMouseEnter.bind(this))
        .on('mouseout', onMouserOut.bind(this));

    };
  }
}
