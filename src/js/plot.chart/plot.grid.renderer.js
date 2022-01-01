/**
 * Draws a grid on the date.chart.plot.chart chart.
 *
 * @class PlotGridRenderer
 */
export class PlotGridRenderer {
  /**
   * Creates a new instance of TimePlotGridRenderer.
   *
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {
    /**
     * Adds a grid to the chart.
     */
    this.render = function() {
      if (!plotChart.config.drawGrid) return;

      plotChart.svg
        .append("g")
        .attr("class", "ltv-plot-grid ltv-plot-grid-x")
        .attr(
          "transform",
          "translate(0," +
            (plotChart.preferredHeight - plotChart.config.margin.bottom) +
            ")"
        )
        .call(plotChart.xAxisGrid);

      plotChart.svg
        .append("g")
        .attr("class", "ltv-plot-grid ltv-plot-grid-y")
        .attr("transform", `translate(${plotChart.config.margin.left},0)`)
        .call(plotChart.yAxisGrid);
    };
  }
}
