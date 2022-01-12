import * as d3 from "d3";
import { LOTIVIS_CONFIG } from "../common/config";
import { MapColors } from "../common/colors";
import { Renderer } from "../common/renderer";

export class MapLegendRenderer extends Renderer {
  render(chart, controller, dataView) {
    if (!dataView) return;
    let legend;

    function appendLegend() {
      legend = chart.svg
        .append("svg")
        .attr("class", "ltv-map-chart-legend")
        .attr("width", chart.config.width)
        .attr("height", 200)
        .attr("x", 0)
        .attr("y", 0);
    }

    function removeDatasetLegend() {
      legend.selectAll("rect").remove();
      legend.selectAll("text").remove();
    }

    appendLegend();
    legend.raise();
    removeDatasetLegend();

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
    let stackNames = chart.dataView.stacks;
    let label = chart.config.label || stackNames[0];
    let locationToSum = dataView.locationToSum;
    let max = d3.max(locationToSum, (item) => item[1]);

    let offset = 0 * 80;
    let labelColor = chart.controller.colorGenerator.stack(label);

    let steps = 4;
    let data = [0, (1 / 4) * max, (1 / 2) * max, (3 / 4) * max, max];
    let generator = MapColors(max);

    legend
      .append("text")
      .attr("class", "ltv-map-chart-legend-title")
      .attr("x", offset + 10)
      .attr("y", "20")
      .style("fill", labelColor)
      .text(label);

    legend
      .append("g")
      .selectAll("text")
      .data(["No Data"])
      .enter()
      .append("text")
      .attr("class", "ltv-map-chart-legend-text")
      .attr("x", offset + 35)
      .attr("y", 44)
      .text((d) => d);

    legend
      .append("g")
      .selectAll("rect")
      .data([0])
      .enter()
      .append("rect")
      .attr("class", "ltv-map-chart-legend-rect")
      .style("fill", "white")
      .attr("x", offset + 10)
      .attr("y", 30)
      .attr("width", 18)
      .attr("height", 18)
      .style("stroke-dasharray", "1,3")
      .style("stroke", "black")
      .style("stroke-width", 1);

    legend
      .append("g")
      .selectAll("text")
      .data([0])
      .enter()
      .append("text")
      .attr("class", "lotivis-location-chart-legend-text")
      .attr("x", offset + 35)
      .attr("y", 64)
      .text((d) => d);

    legend
      .append("g")
      .selectAll("rect")
      .data([0])
      .enter()
      .append("rect")
      .attr("class", "ltv-map-chart-legend-rect")
      .style("fill", "WhiteSmoke")
      .attr("x", offset + 10)
      .attr("y", 50)
      .attr("width", 18)
      .attr("height", 18)
      .style("stroke", "black")
      .style("stroke-width", 1);

    legend
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "ltv-map-chart-legend-rect")
      .style("fill", generator)
      .attr("x", offset + 10)
      .attr("y", (d, i) => i * 20 + 70)
      .attr("width", 18)
      .attr("height", 18)
      .style("stroke", "black")
      .style("stroke-width", 1);

    legend
      .append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "ltv-map-chart-legend-text")
      .attr("x", offset + 35)
      .attr("y", (d, i) => i * 20 + 84)
      .text(function (d, i) {
        if (d === 0) {
          return "> 0";
        } else {
          return numberFormat((i / steps) * max);
        }
      });

    for (let index = 0; index < stackNames.length; index++) {
      return;
    }
  }
}
