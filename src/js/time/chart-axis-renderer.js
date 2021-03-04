export class ChartAxisRenderer {

  constructor(timeChart) {

    /**
     *
     */
    this.createAxis = function () {
      this.xAxisGrid = d3
        .axisBottom(timeChart.xChart)
        .tickSize(-timeChart.graphHeight)
        .tickFormat('');

      this.yAxisGrid = d3
        .axisLeft(timeChart.yChart)
        .tickSize(-timeChart.graphWidth)
        .tickFormat('')
        .ticks(20);
    };

    /**
     *
     */
    this.renderAxis = function () {
      timeChart.svg
        .append("g")
        .call(d3.axisBottom(timeChart.xChart))
        .attr("transform", () => `translate(0,${timeChart.height - timeChart.margin.bottom})`);
      timeChart.svg
        .append("g")
        .call(d3.axisLeft(timeChart.yChart))
        .attr("transform", () => `translate(${timeChart.margin.left},0)`);
    };

    /**
     *
     */
    this.renderGrid = function () {
      let color = 'lightgray';
      let width = '0.5';
      let opacity = 0.3;
      timeChart.svg
        .append('g')
        .attr('class', 'x axis-grid')
        .attr('transform', 'translate(0,' + (timeChart.height - timeChart.margin.bottom) + ')')
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.xAxisGrid);
      timeChart.svg
        .append('g')
        .attr('class', 'y axis-grid')
        .attr('transform', `translate(${timeChart.margin.left},0)`)
        .attr('stroke', color)
        .attr('stroke-width', width)
        .attr("opacity", opacity)
        .call(this.yAxisGrid);
    };
  }
}
