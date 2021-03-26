import {styleForCSSClass} from "../shared/style";
import {equals} from "../shared/equal";
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

    let generator = Color.colorGenerator(1);

    /**
     * Resets the `fill` and `fill-opacity` property of each area.
     */
    function resetAreas() {
      let style = styleForCSSClass('.lotivis-map-area');
      mapChart.svg
        .selectAll('.lotivis-map-area')
        .style('fill', 'whitesmoke')
        .style('fill-opacity', 1);
      // .style('fill', style.fill || 'white')
      // .style('fill-opacity', style['fill-opacity'] || 0);
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
        let color = mapChart.datasetController.getColorForStack(stackName);

        for (let index = 0; index < dataForStack.length; index++) {

          let datasetEntry = dataForStack[index];
          let locationID = datasetEntry.location;
          let opacity = Number(datasetEntry.value / max);

          mapChart.svg
            .selectAll('.lotivis-map-area')
            .filter((item) => equals(mapChart.config.featureIDAccessor(item), locationID))
            .style('fill', generator(opacity));
          // .style('fill-opacity', opacity);

        }
      }
    };
  }
}
