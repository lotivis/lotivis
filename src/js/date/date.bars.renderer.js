import {GlobalConfig} from "../shared/config";
import {lotivis_log} from "../shared/debug";

export class DateBarsRenderer {

  /**
   *
   * @param timeChart
   */
  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param stackIndex
     */
    this.renderBars = function (stack, stackIndex) {
      let isCombineStacks = timeChart.config.combineStacks;
      let colors = timeChart.datasetController.getColorsForStack(stack.stack);
      timeChart
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
        .attr("x", (d) => timeChart.xChart(d.data.date) + timeChart.xStack(stack.label))
        .attr("y", (d) => timeChart.yChart(d[1]))
        .attr("width", timeChart.xStack.bandwidth())
        .attr("height", (d) => timeChart.yChart(d[0]) - timeChart.yChart(d[1]));
    };
  }
}
