import {joinFeatures} from "../geojson-juggle/join.features";
import {debug_log} from "../shared/debug";

/**
 *
 * @class MapExteriorBorderRenderer
 */
export class MapExteriorBorderRenderer {

  /**
   * Creates a new instance of MapExteriorBorderRenderer.
   *
   * @property mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Renders the exterior border of the presented geo json.
     */
    this.render = function () {
      if (!self.topojson) return debug_log('Can\'t find topojson lib.  Skip rendering of exterior border.');
      let geoJSON = mapChart.presentedGeoJSON;
      let borders = joinFeatures(geoJSON);
      if (!borders) return;
      mapChart.svg
        .append('path')
        .datum(borders)
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-exterior-borders');
    };
  }
}
