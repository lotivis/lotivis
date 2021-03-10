/**
 *
 */
export class DateLabelRenderer {

  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param index
     */
    this.renderBarLabels = function (stack, index) {
      let xChartRef = timeChart.xChart;
      let yChartRef = timeChart.yChart;
      let xStackRef = timeChart.xStack;
      let numberFormat = timeChart.numberFormat;
      let labelColor = timeChart.labelColor;
      let numberOfSeries = stack.length;
      let seriesIndex = 0;
      let bandwidth = xStackRef.bandwidth() / 2;

      timeChart
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
        .attr("transform", function (item) {
          let x = xChartRef(item.data.date) + xStackRef(stack.label) + bandwidth;
          let y = yChartRef(item[1]) - 5;
          return `translate(${x},${y})rotate(-60)`;
        })
        .attr("font-size", 13)
        .text(function (item, index) {
          if (index === 0) seriesIndex += 1;
          if (seriesIndex !== numberOfSeries) return;
          let value = item[1];
          return value === 0 ? '' : numberFormat.format(value);
        });
    };
  }
}
