import {combineByLocation} from "../data.juggle/data.combine";
import {styleForCSSClass} from "../shared/style";
import {formatNumber} from "../shared/format";
import {equals} from "../shared/equal";
import {LotivisConfig} from "../shared/config";

/**
 *
 * @class MapTooltipRenderer
 */
export class MapTooltipRenderer {

  /**
   * Creates a new instance of MapTooltipRenderer.
   * @param mapChart The parental map.chart chart.
   */
  constructor(mapChart) {
    this.mapChart = mapChart;

    let tooltip = mapChart
      .element
      .append('div')
      .attr('class', 'lotivis-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('opacity', 0);

    function featureMapID(feature) {
      return `lotivis-map-area-${feature.lotivisId}`;
    }

    function htmlTitle(features) {

      if (features.length > 3) {
        let featuresSlice = features.slice(0, 3);
        let ids = featuresSlice.map(feature => `${feature.lotivisId}`).join(', ');
        let names = featuresSlice.map(mapChart.config.featureNameAccessor).join(', ');
        let moreCount = features.length - 3;
        return `IDs: ${ids} (+${moreCount})<br>Names: ${names} (+${moreCount})`;
      } else {
        let ids = features.map(feature => `${feature.lotivisId}`).join(', ');
        let names = features.map(mapChart.config.featureNameAccessor).join(', ');
        return `IDs: ${ids}<br>Names: ${names}`;
      }
    }

    function htmlValues(features) {
      if (!mapChart.datasetController) {
        return '';
      }

      let flatData = mapChart.datasetController.flatData;
      let combined = combineByLocation(flatData);
      let combinedByLabel = {};

      for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let data = combined.filter(item => equals(item.location, feature.lotivisId));

        for (let index = 0; index < data.length; index++) {
          let item = data[index];
          let label = (item.label || item.dataset || item.stack);

          if (combinedByLabel[label]) {
            combinedByLabel[label] += item.value;
          } else {
            combinedByLabel[label] = item.value;
          }
        }
      }

      let components = [''];
      for (const label in combinedByLabel) {
        components.push(label + ': ' + formatNumber(combinedByLabel[label]));
      }

      return components.join('<br>');
    }

    /**
     * Returns the size of the tooltip.
     * @returns {number[]}
     */
    function getTooltipSize() {
      let tooltipWidth = Number(tooltip.style('width').replace('px', '') || 200);
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      return [tooltipWidth + 20, tooltipHeight + 20];
    }

    function positionTooltip(event, feature) {

      // position tooltip
      let tooltipSize = getTooltipSize();
      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];

      // svg is presented in dynamic sized view box so we need to get the actual size
      // of the element in order to calculate a scale for the position of the tooltip.
      let effectiveSize = mapChart.getElementEffectiveSize();
      let factor = effectiveSize[0] / mapChart.config.width;
      let positionOffset = mapChart.getElementPosition();

      /**
       * Calculates and returns the left position for the tooltip.
       * @returns {*} The left position in pixels.
       */
      function getTooltipLeft() {
        let left = featureLowerLeft[0];
        left += (featureBoundsWidth / 2);
        left *= factor;
        left -= (tooltipSize[0] / 2);
        left += positionOffset[0];
        return left;
      }

      /**
       * Calculates and returns the top tooltip position when displaying above a feature.
       * @returns {*} The top position in pixels.
       */
      function getTooltipLocationAbove() {
        let top = featureUpperRight[1] * factor;
        top -= tooltipSize[1];
        top += positionOffset[1];
        top -= LotivisConfig.tooltipOffset;
        return top;
      }

      /**
       * Calculates and returns the top tooltip position when displaying under a feature.
       * @returns {*} The top position in pixels.
       */
      function getTooltipLocationUnder() {
        let top = featureLowerLeft[1] * factor;
        top += positionOffset[1];
        top += LotivisConfig.tooltipOffset;
        return top;
      }

      let top = 0;
      if (featureLowerLeft[1] > (mapChart.config.height / 2)) {
        top = getTooltipLocationAbove();
      } else {
        top = getTooltipLocationUnder();
      }

      let left = getTooltipLeft();
      tooltip
        .style('opacity', 1)
        .style('left', left + 'px')
        .style('top', top + 'px');

    }

    /**
     * Called by map.chart geojson renderer when mouse enters an area drawn on the map.chart.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseEnter = function (event, feature) {
      if (mapChart.datasetController
        && mapChart.datasetController.filters.locations.includes(feature.lotivisId)) {
        tooltip.html(
          [
            htmlTitle(mapChart.selectedFeatures),
            htmlValues(mapChart.selectedFeatures)
          ].join('<br>')
        );
        positionTooltip(event, mapChart.selectionBorderGeoJSON.features[0]);
      } else {
        tooltip.html(
          [
            htmlTitle([feature]),
            htmlValues([feature])
          ].join('<br>')
        );
        positionTooltip(event, feature);
      }
    };

    /**
     * Called by map.chart geojson renderer when mouse leaves an area drawn on the map.chart.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseOut = function (event, feature) {
      let style = styleForCSSClass('.lotivis-map.chart-area');
      let mapID = featureMapID(feature);
      mapChart.svg.select(`#${mapID}`)
        .style('stroke', style.stroke || 'black')
        .style('stroke-width', style['stroke-width'] || '0.7')
        .style('stroke-dasharray', (feature) => feature.departmentsData ? '0' : '1,4');
      tooltip.style('opacity', 0);
    };

    /**
     * Raises the tooltip and the rectangle which draws the bounds.
     */
    this.raise = function () {
      tooltip.raise();
    };
  }
}
