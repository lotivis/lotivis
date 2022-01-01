import { joinFeatures } from "./geojson/join.features";
import { lotivis_log } from "../shared/debug";
import * as topojson from "topojson-client";

/**
 *
 * @class MapExteriorBorderRenderer
 */
export class MapExteriorBorderRenderer {
  /**
   * Creates a new instance of MapExteriorBorderRenderer.
   * @property mapChart The parental map.chart chart.
   */
  constructor(mapChart) {
    // if (!topojson) lotivis_log_once('Can\'t find topojson lib.  Skip rendering of exterior border.');

    /**
     * Renders the exterior border of the presented geo json.
     */
    this.render = function() {
      if (!topojson) {
        lotivis_log("[lotivis]  Can't find topojson library.");
        return;
      }
      let geoJSON = mapChart.geoJSON;
      if (!geoJSON) {
        lotivis_log("[lotivis]  No GeoJSON to render.");
        return;
      }

      let borders = joinFeatures(geoJSON.features);
      if (!borders) {
        return lotivis_log("[lotivis]  No borders to render.");
      }

      mapChart.svg
        .selectAll("path")
        .append("path")
        .data(borders.features)
        .enter()
        .append("path")
        .attr("d", mapChart.path)
        .attr("class", "ltv-map-chart-exterior-borders")
        .raise();
    };
  }
}
