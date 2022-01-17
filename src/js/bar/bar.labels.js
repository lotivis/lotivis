import { Renderer } from "../common/renderer";
import { LOTIVIS_CONFIG } from "../common/config.js";

export class BarLabelsRenderer extends Renderer {
  render(chart, controller) {
    if (!chart.config.labels) return;

    function translate(x, y) {
      return `translate(${x},${y})rotate(-60)`;
    }

    let dates = chart.dataView.dates;
    let byDateStack = chart.dataView.byDateStack;

    let xChartScale = chart.xChartScale;
    let yChart = chart.yChart;
    let xStack = chart.xStack;
    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let width = chart.xStack.bandwidth() / 2;

    let labels = chart.svg.append("g").selectAll("g").data(dates).enter();

    labels
      .append("g")
      .attr("transform", (date) => `translate(${xChartScale(date)},0)`)
      .selectAll(".text")
      .data((date) => byDateStack.get(date))
      .enter()
      .append("text")
      .attr("class", "ltv-bar-chart-label")
      .attr("transform", (d) => {
        let stack = d[0];
        let value = d[1];
        return translate((xStack(stack) || 0) + width, yChart(value) - 5);
      })
      .text((d) => (d[1] === 0 ? "" : numberFormat(d[1])))
      .raise();
  }
}
