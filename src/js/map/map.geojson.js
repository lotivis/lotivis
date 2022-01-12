import { Renderer } from "../common/renderer";

export class MapGeojsonRenderer extends Renderer {
  render(chart, controller) {
    let geoJSON = chart.presentedGeoJSON;
    if (!geoJSON) return;

    function mouseEnter(event, feature) {
      chart.fire("mouseenter", event, feature);
    }

    function mouseOut(event, feature) {
      chart.fire("mouseout", event, feature);
      // dragged
      if (event.buttons === 1) mouseClick(event, feature);
    }

    function mouseClick(event, feature) {
      if (!feature || !feature.properties) return;
      if (!chart.controller) return;

      if (chart.config.selectable) {
        let locationID = feature.lotivisId;
        chart.makeUpdateInsensible();
        controller.filters.locations.toggle(locationID);
        chart.makeUpdateSensible();
      }
      chart.fire("click", event, feature);
    }

    chart.areas = chart.svg
      .selectAll("path")
      .append("path")
      .data(geoJSON.features)
      .enter()
      .append("path")
      .attr("d", chart.path)
      .classed("ltv-map-chart-area", true)
      .attr("id", (f) => `ltv-map-chart-area-id-${f.lotivisId}`)
      .style("stroke-dasharray", (f) => (f.departementsData ? "0" : "1,4"))
      .style("fill", "white")
      .style("fill-opacity", 1)
      .on("click", mouseClick)
      .on("mouseenter", mouseEnter)
      .on("mouseout", mouseOut);
  }
}
