import {Constants} from "../shared/constants";

/**
 * Draws a grid on the plot chart.
 *
 * @class PlotGridRenderer
 */
export class PlotGridRenderer {

  /**
   * Creates a new instance of PlotGridRenderer.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    /**
     * Adds a grid to the chart.
     */
    this.renderGrid = function () {
      if (!plotChart.config.drawGrid) return;

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-plot-grid lotivis-plot-grid-x')
        .attr('transform', 'translate(0,' + (plotChart.preferredHeight - plotChart.config.margin.bottom) + ')')
        .call(plotChart.xAxisGrid);

      plotChart.svg
        .append('g')
        .attr('class', 'lotivis-plot-grid lotivis-plot-grid-y')
        .attr('transform', `translate(${plotChart.config.margin.left},0)`)
        .call(plotChart.yAxisGrid);

    };
  }
}
