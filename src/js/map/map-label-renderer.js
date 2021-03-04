import {log_debug} from "../shared/debug";
import {formatNumber} from "../shared/format";
import {combineByLocation} from "../data-juggle/dataset-combine";

export class MapLabelRenderer {

  constructor(mapChart) {

    /**
     * Appends labels from datasets.
     */
    this.renderDatasetLabels = function () {
      if (!mapChart.geoJSON) return log_debug('no geoJSON');
      if (!mapChart.datasetController) return log_debug('no datasetController');

      let geoJSON = mapChart.geoJSON;
      let combinedData = mapChart.combinedData;

      mapChart.svg.selectAll('.map-label').remove();
      mapChart.svg
        .selectAll('text')
        .data(geoJSON.features)
        .enter()
        .append('text')
        .attr('class', 'map-label')
        .attr('text-anchor', 'middle')
        .attr('fill', mapChart.tintColor)
        .attr('font-size', 12)
        .attr('opacity', function () {
          return mapChart.isShowLabels ? 1 : 0;
        }.bind(this))
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
