import { lotivis_log } from "../common/debug";
import { MapColors } from "../common/colors";
import * as d3 from "d3";
import { Renderer } from "../common/renderer";

export class MapDatasetRenderer extends Renderer {
  render(chart, controller, dataView) {
    let generator = MapColors(1);

    function resetAreas() {
      chart.svg
        .selectAll(".ltv-map-chart-area")
        .classed("ltv-map-chart-area-hover", false);
    }

    function featureMapID(feature) {
      return `ltv-map-chart-area-id-${feature.lotivisId}`;
    }

    function mouseEnter(event, feature) {
      resetAreas();
      if (!feature) return;

      let mapID = featureMapID(feature);

      chart.svg
        .selectAll(`#${mapID}`)
        .raise()
        .classed("ltv-map-chart-area-hover", true);

      chart.svg.selectAll(".ltv-location-chart-label").raise();
    }

    chart.addListener("mouseenter", mouseEnter);
    chart.addListener("mouseout", resetAreas);
    chart.addListener("click", mouseEnter);

    if (!chart.geoJSON) return lotivis_log("[lotivis]  No GeoJSON to render.");
    if (!chart.dataView) return;

    resetAreas();

    let stackNames = chart.dataView.stacks;
    let locationToSum = dataView.locationToSum;
    let locations = Array.from(locationToSum.keys());
    let max = d3.max(locationToSum, (item) => item[1]);

    for (let i = 0; i < locations.length; i++) {
      let location = locations[i];
      let value = locationToSum.get(location);
      let opacity = Number(value / max);
      let color = opacity === 0 ? "WhiteSmoke" : generator(opacity);

      chart.svg
        .selectAll(".ltv-map-chart-area")
        .filter((item) => item.lotivisId === location)
        .style("fill", () => color)
        .raise();
    }

    for (let index = 0; index < stackNames.length; index++) {
      return;
    }
  }
}
