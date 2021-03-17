import {joinFeatures} from "../geojson-juggle/join-features";
import {Constants} from "../shared/constants";

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
      if (!self.topojson) {
        if (Constants.debugLog) {
          console.log('Can\'t find topojson lib.');
        }
        return;
      }
      let geoJSON = mapChart.presentedGeoJSON;
      let borders = joinFeatures(geoJSON);
      mapChart.svg
        .append('path')
        .datum(borders)
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-exterior-borders');
    };
  }
}
