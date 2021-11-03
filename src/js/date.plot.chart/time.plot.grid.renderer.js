/**
 * Draws a grid on the date.chart.plot.chart chart.
 *
 * @class TimePlotGridRenderer
 */
export class TimePlotGridRenderer {

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
    this.render = function () {
      if (!plotChart.config.drawGrid) return;

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-date.chart.plot.chart-grid lotivis-date.chart.plot.chart-grid-x')
        .attr('transform', 'translate(0,' + (plotChart.preferredHeight - plotChart.config.margin.bottom) + ')')
        .call(plotChart.xAxisGrid);

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-date.chart.plot.chart-grid lotivis-date.chart.plot.chart-grid-y')
        .attr('transform', `translate(${plotChart.config.margin.left},0)`)
        .call(plotChart.yAxisGrid);

    };
  }
}
