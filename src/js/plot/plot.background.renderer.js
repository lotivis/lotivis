export class PlotBackgroundRenderer {

  constructor(plotChart) {

    this.render = function () {
      plotChart.svg
        .append('rect')
        .attr('width', plotChart.width)
        .attr('height', plotChart.height)
        .attr('class', 'lotivis-plot-background');
    };
  }
}
