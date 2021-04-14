/**
 * Appends labels on top of the bars of a date chart.
 * @class DateLabelRenderer
 */
export class DateLabelRenderer {

  /**
   * Creates a new instance of DateLabelRenderer.
   * @param dateChart The parental date chart.
   */
  constructor(dateChart) {

    /**
     * Appends a label for the given stack.
     * @param stack The stack to create a label for.
     */
    this.renderBarLabels = function (stack) {

      let xChartRef = dateChart.xChart;
      let yChartRef = dateChart.yChart;
      let xStackRef = dateChart.xStack;
      let numberFormat = dateChart.numberFormat;
      let labelColor = dateChart.labelColor;
      let numberOfSeries = stack.length;
      let seriesIndex = 0;
      let bandwidth = xStackRef.bandwidth() / 2;

      dateChart
        .svg
        .append("g")
        .selectAll('g')
        .data(stack)
        .enter()
        .append('g')
        .attr('fill', labelColor)
        .selectAll('.text')
        .data(dataset => dataset)
        .enter()
        .append('text')
        .attr('class', 'lotivis-date-chart-label')
        .attr("transform", function (item) {
          let x = xChartRef(item.data.date) + xStackRef(stack.label) + bandwidth;
          let y = yChartRef(item[1]) - 5;
          return `translate(${x},${y})rotate(-60)`;
        })
        .text(function (item, index) {
          if (index === 0) seriesIndex += 1;
          if (seriesIndex !== numberOfSeries) return;
          let value = item[1];
          return value === 0 ? '' : numberFormat.format(value);
        });
    };
  }
}
