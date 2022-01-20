import { joinFeatures } from "../geojson/join.features";
import { D_LOG } from "../common/debug";
import { Renderer } from "../common/renderer";

export class MapExteriorBorderRenderer extends Renderer {
  render(chart, controller) {
    let geoJSON = chart.presentedGeoJSON;
    if (!geoJSON)
      return D_LOG ? console.log("[ltv]  No GeoJSON to render.") : null;

    let bordersGeoJSON = joinFeatures(geoJSON.features);
    if (!bordersGeoJSON)
      return D_LOG ? console.log("[ltv]  No borders to render.") : null;

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
