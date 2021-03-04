import {log_debug} from "../shared/debug";
import {Color} from "../shared/colors";

export class ChartBarsRenderer {

  constructor(timeChart) {

    /**
     *
     * @param stack
     * @param stackIndex
     */
    this.renderBars = function (stack, stackIndex) {

      timeChart
        .svg
        .append("g")
        .selectAll("g")
        .data(stack)
        .enter()
        .append("g")
        .attr("fill", function (stackData, index) {
          //if (timeChart.isCombineStacks) {
            return Color.colorsForStack(stackIndex)[0].rgbString();
          //} else {
            //return stack.colors[index].rgbString();
          //}
        }.bind(this))
        .selectAll("rect")
        .data((data) => data)
        .enter()
        .append("rect")
        .attr("rx", timeChart.isCombineStacks ? 0 : 4)
        .attr("x", (d) => timeChart.xChart(d.data.date) + timeChart.xStack(stack.label))
        .attr("y", (d) => timeChart.yChart(d[1]))
        .attr("width", timeChart.xStack.bandwidth())
        .attr("height", (d) => timeChart.yChart(d[0]) - timeChart.yChart(d[1]));
    }
  }
}
