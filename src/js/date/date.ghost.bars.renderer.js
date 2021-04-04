/**
 *
 * @class DateGhostBarsRenderer
 */
import {LotivisConfig} from "../shared/config";
import {toSaveID} from "../shared/selector";


export class DateGhostBarsRenderer {

  /**
   * Creates a new instance of DateGhostBarsRenderer.
   * @param dateChart
   */
  constructor(dateChart) {

    function createID(date) {
      return `ghost-rect-${toSaveID(String(date))}`;
    }

    this.hideAll = function () {
      dateChart.svg
        .selectAll('.lotivis-selection-rect')
        // .transition()
        .attr("opacity", 0);
    };

    function onMouseEnter(event, date) {
      this.hideAll();
      let controller = dateChart.datasetController;
      let id = createID(date);

      if (dateChart.config.sendsNotifications) {
        dateChart.updateSensible = false;
        controller.setDatesFilter([date]);
        dateChart.updateSensible = true;
      }

      dateChart
        .svg
        .select(`#${id}`)
        // .transition()
        .attr("opacity", 0.3);

      dateChart.tooltipRenderer.showTooltip(event, date);
    }

    function onMouserOut(event, date) {
      this.hideAll();
      dateChart.tooltipRenderer.hideTooltip(event, date);

      if (dateChart.config.sendsNotifications) {
        dateChart.datasetController.resetFilters();
      }
    }

    this.renderGhostBars = function () {
      let margin = dateChart.config.margin;
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
        .attr("rx", LotivisConfig.barRadius)
        .attr("ry", LotivisConfig.barRadius)
        .attr("x", (date) => dateChart.xChart(date))
        .attr("y", margin.top)
        .attr("width", dateChart.xChart.bandwidth())
        .attr("height", dateChart.config.height - margin.bottom - margin.top)
        .on('mouseenter', onMouseEnter.bind(this))
        .on('mouseout', onMouserOut.bind(this));

    };
  }
}
