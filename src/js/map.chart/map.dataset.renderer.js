import {equals} from "../shared/equal";
import {Color} from "../shared/color";
import {lotivis_log} from "../shared/debug";
import {styleForCSSClass} from "../shared/style";

/**
 *
 * @class MapDatasetRenderer
 */
export class MapDatasetRenderer {

  /**
   * Creates a new instance of MapDatasetRenderer.
   * @param mapChart The parental map.chart chart.
   */
  constructor(mapChart) {

    let generator = Color.mapColors(1);
    let styleArea = styleForCSSClass('lotivis-map-chart-area');
    let styleHover = styleForCSSClass('lotivis-map-chart-area-hover');

    /**
     * Resets the `fill` and `fill-opacity` property of each area.
     */
    function resetAreas() {
      mapChart.svg
        .selectAll('.lotivis-map-chart-area')
        .classed('lotivis-map-chart-area-hover', false);
    }

    function featureMapID(feature) {
      return `lotivis-map-chart-area-id-${feature.lotivisId}`;
    }

    /**
     * Called by map chart GeoJSON renderer when mouse enters an area drawn
     * on the location chart.
     *
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseEnter = function (event, feature) {
      resetAreas();

      let color = styleArea.stroke || Color.defaultTint.rgbString();
      let mapID = featureMapID(feature);

      mapChart
        .svg
        .selectAll(`#${mapID}`)
        .raise()
        .classed('lotivis-map-chart-area-hover', true);
        // .style('stroke', styleHover.stroke || color)
        // .style('stroke-width', styleHover['stroke-width'] || '4')
        // .style('stroke-dasharray', '0');

      mapChart
        .svg
        .selectAll('.lotivis-location-chart-label')
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
      if (!mapChart.dataview) return lotivis_log('[lotivis]  No data view property.');

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
            .selectAll('.lotivis-map-chart-area')
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
