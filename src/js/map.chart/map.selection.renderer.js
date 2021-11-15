import {lotivis_log, lotivis_log_once} from "../shared/debug";
import {joinFeatures} from "../geojson/join.features";

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

      if (!mapChart.geoJSON) {
        return;
      }

      let allFeatures = mapChart.presentedGeoJSON.features;

      if (!mapChart.datasetController) {
        return;
      }

      let filteredLocations = mapChart.datasetController.filters.locations;

      console.log('getSelectedFeatures allFeatures', allFeatures.length);
      console.log('getSelectedFeatures filteredLocations', filteredLocations);
      console.log('getSelectedFeatures datasetController.filters', mapChart.datasetController.filters);

      let selectedFeatures = [];

      for (let index = 0; index < allFeatures.length; index++) {
        let feature = allFeatures[index];
        let featureID = feature.lotivisId;

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

      // return;

      let selectedFeatures = getSelectedFeatures();


      let joinedFeatures = joinFeatures(selectedFeatures);
      if (!joinedFeatures) {
        return lotivis_log('[lotivis]  No selected features to render.');
      }

      let size = mapChart.svg
        .selectAll('.lotivis-map-chart-selection-rect')
        .size();

      console.log('size', size);

      mapChart.svg
        .selectAll('.lotivis-map-chart-selection-rect')
        .remove();

      mapChart.svg
        .selectAll('path')
        .append('path')
        .data(joinedFeatures.features)
        .enter()
        .append('path')
        .attr('d', mapChart.path)
        .attr('class', 'lotivis-map-chart-selection-rect')
        .raise();

    };
  }
}
