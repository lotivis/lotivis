import { axisLeft, axisBottom } from "d3";
import { Renderer } from "../common/renderer.js";

export class BarAxisRender extends Renderer {
  render(chart, controller) {
    let height = chart.config.height;
    let margin = chart.config.margin;

    // left axis
    chart.svg
      .append("g")
      .call(axisLeft(chart.yChart))
      .attr("transform", () => `translate(${margin.left},0)`);

    // bottom axis
    chart.svg
      .append("g")
      .call(axisBottom(chart.xChartScale))
      .attr("transform", () => `translate(0,${height - margin.bottom})`);
  }
}
