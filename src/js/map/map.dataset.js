import { max as d3max } from "d3";
import { D_LOG } from "../common/debug";
import { MapColors } from "../common/colors";
import { Renderer } from "../common/renderer";

export class MapDatasetRenderer extends Renderer {
  render(chart, controller, dataView) {
    let generator = MapColors(1);
    let selectionOpacity = 0.1;

    function opacity(location) {
      return controller.filters.locations.contains(location)
        ? selectionOpacity
        : 1;
    }

    function resetAreas() {
      chart.svg
        .selectAll(".ltv-map-chart-area")
        .classed("ltv-map-chart-area-hover", false)
        .attr("opacity", (item) => opacity(item.lotivisId));
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

    chart.on("mouseenter", mouseEnter);
    chart.on("mouseout", resetAreas);
    chart.on("click", mouseEnter);

    if (!chart.geoJSON)
      return D_LOG ? console.log("[ltv]  No GeoJSON to render.") : null;
    if (!chart.dataView) return;

    resetAreas();

    let locationToSum = dataView.locationToSum;
    let locations = Array.from(locationToSum.keys());
    let max = d3max(locationToSum, (item) => item[1]);

    for (let i = 0; i < locations.length; i++) {
      let location = locations[i];
      let value = locationToSum.get(location);
      // console.log("value", value);

      let opacity = Number(value / max);
      let color = opacity === 0 ? "WhiteSmoke" : generator(opacity);

      chart.svg
        .selectAll(".ltv-map-chart-area")
        .filter((item) => item.lotivisId === location)
        .style("fill", () => color)
        .raise();
    }
  }
}
