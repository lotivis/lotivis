import { joinFeatures } from "../geojson/join.features";
import { lotivis_log } from "../common/debug";
import { Renderer } from "../common/renderer";

export class MapExteriorBorderRenderer extends Renderer {
  render(chart, controller) {
    let geoJSON = chart.presentedGeoJSON;
    if (!geoJSON) return lotivis_log("[lotivis]  No GeoJSON to render.");

    let bordersGeoJSON = joinFeatures(geoJSON.features);
    if (!bordersGeoJSON) return lotivis_log("[lotivis]  No borders to render.");

    let borders = chart.svg
      .selectAll(".ltv-map-chart-exterior-borders")
      .append("path")
      .data(bordersGeoJSON.features)
      .enter()
      .append("path")
      .attr("d", chart.path)
      .attr("class", "ltv-map-chart-exterior-borders");
  }
}
