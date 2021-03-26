/**
 *
 * @class MapSelectionBoundsRenderer
 */
export class MapSelectionBoundsRenderer {

  /**
   * Creates a new instance of MapSelectionBoundsRenderer.
   *
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    let bounds = mapChart.svg
      .append('rect')
      .attr('class', 'lotivis-map-selection-rect')
      .style('fill-opacity', 0);

    /**
     * Tells this renderer that the mouse moved in an area.
     * @param event The mouse event.
     * @param feature The feature (area) that the mouse is now pointing on.
     */
    this.mouseEnter = function (event, feature) {
      if (!mapChart.config.drawRectangleAroundSelection) return;
      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
      let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];
      bounds
        .style('width', featureBoundsWidth + 'px')
        .style('height', featureBoundsHeight + 'px')
        .style('x', featureLowerLeft[0])
        .style('y', featureUpperRight[1])
        .style('opacity', 1);
    };

    /**
     * Tells this renderer that the mouse moved out of an area.
     */
    this.mouseOut = function () {
      bounds.style('opacity', 0);
    };

    /**
     * Raises the rectangle which draws the bounds.
     */
    this.raise = function () {
      bounds.raise();
    };
  }
}
