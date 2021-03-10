import {hashCode} from "../shared/hash";

export class PlotLabelRenderer {

  constructor(plotChart) {

    this.renderLabels = function () {

      plotChart.labels = plotChart.barsData
        .append('g')
        .attr('transform', `translate(0,${(plotChart.yChart.bandwidth() / 2) + 4})`)
        .append('text')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("fill", 'black')
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('class', 'map-label')
        .attr('opacity', plotChart.isShowLabels ? 1 : 0)
        .attr("x", function (d) {
          let rectX = plotChart.xChart(d.earliestDate);
          let offset = plotChart.xChart.bandwidth() / 2;
          return rectX + offset;
        })
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => plotChart.xChart(d.latestDate) - plotChart.xChart(d.earliestDate) + plotChart.xChart.bandwidth())
        .text(function (dataset) {
          return `${dataset.duration} years, ${dataset.sum} items`;
        });
    };
  }
}
