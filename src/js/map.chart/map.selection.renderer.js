import {lotivis_log, lotivis_log_once} from "../shared/debug";
import {joinFeatures} from "../geojson/join.features";

/**
 *
 * @class MapSelectionRenderer
 */
export class MapSelectionRenderer {

  /**
   * Creates a new instance of MapSelectionRenderer.
   *
   * @param mapChart The parental map.chart chart.
   */
  constructor(mapChart) {

    if (!self.topojson) lotivis_log_once('Can\'t find topojson lib.  Skip rendering of exterior border.');

    /**
     * Returns the collection of selected features.
     *
     * @returns {*[]}
     */
    function getSelectedFeatures() {

      if (!mapChart.geoJSON) {
        return null;
      }

      let allFeatures = mapChart.presentedGeoJSON.features;

      if (!mapChart.datasetController) {
        return null;
      }

      let filteredLocations = mapChart.datasetController.filters.locations;
      let selectedFeatures = [];

      for (let index = 0; index < allFeatures.length; index++) {
        let feature = allFeatures[index];
        let featureID = feature.lotivisId;

        if (filteredLocations.indexOf(String(featureID)) !== -1) {
          selectedFeatures.push(feature);
        }
      }

      return selectedFeatures;
    }

    /**
     * Renders the exterior border of the presented geo json.
     */
    this.render = function () {

      if (!self.topojson) {
        lotivis_log('[lotivis]  Can\'t find topojson library.');
        return;
      }

      // return;

      mapChart.selectedFeatures = getSelectedFeatures();
      mapChart.selectionBorderGeoJSON = joinFeatures(mapChart.selectedFeatures);
      if (!mapChart.selectionBorderGeoJSON) {
        return lotivis_log('[lotivis]  No selected features to render.');
      }

      mapChart.svg
        .selectAll('.lotivis-map-chart-selection-border')
        .remove();

      mapChart.svg
        .selectAll('.lotivis-map-chart-selection-border')
        .append('path')
        .attr('class', 'lotivis-map-chart-selection-border')
        .data(mapChart.selectionBorderGeoJSON.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-chart-selection-border')
        .raise();
    };

    this.raise = function () {
      mapChart.svg
        .selectAll('.lotivis-map-chart-selection-border')
        .raise();
    };
  }
}
