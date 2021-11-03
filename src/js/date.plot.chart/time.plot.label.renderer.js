import {hashCode} from "../shared/hash";

/**
 *
 * @class TimePlotLabelRenderer
 */
export class TimePlotLabelRenderer {

  /**
   * Creates a new instance of TimePlotLabelRenderer.
   *
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {

    /**
     * Draws the labels on the bars on the date.chart.plot.chart chart.
     */
    this.renderLabels = function () {
      if (!plotChart.config.showLabels) return;
      if (plotChart.barsRenderer.constructor.name === 'TimePlotBarsFractionsRenderer') return;

      let xBandwidth = plotChart.yChart.bandwidth();
      let xChart = plotChart.xChart;
      plotChart.labels = plotChart
        .barsData
        .append('g')
        .attr('transform', `translate(0,${(xBandwidth / 2) + 4})`)
        .append('text')
        .attr('class', 'lotivis-date.chart.plot.chart-label')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("x", (d) => xChart(d.firstDate) + (xBandwidth / 2))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => xChart(d.lastDate) - xChart(d.firstDate) + xBandwidth)
        .text(function (dataset) {
          if (dataset.sum === 0) return;
          let formatted = plotChart.config.numberFormat.format(dataset.sum);
          return `${dataset.duration + 1} years, ${formatted} items`;
        });
    };
  }
}
