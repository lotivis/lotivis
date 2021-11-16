/**
 * @class TimeChartGridRenderer
 */
export class TimeChartGridRenderer {

  /**
   * Creates a new instance of TimeChartGridRenderer.
   *
   * @param dateChart
   */
  constructor(dateChart) {

    /**
     *
     */
    this.createAxis = function () {

      this.xAxisGrid = d3
        .axisBottom(dateChart.xChartScale)
        .tickSize(-dateChart.graphHeight)
        .tickFormat('');

      this.yAxisGrid = d3
        .axisLeft(dateChart.yChart)
        .tickSize(-dateChart.graphWidth)
        .tickFormat('')
        .ticks(20);

    };

    /**
     *
     */
    this.renderGrid = function () {
      let config = dateChart.config;
      let color = 'lightgray';
      let width = '0.5';
      let opacity = 0.3;

      dateChart.svg
        .append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + (config.height - config.margin.bottom) + ')')
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.xAxisGrid);

      dateChart.svg
        .append('g')
        .attr('class', 'y axis-grid')
        .attr('transform', `translate(${config.margin.left},0)`)
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.yAxisGrid);

    };
  }
}
