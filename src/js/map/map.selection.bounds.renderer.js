/**
 *
 * @class
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

    this.mouseEnter = function (event, feature) {
      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
      let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];
      bounds
        .style('opacity', mapChart.drawRectangleAroundSelection ? 1 : 0)
        .style('width', featureBoundsWidth + 'px')
        .style('height', featureBoundsHeight + 'px')
        .style('x', featureLowerLeft[0])
        .style('y', featureUpperRight[1]);
    }

    this.mouseOut = function () {
      bounds.style('opacity', 0);
    }

    /**
     * Raises the rectangle which draws the bounds.
     */
    this.raise = function () {
      bounds.raise();
    };
  }
}
