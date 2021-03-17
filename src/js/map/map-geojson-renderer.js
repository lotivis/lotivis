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

      mapChart.svg
        .selectAll('path')
        .data(geoJSON.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('id', feature => feature.properties.code)
        .attr('fill', 'white')
        .attr('fill-opacity', 0)
        .attr('stroke', 'black')
        .attr('stroke-width', '0.7')
        .attr('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4')
        .attr('cursor', 'pointer')
        .on('click', mapChart.onSelectFeature.bind(mapChart))
        .on('mouseenter', mapChart.tooltipRenderer.mouserEnter)
        .on('mouseout', mapChart.tooltipRenderer.mouseOut);
    };
  }
}
