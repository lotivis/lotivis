import {verbose_log} from "../shared/debug";
import {hashCode} from "../shared/hash";
import {Color} from "../shared/color";

/**
 * Draws the bar on the plot chart.
 *
 * @class PlotGradientCreator
 */
export class PlotGradientCreator {

  /**
   * Creates a new instance of PlotGradientCreator.
   *
   * @constructor
   * @param plotChart The parental plot chart.
   */
  constructor(plotChart) {
    this.plotChart = plotChart;
    this.colorGenerator = Color.plotColor(1);
  }

  createGradient(dataset, id) {

    let max = this.plotChart.dataView.max;
    let gradient = this.plotChart.definitions
      .append("linearGradient")
      .attr("id", 'lotivis-plot-gradient-' + id)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    let data = dataset.data;
    let dataWithValues = dataset.dataWithValues;
    let count = dataWithValues.length;
    let latestDate = dataset.latestDate;
    let duration = dataset.duration + 1;

    let colorInterpolator = d3.interpolateRgb(
      this.plotChart.config.lowColor,
      this.plotChart.config.highColor
    );

    if (!data || data.length === 0) return;

    if (duration === 0) {

      let item = data[0];
      let value = item.value;
      let opacity = value / max;

      gradient
        .append("stop")
        .attr("offset", `100%`)
        .attr("stop-color", this.colorGenerator(opacity));

    } else {

      for (let index = 0; index < count; index++) {

        let item = dataWithValues[index];
        let date = item.date;
        let opacity = item.value / max;

        let dateDifference = latestDate - date;
        let value = (dateDifference / duration);
        let datePercentage = (1 - value) * 100;

        if (datePercentage > 100) {
          verbose_log('dataset', dataset);
          verbose_log('latestDate', latestDate);
          verbose_log('date', date);
          verbose_log('datePercentage', datePercentage);
        }

        gradient
          .append("stop")
          .attr("offset", `${datePercentage}%`)
          .attr("stop-color", this.colorGenerator(opacity));

      }
    }
  }
}
