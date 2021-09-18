/**
 * Draws the background of a time plot chart.
 */
export class TimePlotBackgroundRenderer {

  /**
   *
   * @param plotChart
   */
  constructor(plotChart) {

    this.render = function () {
      plotChart.svg
        .append('rect')
        .attr('width', plotChart.width)
        .attr('height', plotChart.height)
        .attr('class', `lotivis-time-plot-chart-background`);
    };
  }
}
