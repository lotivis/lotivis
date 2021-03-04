import {combineByLocation} from "../data-juggle/dataset-combine";
import {Color} from "../shared/colors";
import {log_debug} from "../shared/debug";

export class MapTooltipRenderer {

  constructor(mapChart) {
    this.mapChart = mapChart;

    let color = Color.defaultTint.rgbString();
    let tooltip = mapChart
      .element
      .append('div')
      .attr('class', 'map-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('position', 'absolute')
      .style('color', 'black')
      .style('border', function () {
        return `solid 1px ${color}`;
      })
      .style('opacity', 0);

    let bounds = mapChart.svg
      .append('rect')
      .attr('class', 'bounds')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('fill-opacity', 0)
      .style('stroke', 'red')
      .style('stroke-width', '0.7px')
      .style('stroke-dasharray', '1,1');

    this.mouserEnter = function (event, feature) {
      if (!mapChart.datasetController) return;

      d3.select(this)
        .attr('stroke', () => color)
        .attr('stroke-width', '2')
        .attr('stroke-dasharray', '0');

      // set tooltip content
      let properties = feature.properties;
      if (!properties) return;

      let code = properties.code;
      let propertiesSelection = Object.keys(properties);
      let components = propertiesSelection.map(function (propertyName) {
        return `${propertyName}: ${properties[propertyName]}`;
      });

      let flatData = mapChart.datasetController.flatData;
      let combined = combineByLocation(flatData);
      let data = combined.filter(item => +item.location === +code);

      if (data) {
        components.push('');
        for (let index = 0; index < data.length; index++) {
          let item = data[index];
          let label = (item.label || item.dataset || item.stack);
          components.push(label + ': ' + item.value);
        }
      }

      tooltip.html(components.join('<br>'));

      // position tooltip
      let tooltipWidth = Number(tooltip.style('width').replace('px', '') || 200);
      let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
      tooltipWidth += 20;
      tooltipHeight += 20;

      let projection = mapChart.projection;
      let featureBounds = d3.geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
      let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];

      // svg is presented in dynamic sized view box so we need to get the actual size
      // of the element in order to calculate a scale for the position of the tooltip.
      let effectiveSize = mapChart.getElementEffectiveSize();
      let factor = effectiveSize[0] / mapChart.width;
      let heightFactor = effectiveSize[1] / mapChart.height;

      // calculate offset
      let positionOffset = mapChart.getElementPosition();

      // calculate scaled position
      let top = 0;

      if ((featureLowerLeft[1] * heightFactor) > (effectiveSize[1] / 2)) {
        top += featureUpperRight[1];
        top *= factor;
        top -= tooltipHeight;
        top -= 5;
      } else {
        top += featureLowerLeft[1];
        top *= factor; // Use width factor instead of heightFactor for propert using. Can't figure out why width factor works better.
        top += 5;
      }

      top += positionOffset[1];

      // calculate tooltip center
      let centerBottom = featureLowerLeft[0];
      centerBottom += (featureBoundsWidth / 2);
      centerBottom *= factor;
      centerBottom -= (Number(tooltipWidth) / 2);
      centerBottom += positionOffset[0];

      tooltip.style('opacity', 1)
        .style('left', centerBottom + 'px')
        .style('top', top + 'px');

      bounds
        .style('opacity', 1)
        .style('width', featureBoundsWidth + 'px')
        .style('height', featureBoundsHeight + 'px')
        .style('x', featureLowerLeft[0])
        .style('y', featureUpperRight[1]);

      mapChart.onSelectFeature(event, feature);
    };

    this.mouseOut = function (event, feature) {
      d3.select(this)
        .attr('stroke', 'black')
        .attr('stroke-width', '0.7')
        .attr('stroke-dasharray', function (feature) {
          return feature.departmentsData ? '0' : '1,4';
        });
      tooltip.style('opacity', 0);
      bounds.style('opacity', 0);
    };

    this.raise = function () {
      tooltip.raise();
      bounds.raise();
    };
  }
}
