import {log_debug} from "../shared/debug";
import {Color} from "../shared/colors";
import {Constants} from "../shared/constants";

export class DateBarsRenderer {

  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param stackIndex
     */
    this.renderBars = function (stack, stackIndex) {
      let colors = timeChart.datasetController.getColorsForStack(stack.stack);
      timeChart
        .svg
        .append("g")
        .selectAll("g")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", function (stackData, index) {
          if (timeChart.isCombineStacks) {
            return colors[0].rgbString();
          } else {
            return colors[index].rgbString();
          }
        })
        .selectAll("rect")
        .data((data) => data)
        .enter()
        .append("rect")
        .attr('class', 'lotivis-date-chart-bar')
        .attr("rx", timeChart.isCombineStacks ? 0 : Constants.barRadius)
        .attr("ry", timeChart.isCombineStacks ? 0 : Constants.barRadius)
        .attr("x", (d) => timeChart.xChart(d.data.date) + timeChart.xStack(stack.label))
        .attr("y", (d) => timeChart.yChart(d[1]))
        .attr("width", timeChart.xStack.bandwidth())
        .attr("height", (d) => timeChart.yChart(d[0]) - timeChart.yChart(d[1]));
    };
  }
}
