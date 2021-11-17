import {LotivisConfig} from "../shared/config";
import {toSaveID} from "../shared/selector";

/**
 *
 * @class TimeChartSelectionRenderer
 */
export class TimeChartSelectionRenderer {

  /**
   * Creates a new instance of TimeChartHoverBarsRenderer.
   * @param dateChart
   */
  constructor(dateChart) {

    function createID(date) {
      return `lotivis-date-chart-selection-rect-id-${toSaveID(String(date))}`;
    }

    function getSelectedDates() {
      if (!dateChart.datasetController) {
        return [];
      }
      return dateChart.datasetController.filters.dates || [];
    }

    this.hideAll = function () {
      dateChart.svg
        .selectAll(`.lotivis-date-chart-selection-rect`)
        .attr(`opacity`, 0);
    };

    this.render = function () {
      let margin = dateChart.config.margin;
      let dates = dateChart.config.dateLabels || dateChart.dataview.dates;

      dateChart
        .svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", 'lotivis-date-chart-selection-rect')
        .attr("id", date => createID(date))
        .attr("x", (date) => dateChart.xChartScale(date))
        .attr("y", margin.top)
        .attr("opacity", 0)
        .attr("width", dateChart.xChartScale.bandwidth())
        .attr("height", dateChart.config.height - margin.bottom - margin.top);

    };

    this.update = function () {
      let selectedDates = getSelectedDates();
      dateChart
        .svg
        .selectAll(`.lotivis-date-chart-selection-rect`)
        .attr(`opacity`, date => selectedDates.includes(String(date)) ? 0.15 : 0);
    };
  }
}
