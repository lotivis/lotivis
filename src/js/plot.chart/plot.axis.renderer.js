/**
 * Draws the axis on the timm plot chart.
 * @class PlotAxisRenderer
 */
export class PlotAxisRenderer {
  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental date.chart.plot.chart chart.
   */
  constructor(plotChart) {
    /**
     * Appends axis on the top, left and bottom of the date.chart.plot.chart chart.
     */
    this.renderAxis = function() {
      let margin = plotChart.config.margin;

      // top
      plotChart.svg
        .append("g")
        .call(d3.axisTop(plotChart.xChart))
        .attr("transform", () => `translate(0,${margin.top})`);

      // left
      plotChart.svg
        .append("g")
        .call(d3.axisLeft(plotChart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom
      plotChart.svg
        .append("g")
        .call(d3.axisBottom(plotChart.xChart))
        .attr(
          "transform",
          () => `translate(0,${plotChart.height - margin.bottom})`
        );
    };
  }
}
