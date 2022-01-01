import { sumOfStack } from "../data.juggle/data.sum";
import { Color } from "../shared/color";
import * as d3 from "d3";

/**
 *
 */
export class TimeChartLegendRenderer {
  constructor(dateChart) {
    /**
     * Renders the legend of the date chart.
     */
    this.render = function() {
      if (dateChart.config.combineStacks) {
        renderCombinedStacksLegend();
      } else {
        renderDefaultLegend();
      }
    };

    function renderDefaultLegend() {
      let config = dateChart.config;
      let controller = dateChart.datasetController;
      let numberFormat = dateChart.config.numberFormat;
      let datasets = controller.datasets;
      let datasetNames = controller.labels;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3
        .scaleBand()
        .domain(datasetNames)
        .rangeRound([config.margin.left, config.width - config.margin.right]);

      let legends = dateChart.graph
        .selectAll(".legend")
        .data(datasets)
        .enter();

      legends
        .append("text")
        .attr("class", "lotivis-date.chart-chart-legend-label")
        .attr("font-size", 13)
        .attr("x", item => xLegend(item.label) - 30)
        .attr("y", dateChart.graphHeight + labelMargin)
        .style("cursor", "pointer")
        .style("fill", function(item) {
          return controller.getColorForDataset(item.label);
        })
        .text(function(item) {
          let value = controller.getSumOfDataset(item.label);
          let formatted = numberFormat.format(value);
          return `${item.label} (${formatted})`;
        })
        .on(
          "click",
          function(event) {
            if (!event || !event.target) return;
            if (!event.target.innerHTML) return;
            let components = event.target.innerHTML.split(" (");
            components.pop();
            let label = components.join(" (");
            console.log("label", label);
            dateChart.toggleDataset(label);
          }.bind(this)
        );

      legends
        .append("circle")
        .attr("class", "lotivis-date.chart-chart-legend-circle")
        .attr("r", circleRadius)
        .attr("cx", item => xLegend(item.label) - circleRadius * 2 - 30)
        .attr("cy", dateChart.graphHeight + labelMargin - circleRadius + 2)
        .style("stroke", item => controller.getColorForDataset(item.label))
        .style(
          "fill",
          function(item) {
            return item.isEnabled
              ? controller.getColorForDataset(item.label)
              : "white";
          }.bind(this)
        );
    }

    function renderCombinedStacksLegend() {
      let stackNames = dateChart.datasetController.stacks;
      let numberFormat = dateChart.config.numberFormat;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3
        .scaleBand()
        .domain(stackNames)
        .rangeRound([
          dateChart.config.margin.left,
          dateChart.config.width - dateChart.config.margin.right
        ]);

      let legends = dateChart.graph
        .selectAll(".lotivis-date.chart-chart-legend-label")
        .data(stackNames)
        .enter();

      legends
        .append("text")
        .attr("class", "lotivis-date.chart-chart-legend-label")
        .attr("font-size", 23)
        .attr("x", item => xLegend(item) - 30)
        .attr(
          "y",
          function() {
            return dateChart.graphHeight + labelMargin;
          }.bind(this)
        )
        .style("cursor", "pointer")
        .style(
          "fill",
          function(item, index) {
            return Color.colorsForStack(index)[0].rgbString();
          }.bind(this)
        )
        .text(
          function(item) {
            let value = sumOfStack(dateChart.datasetController.flatData, item);
            let formatted = numberFormat.format(value);
            let labels = item.split(",");
            let text;

            if (labels.length > 3) {
              labels = labels.splice(0, 3);
              text = labels.join(", ") + ",...";
            } else {
              text = item;
            }

            return `${text} (${formatted})`;
          }.bind(this)
        );

      legends
        .append("circle")
        .attr("r", circleRadius)
        .attr("cx", item => xLegend(item) - circleRadius * 2 - 30)
        .attr("cy", dateChart.graphHeight + labelMargin - circleRadius + 2)
        .style("cursor", "pointer")
        .style(
          "stroke",
          function(item, index) {
            return Color.colorsForStack(index)[0].rgbString();
          }.bind(this)
        )
        .style(
          "fill",
          function(item, index) {
            return item.isEnabled
              ? Color.colorsForStack(index)[0].rgbString()
              : "white";
          }.bind(this)
        )
        .style("stroke-width", 2);
    }
  }
}
