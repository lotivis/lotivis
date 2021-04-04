import {GlobalConfig} from "../shared/config";

/**
 * @class DateBarsRenderer
 */
export class DateBarsRenderer {

  /**
   * Creates a new instance of DateBarsRenderer.
   * @param dateChart The parental date chart.
   */
  constructor(dateChart) {

    /**
     *
     * @param stack
     * @param stackIndex
     */
    this.renderBars = function (stack, stackIndex) {
      let isCombineStacks = dateChart.config.combineStacks;
      let colors = dateChart.datasetController.getColorsForStack(stack.stack);
      dateChart
        .svg
        .append("g")
        .selectAll("g")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", function (stackData, index) {
          if (isCombineStacks) {
            return colors[0].rgbString();
          } else {
            return stack.colors[index].rgbString();
          }
        })
        .selectAll("rect")
        .data((data) => data)
        .enter()
        .append("rect")
        .attr('class', 'lotivis-date-chart-bar')
        .attr("rx", isCombineStacks ? 0 : GlobalConfig.barRadius)
        .attr("ry", isCombineStacks ? 0 : GlobalConfig.barRadius)
        .attr("x", (d) => dateChart.xChart(d.data.date) + dateChart.xStack(stack.label))
        .attr("y", (d) => dateChart.yChart(d[1]))
        .attr("width", dateChart.xStack.bandwidth())
        .attr("height", (d) => dateChart.yChart(d[0]) - dateChart.yChart(d[1]));
    };
  }
}
