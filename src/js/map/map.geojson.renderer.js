/**
 * @class MapGeojsonRenderer
 */
import {debug_log} from "../shared/debug";

export class MapGeojsonRenderer {

  /**
   * Creates a new instance of MapGeojsonRenderer.
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * To be called when the mouse enters an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    function mouseEnter(event, feature) {
      mapChart.tooltipRenderer.mouseEnter(event, feature);
      mapChart.selectionBoundsRenderer.mouseEnter(event, feature);
    }

    /**
     * To be called when the mouse leaves an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    function mouseOut(event, feature) {
      mapChart.tooltipRenderer.mouseOut(event, feature);
      mapChart.selectionBoundsRenderer.mouseOut(event, feature);
    }

    /**
     * Renders the `presentedGeoJSON` property.
     */
    this.renderGeoJson = function () {
      let geoJSON = mapChart.presentedGeoJSON;
      if (!geoJSON) return debug_log('No Geo JSON file to render.');
      let idAccessor = mapChart.config.featureIDAccessor;

      mapChart.areas = mapChart.svg
        .selectAll('path')
        .data(geoJSON.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('id', feature => `lotivis-map-area-${idAccessor(feature)}`)
        .classed('lotivis-map-area', true)
        .style('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4')
        .on('click', mapChart.onSelectFeature.bind(mapChart))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut);
    };
  }
}
