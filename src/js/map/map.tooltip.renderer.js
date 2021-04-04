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
   * @param mapChart The parental map chart.
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
      return `lotivis-map-area-${mapChart.config.featureIDAccessor(feature)}`;
    }

    function htmlTitle(feature) {
      let featureID = mapChart.config.featureIDAccessor(feature);
      let featureName = mapChart.config.featureNameAccessor(feature);
      return `ID: ${featureID}<br>Name: ${featureName}`;
    }

    function htmlValues(feature) {
      let components = [];
      let featureID = mapChart.config.featureIDAccessor(feature);
      if (mapChart.datasetController) {
        let flatData = mapChart.datasetController.flatData;
        let combined = combineByLocation(flatData);
        let data = combined.filter(item => equals(item.location, featureID));
        components.push('');
        for (let index = 0; index < data.length; index++) {
          let item = data[index];
          let label = (item.label || item.dataset || item.stack);
          components.push(label + ': ' + formatNumber(item.value));
        }
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

    /**
     * Called by map geojson renderer when mouse enters an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseEnter = function (event, feature) {

      tooltip.html([htmlTitle(feature), htmlValues(feature)].join('<br>'));

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

      mapChart.onSelectFeature(event, feature);
    };

    /**
     * Called by map geojson renderer when mouse leaves an area drawn on the map.
     * @param event The mouse event.
     * @param feature The drawn feature (area).
     */
    this.mouseOut = function (event, feature) {
      let style = styleForCSSClass('.lotivis-map-area');
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
