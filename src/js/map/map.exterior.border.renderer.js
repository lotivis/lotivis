import {joinFeatures} from "../geojson.juggle/join.features";
import {lotivis_log, lotivis_log_once} from "../shared/debug";

/**
 *
 * @class MapExteriorBorderRenderer
 */
export class MapExteriorBorderRenderer {

  /**
   * Creates a new instance of MapExteriorBorderRenderer.
   * @property mapChart The parental map chart.
   */
  constructor(mapChart) {

    if (!self.topojson) lotivis_log_once('Can\'t find topojson lib.  Skip rendering of exterior border.');

    /**
     * Renders the exterior border of the presented geo json.
     */
    this.render = function () {
      if (!self.topojson) return;
      let geoJSON = mapChart.presentedGeoJSON;
      if (!self.geoJSON) return lotivis_log('[lotivis]  No GeoJSON to render.');
      let borders = joinFeatures(geoJSON);
      if (!borders) return lotivis_log('[lotivis]  No borders to render.');
      mapChart.svg
        .append('path')
        .datum(borders)
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-exterior-borders');
    };
  }
}
