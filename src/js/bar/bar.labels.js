import { Renderer } from "../common/renderer";

export class BarLabelsRenderer extends Renderer {
  render(chart, controller) {
    if (!chart.config.labels) return;

    console.log("chart.dataView", chart.dataView);

    function translate(x, y) {
      return `translate(${x},${y})rotate(-60)`;
    }

    let dates = chart.dataView.dates;
    let byDateStack = chart.dataView.byDateStack;

    let xChartScale = chart.xChartScale;
    let yChart = chart.yChart;
    let xStack = chart.xStack;
    let numberFormat = chart.config.numberFormat;
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
        return translate(xStack(stack) + width, yChart(value) - 5);
      })
      .text((d) => (d[1] === 0 ? "" : numberFormat.format(d[1])))
      .raise();
  }
}
