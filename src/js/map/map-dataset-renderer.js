import {Color} from "../shared/colors";

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

    /**
     * Iterates the datasets per stack and draws them on svg.
     */
    this.render = function () {
      if (!mapChart.geoJSON) return;
      if (!mapChart.datasetController) return;

      let stackNames = mapChart.datasetController.stacks;
      let combinedData = mapChart.combinedData;

      // reset colors
      mapChart.svg
        .selectAll('path')
        .attr('fill', 'white')
        .attr('fill-opacity', '0');

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);
        let color = Color.colorsForStack(index)[0];

        for (let index = 0; index < dataForStack.length; index++) {
          let datasetEntry = dataForStack[index];
          let id = datasetEntry.location;

          mapChart.svg
            .selectAll('path')
            .filter(item => String(item.properties.code) === String(id))
            .attr('fill', color.rgbString())
            .attr('fill-opacity', datasetEntry.value / max);

        }
      }
    };
  }
}
