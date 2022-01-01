import { hashCode } from "../shared/hash";

/**
 *
 * @class PlotLabelsFractionsRenderer
 */
export class PlotLabelsFractionsRenderer {
  /**
   * Creates a new instance of PlotLabelRenderer.
   *
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {
    /**
     * Draws the labels on the bars on the date.chart.plot.chart chart.
     */
    this.renderLabels = function() {
      if (!plotChart.config.showLabels) return;

      let xBandwidth = plotChart.yChart.bandwidth();

      plotChart.labels = plotChart.barsData
        .append("g")
        .attr("transform", `translate(0,${xBandwidth / 2 + 4})`)
        .append("text")
        .attr("class", "ltv-plot-label")
        .attr("id", d => "rect-" + hashCode(d.label))
        .attr("x", d => plotChart.xChart(d.date) + 4)
        .attr("y", d => plotChart.yChart(d.label))
        .text(function(dataset) {
          if (dataset.sum === 0) return;
          let formatted = plotChart.config.numberFormat.format(dataset.value);
          return `${formatted}`;
        });
    };
  }
}
