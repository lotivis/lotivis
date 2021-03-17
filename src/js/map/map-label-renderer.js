import {log_debug} from "../shared/debug";
import {formatNumber} from "../shared/format";

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
      if (!mapChart.geoJSON) return log_debug('no geoJSON');
      if (!mapChart.datasetController) return log_debug('no datasetController');

      removeLabels();
      if (!mapChart.isShowLabels) return;

      let geoJSON = mapChart.geoJSON;
      let combinedData = mapChart.combinedData;
      mapChart.svg
        .selectAll('text')
        .data(geoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'lotivis-map-label')
        .attr('fill', mapChart.tintColor)
        .text(function (feature) {
          let code = +feature.properties.code;
          let dataset = combinedData.find(dataset => +dataset.location === code);
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
