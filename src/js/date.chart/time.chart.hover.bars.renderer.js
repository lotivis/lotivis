import { toSaveID } from "../shared/selector";

/**
 *
 * @class TimeChartHoverBarsRenderer
 */
export class TimeChartHoverBarsRenderer {
  /**
   * Creates a new instance of TimeChartHoverBarsRenderer.
   *
   * @param dateChart
   */
  constructor(dateChart) {
    function createID(date) {
      return `ltv-date-chart-hover-bar-id-${toSaveID(String(date))}`;
    }

    this.hideAll = function() {
      dateChart.svg.selectAll(`.ltv-date-chart-hover-bar`).attr(`opacity`, 0);
    };

    function onMouseEnter(event, date) {
      this.hideAll();
      dateChart.svg.select(`#${createID(date)}`).attr("opacity", 0.3);
      dateChart.tooltipRenderer.showTooltip(event, date);
    }

    function onMouserOut(event, date) {
      this.hideAll();
      dateChart.tooltipRenderer.hideTooltip(event, date);

      // check for mouse down
      if (event.buttons === 1) {
        onMouseClick(event, date);
      }
    }

    function onMouseClick(even, date) {
      if (dateChart.config.sendsNotifications) {
        dateChart.makeUpdateInsensible();
        dateChart.datasetController.toggleDate(date);
        dateChart.makeUpdateSensible();
      }
      dateChart.selectionRenderer.update();
    }

    this.renderGhostBars = function() {
      let config = dateChart.config;
      let margin = config.margin;
      let dates = dateChart.config.dateLabels || dateChart.dataview.dates;

      dateChart.svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", "ltv-date-chart-hover-bar")
        .attr("id", date => createID(date))
        .attr("opacity", 0)
        .attr("x", date => dateChart.xChartScale(date))
        .attr("y", margin.top)
        .attr("width", dateChart.xChartScale.bandwidth())
        .attr("height", config.height - margin.bottom - margin.top)
        .on("mouseenter", onMouseEnter.bind(this))
        .on("mouseout", onMouserOut.bind(this))
        .on("mousedrag", onMouserOut.bind(this))
        .on("click", onMouseClick.bind(this));
    };
  }
}
