import {lotivis_log} from "../shared/debug";

/**
 * @class MapGeoJSONRenderer
 */
export class MapGeoJSONRenderer {

  /**
   * Creates a new instance of MapGeoJSONRenderer.
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * To be called when the mouse enters an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    function mouseEnter(event, feature) {
      mapChart.datasetRenderer.mouseEnter(event, feature);
      mapChart.tooltipRenderer.mouseEnter(event, feature);
      mapChart.selectionBoundsRenderer.mouseEnter(event, feature);
    }

    /**
     * To be called when the mouse leaves an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    function mouseOut(event, feature) {
      mapChart.datasetRenderer.mouseOut(event, feature);
      mapChart.tooltipRenderer.mouseOut(event, feature);
      mapChart.selectionBoundsRenderer.mouseOut(event, feature);
    }

    /**
     * Renders the `presentedGeoJSON` property.
     */
    this.render = function () {
      let geoJSON = mapChart.presentedGeoJSON;
      if (!geoJSON) return lotivis_log('[lotivis]  No GeoJSON to render.');
      let idAccessor = mapChart.config.featureIDAccessor;

      // lotivis_log('geoJSON', geoJSON);

      mapChart.areas = mapChart.svg
        .selectAll('path')
        .data(geoJSON.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('id', feature => `lotivis-map-area-${idAccessor(feature)}`)
        .classed('lotivis-map-area', true)
        .style('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4')
        .style('fill', 'white')
        .style('fill-opacity', 1)
        .on('click', mapChart.onSelectFeature.bind(mapChart))
        .on('mouseenter', mouseEnter)
        .on('mouseout', mouseOut);
    };
  }
}
