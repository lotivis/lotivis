import {LotivisConfig} from "../shared/config";

/**
 * Appends the bars to a date.chart chart.
 * @class TimeChartBarsRenderer
 */
export class TimeChartBarsRenderer {

  /**
   * Creates a new instance of TimeChartBarsRenderer.
   * @param dateChart The parental date.chart chart.
   */
  constructor(dateChart) {

    /**
     * Appends the bar for the given stack.
     * @param stack The stack to append the bar for.
     */
    this.renderBars = function (stack) {

      let config = dateChart.config || {};
      let isCombineStacks = config.combineStacks || false;
      let colors = dateChart.datasetController.getColorsForStack(stack.stack) || Color.defaultTint;
      let barRadius = config.barRadius || LotivisConfig.barRadius;

      dateChart
        .svg
        .append("g")
        .selectAll("g")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", (stackData, index) => isCombineStacks ? colors[0] : stack.colors[index])
        .selectAll("rect")
        .data((data) => data)
        .enter()
        .append("rect")
        .attr('class', 'lotivis-time-chart-bar')
        .attr("rx", isCombineStacks ? 0 : barRadius)
        .attr("ry", isCombineStacks ? 0 : barRadius)
        .attr("x", (d) => dateChart.xChartScale(d.data.date) + dateChart.xStack(stack.label))
        .attr("y", (d) => dateChart.yChart(d[1]))
        .attr("width", dateChart.xChartScalePadding.bandwidth())
        .attr("height", (d) => dateChart.yChart(d[0]) - dateChart.yChart(d[1]));
    };
  }
}
