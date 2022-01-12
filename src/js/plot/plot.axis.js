import * as d3 from "d3";
import { Renderer } from "../common/renderer";

export class PlotAxisRenderer extends Renderer {
  render(chart, conttroller) {
    let margin = chart.config.margin;

    // top
    chart.svg
      .append("g")
      .call(d3.axisTop(chart.xChart))
      .attr("transform", () => `translate(0,${margin.top})`);

    // left
    chart.svg
      .append("g")
      .call(d3.axisLeft(chart.yChart))
      .attr("transform", () => `translate(${margin.left},0)`);

    // bottom
    chart.svg
      .append("g")
      .call(d3.axisBottom(chart.xChart))
      .attr("transform", () => `translate(0,${chart.height - margin.bottom})`);
  }
}
