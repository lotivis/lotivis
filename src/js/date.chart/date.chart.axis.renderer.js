import * as d3 from "d3";

/**
 * @class DateChartAxisRenderer
 */
export class DateChartAxisRenderer {
  /**
   * Creates a new instance of DateChartAxisRenderer.
   *
   * @param dateChart The parental date.chart chart.
   */
  constructor(dateChart) {
    /**
     * Appends the `left` and `bottom` axis to the date.chart chart.
     */
    this.render = function() {
      let height = dateChart.config.height;
      let margin = dateChart.config.margin;

      // left axis
      dateChart.svg
        .append("g")
        .call(d3.axisLeft(dateChart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom axis
      dateChart.svg
        .append("g")
        .call(d3.axisBottom(dateChart.xChartScale))
        .attr("transform", () => `translate(0,${height - margin.bottom})`);
    };
  }
}
