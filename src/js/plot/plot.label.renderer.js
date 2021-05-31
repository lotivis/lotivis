import {hashCode} from "../shared/hash";

/**
 *
 * @class PlotLabelRenderer
 */
export class PlotLabelRenderer {

  /**
   * Creates a new instance of PlotLabelRenderer.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    /**
     * Draws the labels on the bars on the plot chart.
     */
    this.renderLabels = function () {
      if (!plotChart.config.showLabels) return;
      let xBandwidth = plotChart.yChart.bandwidth();
      let xChart = plotChart.xChart;
      plotChart.labels = plotChart
        .barsData
        .append('g')
        .attr('transform', `translate(0,${(xBandwidth / 2) + 4})`)
        .append('text')
        .attr('class', 'lotivis-plot-label')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("x", (d) => xChart(d.firstDate) + (xBandwidth / 2))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => xChart(d.lastDate) - xChart(d.firstDate) + xBandwidth)
        .text(function (dataset) {
          if (dataset.sum === 0) return;
          return `${dataset.duration + 1} years, ${dataset.sum} items`;
        });
    };
  }
}
