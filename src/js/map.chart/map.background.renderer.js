/**
 *
 * @class MapBackgroundRenderer
 */
export class MapBackgroundRenderer {

  /**
   * Creates a new instance of MapBackgroundRenderer.
   *
   * @param mapChart The parental map.chart chart.
   */
  constructor(mapChart) {

    function onMouseClick() {
      let controller = mapChart.datasetController;
      if (!controller) return;

      let filters = controller.filters.locations;
      if (!filters || filters.length === 0) return;
      mapChart.updateSensible = false;
      controller.resetLocationFilters();
      mapChart.updateSensible = true;

      mapChart.selectionRenderer.render();
    }

    /**
     * Appends a background rectangle.
     */
    this.render = function () {
      // create a background rectangle for receiving mouse enter events
      // in order to reset the location samples filter.
      mapChart.svg
        .append('rect')
        .attr('class', 'lotivis-map-chart-background')
        .attr('width', mapChart.config.width)
        .attr('height', mapChart.config.height)
        .attr('fill', 'white')
        .on('click', onMouseClick);
    };
  }
}
