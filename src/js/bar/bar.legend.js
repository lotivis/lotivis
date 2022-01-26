import * as d3 from "d3";
import { DEFAULT_NUMBER_FORMAT } from "../common/config";
import { Renderer } from "../common/renderer";

export class BarLegendRenderer extends Renderer {
  render(chart, controller, dataView) {
    return;
    let config = chart.config || {};
    let numberFormat = chart.config.numberFormat || DEFAULT_NUMBER_FORMAT;
    let datasets = dataView.datasets;
    let labels = controller.labels();
    let circleRadius = 6;
    let labelMargin = 50;
    let colors = controller.colorGenerator();

    function filter(label) {
      return (
        controller.filters.labels.length === 0 ||
        controller.filters.labels.contains(label)
      );
    }

    function fillColor(d) {
      return filter(d.label) ? colors.label(d.label) : "white";
    }

    let xLegend = d3
      .scaleBand()
      .domain(labels)
      .rangeRound([config.margin.left, config.width - config.margin.right]);

    let legends = chart.graph
      .selectAll(".legend")
      .append("g")
      .attr("class", "ltv-bar-chart-legend")
      .data(datasets)
      .enter();

    let texts = legends
      .append("text")
      .attr("class", "ltv-bar-chart-legend-label")
      .attr("x", (d) => xLegend(d.label) - 30)
      .attr("y", chart.graphHeight + labelMargin)
      .style("cursor", "pointer")
      .style("fill", (d) => colors.label(d.label))
      .text((d) => {
        let value = controller.sumOfLabel(d.label);
        let formatted = numberFormat.format(value);
        return `${d.label} (${formatted})`;
      })
      .on("click", (e, d) => chart.emit("click-legend", e, d))
      .raise();

    let circles = legends
      .append("circle")
      .attr("class", "lotivis-bar-chart-legend-circle")
      .attr("r", circleRadius)
      .attr("cx", (d) => xLegend(d.label) - 40)
      .attr("cy", chart.graphHeight + labelMargin - circleRadius + 2)
      .style("stroke", (d) => colors.label(d.label))
      .style("fill", (d) => fillColor(d))
      .raise();

    function click(e, d) {
      controller.filters.labels.toggle(d.label);
      circles.style("fill", (d) => fillColor(d));
    }

    chart.on("click-legend", click);
  }
}
