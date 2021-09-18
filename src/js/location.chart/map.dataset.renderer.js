import {equals} from "../shared/equal";
import {Color} from "../shared.color/color";
import '../shared.color/color.map';
import {lotivis_log} from "../shared/debug";

/**
 *
 * @class MapDatasetRenderer
 */
export class MapDatasetRenderer {

  /**
   * Creates a new instance of MapDatasetRenderer.
   * @param mapChart The parental location.chart chart.
   */
  constructor(mapChart) {

    let generator = Color.colorGenerator(1);

    /**
     * Resets the `fill` and `fill-opacity` property of each area.
     */
    function resetAreas() {
      // let style = styleForCSSClass('.lotivis-location.chart-area');
      // mapChart.svg
      //   .selectAll('.lotivis-location.chart-area')
      //   .style('fill', 'whitesmoke')
      //   .style('fill-opacity', 1);
    }

    function featureMapID(feature) {
      return `lotivis-map-area-${mapChart.config.featureIDAccessor(feature)}`;
    }

    /**
     * Called by location.chart GeoJSON renderer when mouse enters an area drawn on the location.chart.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseEnter = function (event, feature) {
      resetAreas();
      let color = Color.defaultTint.rgbString();
      let mapID = featureMapID(feature);
      mapChart
        .svg
        .selectAll(`#${mapID}`)
        .raise() // bring element to top
        .style('stroke', () => color)
        .style('stroke-width', '2')
        .style('stroke-dasharray', '0');

      mapChart
        .svg
        .selectAll('.lotivis-location.chart-label')
        .raise();
    };

    /**
     * Tells this renderer that the mouse moved out of an area.
     */
    this.mouseOut = function () {
      resetAreas();
    };

    /**
     * Iterates the datasets per stack and draws them on svg.
     */
    this.render = function () {
      if (!mapChart.geoJSON) return lotivis_log('[lotivis]  No GeoJSON to render.');
      if (!mapChart.dataview) return lotivis_log('[lotivis]  No dataview property.');

      let stackNames = mapChart.dataview.stacks;
      let combinedData = mapChart.dataview.combinedData;
      resetAreas();

      for (let index = 0; index < stackNames.length; index++) {

        let stackName = stackNames[index];
        let dataForStack = combinedData.filter(data => data.stack === stackName);
        let max = d3.max(dataForStack, item => item.value);

        for (let index = 0; index < dataForStack.length; index++) {

          let datasetEntry = dataForStack[index];
          let locationID = datasetEntry.location;
          let opacity = Number(datasetEntry.value / max);

          mapChart.svg
            .selectAll('.lotivis-location.chart-area')
            .filter((item) => equals(mapChart.config.featureIDAccessor(item), locationID))
            .style('fill', function () {
              if (opacity === 0) {
                return 'WhiteSmoke';
              } else {
                return generator(opacity);
              }
            });

        }

        return;
      }
    };
  }
}
