/**
 * @class PlotAxisRenderer
 */
export class PlotAxisRenderer {

  /**
   * @constructor
   * @param plotChart
   */
  constructor(plotChart) {

    /**
     *
     */
    this.renderAxis = function () {

      // top axis
      plotChart.svg
        .append("g")
        .call(d3.axisTop(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.margin.top})`);

      // bottom axis
      plotChart.svg
        .append("g")
        .call(d3.axisBottom(plotChart.xChart))
        .attr("transform", () => `translate(0,${plotChart.height - plotChart.margin.bottom})`);

      // left axis
      plotChart.svg
        .append("g")
        .call(d3.axisLeft(plotChart.yChart))
        .attr("transform", () => `translate(${plotChart.margin.left},0)`);

    };

    /**
     * Adds a grid to the chart.
     */
    this.renderGrid = function () {
      let color = 'lightgray';
      let width = '0.5';
      let opacity = 0.3;

      plotChart.svg
        .append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + (plotChart.height - plotChart.margin.bottom) + ')')
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(plotChart.xAxisGrid);

      plotChart.svg
        .append('g')
        .attr('class', 'y axis-grid')
        .attr('transform', `translate(${plotChart.margin.left},0)`)
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(plotChart.yAxisGrid);

    };
  }
}
