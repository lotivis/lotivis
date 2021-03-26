import {hashCode} from "../shared/hash";
import {verbose_log} from "../shared/debug";

/**
 * Draws the bar on the plot chart.
 * @class PlotBarsRenderer
 */
export class PlotBarsRenderer {

  /**
   * Creates a new instance of PlotAxisRenderer.
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {

    // constant for the radius of the drawn bars.
    const radius = 6;

    let definitions = plotChart.svg.append("defs");

    function createIDFromDataset(dataset) {
      if (!dataset || !dataset.label) return 0;
      return dataset.label.replaceAll(' ', '-');
    }

    function createGradient(dataset) {
      let max = plotChart.datasetController.getMax();
      let gradient = definitions
        .append("linearGradient")
        .attr("id", 'lotivis-plot-gradient-' + createIDFromDataset(dataset))
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      let data = dataset.data;
      let count = data.length;
      let firstDate = dataset.earliestDate;
      let lastDate = dataset.latestDate;
      let timespan = lastDate - firstDate;
      let colorInterpolator = d3.interpolateRgb(
        plotChart.configuration.lowColor,
        plotChart.configuration.highColor
      );

      if (firstDate === lastDate) {
        if (!data || data.length === 0) return;
        let item = data[0];
        let value = item.value;
        let opacity = value / max;

        gradient
          .append("stop")
          .attr("offset", `100%`)
          .attr("stop-color", colorInterpolator(opacity));

      } else {

        for (let index = 0; index < count; index++) {

          let item = data[index];
          let date = item.date;
          let opacity = item.value / max;

          let dateDifference = lastDate - date;
          let datePercentage = (1 - (dateDifference / timespan)) * 100;

          gradient
            .append("stop")
            .attr("offset", `${datePercentage}%`)
            .attr("stop-color", colorInterpolator(opacity));

        }
      }
    }

    /**
     * To be called when the mouse enters a bar on the plot chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseEnter(event, dataset) {
      verbose_log('event', event);
      verbose_log('bar', dataset);
      plotChart.tooltipRenderer.showTooltip.bind(plotChart);
    }

    /**
     * To be called when the mouse leaves a bar on the plot chart.
     * @param event The mouse event.
     * @param dataset The represented dataset.
     */
    function mouseOut(event, dataset) {
      plotChart.tooltipRenderer.hideTooltip.bind(plotChart);
    }

    /**
     * Draws the bars.
     */
    this.renderBars = function () {
      let datasets = plotChart.workingDatasets;
      definitions = plotChart.svg.append("defs");

      for (let index = 0; index < datasets.length; index++) {
        createGradient(datasets[index]);
      }

      plotChart.barsData = plotChart
        .svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.bars = plotChart.barsData
        .append("rect")
        .attr("fill", (d) => `url(#lotivis-plot-gradient-${createIDFromDataset(d)})`)
        .attr('class', 'lotivis-plot-bar')
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => plotChart.xChart(d.earliestDate || 0))
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("height", plotChart.yChart.bandwidth())
        .attr("id", (d) => 'rect-' + createIDFromDataset(d))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut)
        .attr("width", function (data) {
          if (!data.earliestDate || !data.latestDate) return 0;
          return plotChart.xChart(data.latestDate) - plotChart.xChart(data.earliestDate) + plotChart.xChart.bandwidth();
        }.bind(this));
    };
  }
}
