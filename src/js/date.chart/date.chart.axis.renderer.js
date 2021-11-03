/**
 * @class TimeChartAxisRenderer
 */
export class TimeChartAxisRenderer {

  /**
   * Creates a new instance of TimeChartAxisRenderer.
   * @param dateChart The parental time.chart chart.
   */
  constructor(dateChart) {

    /**
     * Appends the `left` and `bottom` axis to the time.chart chart.
     */
    this.render = function () {
      let height = dateChart.config.height;
      let margin = dateChart.config.margin;

      // left
      dateChart.svg
        .append("g")
        .call(d3.axisLeft(dateChart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom
      dateChart.svg
        .append("g")
        .call(d3.axisBottom(dateChart.xChart))
        .attr("transform", () => `translate(0,${height - margin.bottom})`);

    };
  }
}
