import {log_debug} from "../shared/debug";
import {combineByDate} from "../data-juggle/dataset-combine";

export class DateTooltipRenderer {

  /**
   * Creates a new instance of DateTooltipRenderer.
   *
   * @constructor
   */
  constructor(dateChart) {

    const tooltip = dateChart
      .element
      .append('div')
      .attr('class', 'chart-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('position', 'absolute')
      .style('color', 'black')
      .style('border', function () {
        return `solid 1px grey`;
      })
      .style('opacity', 0);

    this.showTooltip = function (event, date) {

      let flatData = dateChart.datasetController
        .enabledFlatData
        .filter(item => item.date === date);
      let combined = combineByDate(flatData)
        .filter(item => item.value > 0);
      let dataHTML = combined.map(function (item) {
        return `${item.dataset}: <b>${item.value}</b>`;
      }).join('<br>');

      let html = `<b>${date}</b>`;
      html += '<br>';
      html += dataHTML;

      tooltip.html(html);

      // position tooltip
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      let tooltipWidth = Number(tooltip.style('width').replace('px', ''));
      let factor = dateChart.getElementEffectiveSize()[0] / dateChart.width;
      let offset = dateChart.getElementPosition();
      let x = dateChart.xChart(date);

      let displayLeft = x > (dateChart.width / 2);
      if (!displayLeft) {
        x += dateChart.xChart.bandwidth();
      }
      x *= factor;
      x += offset[0];
      if (displayLeft) {
        x -= tooltipWidth + 22;
      }

      let y = dateChart.graphHeight / 2;
      y += dateChart.margin.top;
      y *= factor;
      y += offset[1];
      y -= tooltipHeight / 2;

      tooltip
        .style('left', x + 'px')
        .style('top', y + 'px')
        .transition()
        .style('opacity', 1);

    };

    this.hideTooltip = function (event, iwas) {
      if (+tooltip.style('opacity') === 0) return;
      tooltip.transition().style('opacity', 0);
    };
  }
}
