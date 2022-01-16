import { LOTIVIS_CONFIG } from "../common/config";
import { Renderer } from "../common/renderer";
import { BAR_CHART_TYPE } from "./bar.config.js";

export class BarBarsRenderer extends Renderer {
  render(chart, controller) {
    let radius = chart.config.barRadius || LOTIVIS_CONFIG.barRadius;
    let colors = controller.colorGenerator;
    let barWidth = chart.xStack.bandwidth();
    let yChart = chart.yChart;
    let height = chart.yChart(0);
    let selectionOpacity = 0.3;

    function opacity(date) {
      return controller.filters.dates.contains(date) ? selectionOpacity : 1;
    }

    function redraw() {
      chart.svg
        .selectAll(`.ltv-bar-chart-dates-area`)
        .attr(`opacity`, (d) => opacity(d[0]))
        .raise();
    }

    chart.on("click-date", redraw);

    function combined() {
      chart.svg
        .append("g")
        .selectAll("g")
        .data(chart.dataView.byDateStack)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${chart.xChartScale(d[0])},0)`)
        .attr("opacity", (d) => opacity(d[0]))
        .attr("class", "ltv-bar-chart-dates-area")
        .selectAll("rect")
        .data((d) => d[1]) // map to by stack
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-bar")
        .attr("fill", (d) => colors.stack(d[0]))
        .attr("x", (d) => chart.xStack(d[0]))
        .attr("y", (d) => chart.yChart(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => height - chart.yChart(d[1]))
        .attr("rx", radius)
        .attr("ry", radius)
        .raise();
    }

    function stacked() {
      chart.svg
        .append("g")
        .selectAll("g")
        .data(chart.dataView.byDatesStackSeries)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${chart.xChartScale(d[0])},0)`)
        .attr("opacity", (d) => opacity(d[0]))
        .attr("class", "ltv-bar-chart-dates-area")
        .selectAll("rect")
        .data((d) => d[1]) // map to by stack
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${chart.xStack(d[0])},0)`)
        .selectAll("rect")
        .data((d) => d[1]) // map to series
        .enter()
        .append("rect")
        .attr("y", (d) => yChart(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => (!d[1] ? 0 : yChart(d[0]) - yChart(d[1])))
        .attr("class", "ltv-bar-chart-bar")
        .attr("fill", (d) => colors.label(d[2]))
        .attr("rx", radius)
        .attr("ry", radius)
        .raise();
    }

    if (chart.config.type === BAR_CHART_TYPE.combine) {
      combined();
    } else {
      stacked();
    }
  }
}
