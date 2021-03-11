import {sumOfStack} from "../data-juggle/dataset-sum";
import {Color} from "../shared/colors";

export class DateLegendRenderer {

  constructor(timeChart) {

    this.renderNormalLegend = function () {
      let controller = timeChart.datasetController;
      let datasets = controller.workingDatasets;
      let datasetNames = controller.labels;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3.scaleBand()
        .domain(datasetNames)
        .rangeRound([timeChart.margin.left, timeChart.width - timeChart.margin.right]);

      let legends = timeChart.graph
        .selectAll('.legend')
        .data(datasets)
        .enter();

      legends
        .append('text')
        .attr("font-size", 13)
        .attr("x", (item) => xLegend(item.label) - 30)
        .attr("y", timeChart.graphHeight + labelMargin)
        .style('cursor', 'pointer')
        .style("fill", function (item) {
          return controller.getColorForDataset(item.label);
        })
        .text((item) => `${item.label} (${controller.getSumOfDataset(item.label)})`)
        .on('click', function (event) {
          if (!event || !event.target) return;
          if (!event.target.innerHTML) return;
          let components = event.target.innerHTML.split(' (');
          components.pop();
          let label = components.join(" (");
          timeChart.toggleDataset(label);
        }.bind(this));

      legends
        .append("circle")
        .attr("r", circleRadius)
        .attr("cx", function (item) {
          return xLegend(item.label) - (circleRadius * 2) - 30;
        }.bind(this))
        .attr("cy", function () {
          return timeChart.graphHeight + labelMargin - circleRadius + 2;
        }.bind(this))
        .style('cursor', 'pointer')
        .style("stroke", function (item) {
          return controller.getColorForDataset(item.label).rgbString();
        }.bind(this))
        .style("fill", function (item) {
          return item.isEnabled ? controller.getColorForDataset(item.label).rgbString() : 'white';
        }.bind(this))
        .style("stroke-width", 2);

    };

    this.renderCombinedStacksLegend = function () {
      let stackNames = timeChart.datasetController.stacks;
      let circleRadius = 6;
      let labelMargin = 50;

      let xLegend = d3
        .scaleBand()
        .domain(stackNames)
        .rangeRound([timeChart.margin.left, timeChart.width - timeChart.margin.right]);

      let legends = timeChart
        .graph
        .selectAll('.legend')
        .data(stackNames)
        .enter();

      legends
        .append('text')
        .attr("font-size", 13)
        .attr("x", (item) => xLegend(item) - 30)
        .attr("y", function () {
          return timeChart.graphHeight + labelMargin;
        }.bind(this))
        .style('cursor', 'pointer')
        .style("fill", function (item, index) {
          return Color.colorsForStack(index)[0].rgbString();
        }.bind(this))
        .text(function (item) {
          return `${item} (${sumOfStack(timeChart.flatData, item)})`;
        }.bind(this));

      legends
        .append("circle")
        .attr("r", circleRadius)
        .attr("cx", item => xLegend(item) - (circleRadius * 2) - 30)
        .attr("cy", timeChart.graphHeight + labelMargin - circleRadius + 2)
        .style('cursor', 'pointer')
        .style("stroke", function (item, index) {
          return Color.colorsForStack(index)[0].rgbString();
        }.bind(this))
        .style("fill", function (item, index) {
          return item.isEnabled ? Color.colorsForStack(index)[0].rgbString() : 'white';
        }.bind(this))
        .style("stroke-width", 2);

    };
  }
}
