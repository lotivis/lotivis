/**
 *
 * @class MapBackgroundRenderer
 */
export class MapBackgroundRenderer {

  /**
   * Creates a new instance of MapBackgroundRenderer.
   * @param mapChart The parental location.chart chart.
   */
  constructor(mapChart) {

    function mouseEnter() {
      let controller = mapChart.datasetController;
      if (!controller) return;
      let filters = controller.locationFilters;
      if (!filters || filters.length === 0) return;
      mapChart.updateSensible = false;
      // controller.setLocationsFilter([]);
      controller.resetFilters();
      mapChart.updateSensible = true;
    }

    /**
     * Appends a background rectangle.
     */
    this.render = function () {
      // create a background rectangle for receiving mouse enter events
      // in order to reset the location samples filter.
      mapChart.svg
        .append('rect')
        .attr('width', mapChart.config.width)
        .attr('height', mapChart.config.height)
        .attr('fill', 'white')
        .on('mouseenter', mouseEnter);
    };
  }
}
