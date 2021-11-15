import {lotivis_log, lotivis_log_once} from "../shared/debug";
import {joinFeatures} from "../geojson/join.features";
import {copy} from "../shared/copy";

/**
 *
 * @class MapSelectionRenderer
 */
export class MapSelectionRenderer {

  /**
   * Creates a new instance of MapSelectionRenderer.
   * @param mapChart The parental map.chart chart.
   */
  constructor(mapChart) {

    if (!self.topojson) lotivis_log_once('Can\'t find topojson lib.  Skip rendering of exterior border.');

    function getSelectedFeatures() {
      if (!mapChart.geoJSON) { return; }
      if (!mapChart.datasetController) { return lotivis_log('[lotivis]  MapSelectionRenderer: no datasets controller'); }

      let allFeatures = copy(mapChart.geoJSON.features);
      let filteredLocations = mapChart.datasetController.filters.locations;
      console.log('getSelectedFeatures allFeatures', allFeatures);
      console.log('getSelectedFeatures filteredLocations', filteredLocations);
      console.log('getSelectedFeatures datasetController.filters', mapChart.datasetController.filters);

      let selectedFeatures = [];

      for (let index = 0; index < allFeatures.length; index++) {
        let feature = allFeatures[index];
        let featureID = mapChart.config.featureIDAccessor(feature);

        if (filteredLocations.indexOf(String(featureID)) !== -1) {
          selectedFeatures.push(feature);
        }
      }

      console.log('getSelectedFeatures selectedFeatures', selectedFeatures);

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

      let selectedFeatures = joinFeatures(getSelectedFeatures());
      if (!selectedFeatures) {
        return lotivis_log('[lotivis]  No selected features to render.');
      }

      mapChart.svg
        .selectAll('path')
        .append('path')
        .data(selectedFeatures.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-chart-selection-rect')
        .raise();
    };
  }
}
