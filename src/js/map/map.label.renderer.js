import {debug_log, verbose_log} from "../shared/debug";
import {formatNumber} from "../shared/format";
import {equals} from "../shared/equal";

/**
 *
 * @class MapLabelRenderer
 */
export class MapLabelRenderer {

  /**
   * Creates a new instance of MapLabelRenderer.
   * @param mapChart The parental map chart.
   */
  constructor(mapChart) {

    /**
     * Removes any old labels from the map.
     */
    function removeLabels() {
      mapChart
        .svg
        .selectAll('.lotivis-map-label')
        .remove();
    }

    /**
     * Appends labels from datasets.
     */
    this.render = function () {
      let geoJSON = mapChart.geoJSON;
      if (!mapChart.geoJSON) return debug_log('No Geo JSON to render.');
      let combinedData = mapChart.combinedData;
      if (!mapChart.datasetController) return debug_log('no datasetController');

      removeLabels();
      if (!mapChart.config.isShowLabels) return;

      mapChart.svg
        .selectAll('text')
        .data(geoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'lotivis-map-label')
        .text(function (feature) {
          let featureID = mapChart.config.featureIDAccessor(feature);
          let dataset = combinedData.find(dataset => equals(dataset.location, featureID));
          return dataset ? formatNumber(dataset.value) : '';
        })
        .attr('x', function (feature) {
          return mapChart.projection(feature.center)[0];
        }.bind(this))
        .attr('y', function (feature) {
          return mapChart.projection(feature.center)[1];
        }.bind(this));

    };
  }
}
