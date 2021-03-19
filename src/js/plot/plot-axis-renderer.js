/**
 * Draws the axis on the plot chart.
 * @class PlotAxisRenderer
 */
export class PlotAxisRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    /**
     * Appends axis on the top, left and bottom of the plot chart.
     */
    this.renderAxis = function () {

      // top
      plotChart.svg
        .append("g")
        .call(d3.axisTop(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.margin.top})`);

      // left
      plotChart.svg
        .append("g")
        .call(d3.axisLeft(plotChart.yChart))
        .attr("transform", () => `translate(${plotChart.margin.left},0)`);

      // bottom
      plotChart.svg
        .append("g")
        .call(d3.axisBottom(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.height - plotChart.margin.bottom})`);

    };
  }
}
