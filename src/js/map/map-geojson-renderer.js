/**
 * @class MapGeoJsonRenderer
 */
export class MapGeoJsonRenderer {

  /**
   * Creates a new instance of MapGeoJsonRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Renders the `geoJSON` property.
     */
    this.renderGeoJson = function () {
      let geoJSON = mapChart.presentedGeoJSON;
      let idAccessor = mapChart.featureIDAccessor;

      mapChart.svg
        .selectAll('path')
        .data(geoJSON.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('id', feature => `lotivis-map-area-${idAccessor(feature)}`)
        .attr('class', 'lotivis-map-area')
        .style('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4')
        .on('click', mapChart.onSelectFeature.bind(mapChart))
        .on('mouseenter', mapChart.tooltipRenderer.mouserEnter)
        .on('mouseout', mapChart.tooltipRenderer.mouseOut);
    };
  }
}
