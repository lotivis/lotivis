import { lotivis_log } from "../common/debug";
import { Renderer } from "../common/renderer";
import { joinFeatures } from "../geojson/join.features";

export class MapSelectionRenderer extends Renderer {
  render(chart, controller, dataView) {
    function getSelectedFeatures() {
      if (!chart.presentedGeoJSON) return null;

      let allFeatures = chart.presentedGeoJSON.features;
      if (!chart.controller) return null;

      let filteredLocations = chart.controller.filters.locations;
      if (filteredLocations.length === 0) return [];
      // return chart.presentedGeoJSON.features;
      let selectedFeatures = [];

      for (let index = 0; index < allFeatures.length; index++) {
        let feature = allFeatures[index];
        let featureID = feature.lotivisId;

        if (filteredLocations.contains(featureID)) {
          selectedFeatures.push(feature);
        }
      }

      return selectedFeatures;
    }

    function raise() {
      chart.svg.selectAll(".ltv-map-chart-selection-border").raise();
    }

    function _render() {
      chart.selectedFeatures = getSelectedFeatures();
      chart.selectionBorderGeoJSON = joinFeatures(chart.selectedFeatures);
      if (!chart.selectionBorderGeoJSON) {
        return lotivis_log("[lotivis]  No selected features to render.");
      }
      chart.svg.selectAll(".ltv-map-chart-selection-border").remove();
      chart.svg
        .selectAll(".ltv-map-chart-selection-border")
        .append("path")
        .attr("class", "ltv-map-chart-selection-border")
        .data(chart.selectionBorderGeoJSON.features)
        .enter()
        .append("path")
        .attr("d", chart.path)
        .attr("class", "ltv-map-chart-selection-border")
        .raise();
    }

    chart.addListener("mouseout", raise);
    chart.addListener("click", _render);

    _render();
  }
}
