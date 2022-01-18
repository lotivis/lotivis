import { LOTIVIS_CONFIG } from "../common/config";
import { geoBounds } from "d3";
import { Renderer } from "../common/renderer";

export class MapTooltipRenderer extends Renderer {
  render(chart, controller, dataView) {
    chart.element.select(".ltv-tooltip").remove();
    let tooltip = chart.element
      .append("div")
      .attr("class", "ltv-tooltip")
      .style("opacity", 0);

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;

    function htmlTitle(features) {
      if (features.length > 3) {
        let featuresSlice = features.slice(0, 3);
        let ids = featuresSlice
          .map((feature) => `${feature.lotivisId}`)
          .join(", ");
        let names = featuresSlice
          .map(chart.config.featureNameAccessor)
          .join(", ");
        let moreCount = features.length - 3;
        return `IDs: ${ids} (+${moreCount})<br>Names: ${names} (+${moreCount})`;
      } else {
        let ids = features.map((feature) => `${feature.lotivisId}`).join(", ");
        let names = features.map(chart.config.featureNameAccessor).join(", ");
        return `IDs: ${ids}<br>Names: ${names}`;
      }
    }

    function htmlValues(features) {
      if (!chart.controller) return "";

      let combinedByLabel = {};
      for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let data = dataView.byLocationLabel.get(feature.lotivisId);
        if (!data) continue;
        let keys = Array.from(data.keys());

        for (let j = 0; j < keys.length; j++) {
          let label = keys[j];
          if (combinedByLabel[label]) {
            combinedByLabel[label] += data.get(label);
          } else {
            combinedByLabel[label] = data.get(label);
          }
        }
      }

      let components = [""];
      let sum = 0;
      for (const label in combinedByLabel) {
        let color = controller.colorGenerator.label(label);
        let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
        sum += combinedByLabel[label];
        let value = numberFormat(combinedByLabel[label]);
        components.push(`${divHTML} ${label}: <b>${value}</b>`);
      }

      components.push("");
      components.push(`Sum: <b>${numberFormat(sum)}</b>`);

      return components.length === 0 ? "No Data" : components.join("<br>");
    }

    function getTooltipSize() {
      let tooltipWidth = Number(
        tooltip.style("width").replace("px", "") || 200
      );
      let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
      return [tooltipWidth + 20, tooltipHeight + 20];
    }

    function positionTooltip(event, feature) {
      // position tooltip
      let tooltipSize = getTooltipSize();
      let projection = chart.projection;
      let featureBounds = geoBounds(feature);
      let featureLowerLeft = projection(featureBounds[0]);
      let featureUpperRight = projection(featureBounds[1]);
      let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];

      // svg is presented in dynamic sized view box so we need to get the actual size
      // of the element in order to calculate a scale for the position of the tooltip.
      let effectiveSize = chart.getElementEffectiveSize();
      let factor = effectiveSize[0] / chart.config.width;
      let positionOffset = chart.getElementPosition();

      function getTooltipLeft() {
        let left = featureLowerLeft[0];
        left += featureBoundsWidth / 2;
        left *= factor;
        left -= tooltipSize[0] / 2;
        left += positionOffset[0];
        return left;
      }

      function getTooltipLocationAbove() {
        let top = featureUpperRight[1] * factor;
        top -= tooltipSize[1];
        top += positionOffset[1];
        top -= LOTIVIS_CONFIG.tooltipOffset;
        return top;
      }

      function getTooltipLocationUnder() {
        let top = featureLowerLeft[1] * factor;
        top += positionOffset[1];
        top += LOTIVIS_CONFIG.tooltipOffset;
        return top;
      }

      let top = 0;
      if (featureLowerLeft[1] > chart.config.height / 2) {
        top = getTooltipLocationAbove();
      } else {
        top = getTooltipLocationUnder();
      }

      let left = getTooltipLeft();
      tooltip
        .style("left", left + "px")
        .style("top", top + "px")
        .style("opacity", 1)
        .raise();
    }

    function mouseEnter(event, feature) {
      if (!feature) return;
      if (
        chart.controller &&
        chart.controller.filters.locations.includes(feature.lotivisId)
      ) {
        tooltip.html(
          [
            htmlTitle(chart.selectedFeatures),
            htmlValues(chart.selectedFeatures),
          ].join("<br>")
        );
        positionTooltip(event, chart.selectionBorderGeoJSON.features[0]);
      } else {
        tooltip.html(
          [htmlTitle([feature]), htmlValues([feature])].join("<br>")
        );
        positionTooltip(event, feature);
      }
    }

    function mouseOut(event, feature) {
      tooltip.style("opacity", 0);
    }

    chart.on("mouseenter", mouseEnter);
    chart.on("mouseout", mouseOut);
    chart.on("click", mouseEnter);
  }
}
