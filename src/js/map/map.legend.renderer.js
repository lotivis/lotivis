import {Color} from "../color/color";
import {formatNumber} from "../shared/format";

/**
 *
 * @class MapLegendRenderer
 */
export class MapLegendRenderer {

  /**
   * Creates a new instance of MapLegendRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {
    let legend;

    function appendLegend() {
      legend = mapChart.svg
        .append('svg')
        .attr('class', 'lotivis-map-legend')
        .attr('width', mapChart.width)
        .attr('height', 200)
        .attr('x', 0)
        .attr('y', 0);
    }

    function removeDatasetLegend() {
      legend.selectAll('rect').remove();
      legend.selectAll('text').remove();
    }

    this.render = function () {
      if (!mapChart.dataview) return;

      let stackNames = mapChart.dataview.stacks;
      let combinedData = mapChart.dataview.combinedData;

      appendLegend();
      legend.raise();
      removeDatasetLegend();

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value) || 0;
        let offset = index * 80;
        let color = Color.colorsForStack(index, 1)[0];

        let steps = 4;
        let data = [0, 1 / 4 * max, 1 / 2 * max, 3 / 4 * max, max];
        let generator = Color.colorGenerator(max);

        legend
          .append('text')
          .attr('class', 'lotivis-map-legend-title')
          .attr('x', offset + 10)
          .attr('y', '20')
          .style('fill', color.rgbString())
          .text(stackName);

        legend
          .append("g")
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr('class', 'lotivis-map-legend-rect')
          .style('fill', generator)
          .attr('x', offset + 10)
          .attr('y', (d, i) => (i * 20) + 30)
          .attr('width', 18)
          .attr('height', 18)
          .style('stroke', 'black')
          .style('stroke-width', 1);

        legend
          .append("g")
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr('class', 'lotivis-map-legend-text')
          .attr('x', offset + 35)
          .attr('y', (d, i) => (i * 20) + 44)
          .text((d, i) => formatNumber((i / steps) * max));
      }
    };
  }
}
