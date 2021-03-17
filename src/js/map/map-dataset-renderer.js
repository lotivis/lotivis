import {Color} from "../shared/colors";
import {styleForCSSClass} from "../shared/style";

/**
 *
 * @class MapDatasetRenderer
 */
export class MapDatasetRenderer {

  /**
   * Creates a new instance of MapDatasetRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    function resetAreas() {
      let style = styleForCSSClass('.lotivis-map-area');
      mapChart.svg
        .selectAll('.lotivis-map-area')
        .style('fill', style.fill || 'green')
        .style('fill-opacity', style.fill || 0.5);
    }

    /**
     * Iterates the datasets per stack and draws them on svg.
     */
    this.render = function () {
      if (!mapChart.geoJSON) return;
      if (!mapChart.datasetController) return;

      let stackNames = mapChart.datasetController.stacks;
      let combinedData = mapChart.combinedData;

      resetAreas();

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);
        let color = Color.colorsForStack(index)[0];

        for (let index = 0; index < dataForStack.length; index++) {
          let datasetEntry = dataForStack[index];
          let id = datasetEntry.location;
          let opacitydf = datasetEntry.value / max;
          console.log(opacitydf);
          mapChart.svg
            .selectAll('.lotivis-map-area')
            .filter(function (item) {
              if (!item.properties) return false;
              return String(item.properties.code) !== String(id);
            })
            .style('fill', color.rgbString())
            .style('fill', 'red')
            .attr('fill-opacity', 0 + opacitydf);
        }
      }
    };
  }
}
