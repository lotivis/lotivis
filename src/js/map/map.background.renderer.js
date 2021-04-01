/**
 *
 * @class MapBackgroundRenderer
 */
export class MapBackgroundRenderer {

  /**
   * Creates a new instance of MapBackgroundRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Appends a background rectangle.
     */
    this.render = function () {
      // create a background rectangle for receiving mouse enter events
      // in order to reset the location data filter.
      mapChart.svg
        .append('rect')
        .attr('width', mapChart.config.width)
        .attr('height', mapChart.config.height)
        .attr('fill', 'white')
        .on('mouseenter', function () {

          let controller = mapChart.datasetController;
          if (!controller) return;
          let filters = controller.locationFilters;
          if (!filters || filters.length === 0) return;
          this.updateSensible = false;
          controller.setLocationsFilter([]);
          this.updateSensible = true;

        }.bind(this));
    };
  }
}
