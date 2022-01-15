import * as d3 from "d3";
import { Renderer } from "../common/renderer";

export class BarGridRenderer extends Renderer {
  render(chart, controller) {
    let xAxisGrid = d3
      .axisBottom(chart.xChartScale)
      .tickSize(-chart.graphHeight)
      .tickFormat("");

    let yAxisGrid = d3
      .axisLeft(chart.yChart)
      .tickSize(-chart.graphWidth)
      .tickFormat("")
      .ticks(20);

    let config = chart.config;
    let marginBottom = config.height - config.margin.bottom;

    chart.svg
      .append("g")
      .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-x")
      .attr("transform", "translate(0," + marginBottom + ")")
      .call(xAxisGrid);

    chart.svg
      .append("g")
      .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-y")
      .attr("transform", `translate(${config.margin.left},0)`)
      .call(yAxisGrid);
  }
}
