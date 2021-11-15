import {formatNumber} from "../shared/format";
import {equals} from "../shared/equal";
import {lotivis_log} from "../shared/debug";

/**
 *
 * @class MapLabelRenderer
 */
export class MapLabelRenderer {

  /**
   * Creates a new instance of MapLabelRenderer.
   * @param mapChart The parental map.chart chart.
   */
  constructor(mapChart) {

    /**
     * Removes any old labels from the map.chart.
     */
    function removeLabels() {
      mapChart.svg.selectAll('.lotivis-map.chart-label').remove();
    }

    /**
     * Appends labels from datasets.
     */
    this.render = function () {
      removeLabels();

      let geoJSON = mapChart.geoJSON;
      if (!mapChart.geoJSON) return lotivis_log(`[lotivis]  No GeoJSON to render (${mapChart.selector}).`);
      let dataview = mapChart.dataview;

      if (!dataview) return lotivis_log(`[lotivis]  No dataview in map chart (${mapChart.selector}).`);
      if (!mapChart.config.showLabels) return lotivis_log(`[lotivis]  Skip rendering labels due to configuration (${mapChart.selector}).`);

      mapChart.svg
        .selectAll('text')
        .data(geoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'lotivis-location-chart-label')
        .text(function (feature) {
          let featureID = mapChart.config.featureIDAccessor(feature);
          let dataset = dataview.combinedData.find(dataset => equals(dataset.location, featureID));
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
