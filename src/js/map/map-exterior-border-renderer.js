/**
 *
 * @class MapExteriorBorderRenderer
 */
import {joinFeatures} from "../geojson-juggle/join-features";

export class MapExteriorBorderRenderer {

  /**
   * Creates a new instance of MapExteriorBorderRenderer.
   *
   * @property mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     *
     */
    this.render = function () {
      if (!self.topojson) return;
      let geoJSON = mapChart.presentedGeoJSON;
      let borders = joinFeatures(geoJSON);
      mapChart.svg
        .append('path')
        .datum(borders)
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-exterior-borders')
    }
  }
}
