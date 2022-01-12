import * as d3 from "d3";
import { LOTIVIS_CONFIG } from "../common/config";
import { DEFAULT_NUMBER_FORMAT } from "../common/config";
import { Renderer } from "../common/renderer";

export class BarLegendRenderer extends Renderer {
  render(chart, controller, dataView) {
    let config = chart.config || {};
    let numberFormat = chart.fromConfig("numberFormat", DEFAULT_NUMBER_FORMAT);
    let datasets = dataView.datasets;
    let datasetNames = controller.labels();
    let circleRadius = 6;
    let labelMargin = 50;
    let colors = controller.colorGenerator;

    function click(e, d) {
      controller.filters.labels.toggle(d.label);
    }

    function filter(label) {
      return controller.filters.labels.contains(label);
    }

    chart.addListener("click-legend", click);

    let xLegend = d3
      .scaleBand()
      .domain(datasetNames)
      .rangeRound([config.margin.left, config.width - config.margin.right]);

    this.legends = chart.graph.selectAll(".legend").data(datasets).enter();

    this.legends
      .append("text")
      .attr("class", "ltv-bar-chart-legend-label")
      .attr("x", (item) => xLegend(item.label) - 30)
      .attr("y", chart.graphHeight + labelMargin)
      .style("cursor", "pointer")
      .style("fill", (d) => colors.label(d.label))
      .text(function (item) {
        let value = controller.sumOfLabel(item.label);
        let formatted = numberFormat.format(value);
        return `${item.label} (${formatted})`;
      })
      .on("click", (e, d) => chart.fire("click-legend", e, d));

    this.legends
      .append("circle")
      .attr("class", "lotivis-bar-chart-legend-circle")
      .attr("r", circleRadius)
      .attr("cx", (d) => xLegend(d.label) - 40)
      .attr("cy", chart.graphHeight + labelMargin - circleRadius + 2)
      .style("stroke", (d) => colors.label(d.label))
      .style("fill", (d) => (filter(d.label) ? "white" : colors.label(d.label)))
      .raise();
  }
}
