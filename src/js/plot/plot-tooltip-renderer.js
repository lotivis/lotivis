import {hashCode} from "../shared/hash";

export class PlotTooltipRenderer {

  constructor(plotChart) {

    const tooltip = plotChart
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

    /**
     * Presents the tooltip for the given dataset.
     *
     * @param event The mouse event.
     * @param dataset The dataset.
     */
    this.showTooltip = function (event, dataset) {
      let components = [];

      components.push('Label: ' + dataset.label);
      components.push('');
      components.push('Start: ' + dataset.earliestDate);
      components.push('End: ' + dataset.latestDate);
      components.push('');
      components.push('Items: ' + dataset.data.map(item => item.value).reduce((acc, next) => acc + next, 0));
      components.push('');

      for (let index = 0; index < dataset.data.length; index++) {
        let entry = dataset.data[index];
        components.push(`${entry.date}: ${entry.value}`);
      }
      tooltip.html(components.join('<br/>'));

      // position tooltip
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      let factor = plotChart.getElementEffectiveSize()[0] / plotChart.width;
      let offset = plotChart.getElementPosition();
      let top = plotChart.yChart(dataset.label);
      top *= factor;

      let displayUnder = (top - plotChart.margin.top) <= tooltipHeight;
      top += offset[1];

      if (displayUnder) {
        top += plotChart.lineHeight + 10;
      } else {
        top -= tooltipHeight;
        top -= plotChart.lineHeight;
      }

      let left = plotChart.xChart(dataset.earliestDate);
      left *= factor;
      left += offset[0];

      tooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .transition()
        .style('opacity', 1);

      let id = 'rect-' + hashCode(dataset.label);

      plotChart
        .svg
        .selectAll('rect')
        .transition()
        .attr('opacity', 0.15);

      plotChart
        .labels
        .transition()
        .attr('opacity', plotChart.isShowLabels ? 0.15 : 0);

      plotChart
        .svg
        .selectAll(`#${id}`)
        .transition()
        .attr('opacity', 1);

      plotChart
        .labels
        .selectAll(`#${id}`)
        .transition()
        .attr('opacity', 1);

      plotChart.onSelectDataset(event, dataset);
    };

    this.hideTooltip = function () {
      if (+tooltip.style('opacity') === 0) return;
      tooltip.style('opacity', 0);
      plotChart
        .svg
        .selectAll('rect')
        .transition()
        .attr('opacity', 1);
      plotChart
        .labels
        .transition()
        .attr('opacity', plotChart.isShowLabels ? 1 : 0);
    };
  }
}
