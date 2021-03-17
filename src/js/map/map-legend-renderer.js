import {Color} from "../shared/colors";
import {formatNumber} from "../shared/format";

/**
 *
 * @class MapLegendRenderer
 */
export class MapLegendRenderer {

  constructor(mapChart) {

    this.legend = mapChart.svg
      .append('svg')
      .attr('class', 'legend')
      .attr('fill', 'red')
      .attr('width', mapChart.width)
      .attr('height', 200)
      .attr('x', 0)
      .attr('y', 0);

    this.removeDatasetLegend = function () {
      this.legend.selectAll('rect').remove();
      this.legend.selectAll('text').remove();
    };

    this.render = function () {
      if (!mapChart.datasetController) return;

      let stackNames = mapChart.datasetController.stacks;
      let combinedData = mapChart.combinedData;

      this.legend.raise();
      this.removeDatasetLegend();

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);
        let offset = index * 80;
        let color = Color.colorsForStack(index, 1)[0];

        let steps = 4;
        let data = [0, 1, 2, 3, 4];

        this.legend
          .append('text')
          .attr('x', offset + 20)
          .attr('y', '14')
          .style('fill', color.rgbString())
          .text(stackName);

        this.legend
          .append("g")
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .style('fill', color.rgbString())
          .attr('x', '20')
          .attr('y', '20')
          .attr('width', 18)
          .attr('height', 18)
          .attr('transform', function (d, i) {
            return 'translate(' + offset + ',' + (i * 20) + ')';
          })
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('fill-opacity', (d, i) => i / steps);

        this.legend
          .append("g")
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .style('fill', color.rgbString())
          .attr('x', '40')
          .attr('y', '35')
          .attr('width', 18)
          .attr('height', 18)
          .attr('transform', function (d, i) {
            return 'translate(' + offset + ',' + (i * 20) + ')';
          })
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('fill-opacity', (d, i) => i / steps)
          .text(function (d, i) {
            return formatNumber((i / steps) * max);
          }.bind(this));

      }
    };
  }
}
