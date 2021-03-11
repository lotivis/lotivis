import {hashCode} from "../shared/hash";

export class PlotLabelRenderer {

  constructor(plotChart) {

    this.renderLabels = function () {
      let xBandwidth = plotChart.yChart.bandwidth();
      let xChart = plotChart.xChart;
      plotChart.labels = plotChart.barsData
        .append('g')
        .attr('transform', `translate(0,${(xBandwidth / 2) + 4})`)
        .append('text')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("fill", 'black')
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('class', 'map-label')
        .attr('opacity', plotChart.isShowLabels ? 1 : 0)
        .attr("x", function (d) {
          let rectX = xChart(d.earliestDate);
          let offset = xBandwidth / 2;
          return rectX + offset;
        })
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => xChart(d.latestDate) - xChart(d.earliestDate) + xBandwidth)
        .text(function (dataset) {
          if (dataset.sum === 0) return;
          return `${dataset.duration} years, ${dataset.sum} items`;
        });
    };
  }
}
