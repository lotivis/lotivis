import * as d3 from "d3";
import { baseChart } from "./chart";
import { CONFIG } from "./common/config";
import { uniqueId } from "./common/identifiers";
import { tooltip } from "./tooltip";
import { createGeoJSON } from "./geojson/from.data";
import {
  joinFeatures,
  removeFeatures,
  filterFeatures,
} from "./geojson/features";
import { MapColors } from "./common/colors";
import { DataController } from "./controller";
import { DEFAULT_NUMBER_FORMAT } from "./common/formats";
import {
  FEATURE_ID_ACCESSOR,
  FEATURE_NAME_ACCESSOR,
} from "./geojson/feature.accessors";
import { ltv_debug } from "./common/debug";

/**
 * Reusable Map Chart API class that renders a
 * simple and configurable map chart.
 *
 * @requires d3
 *
 * @example
 * var chart = lotivis
 *    .map()
 *    .selector(".css-selector")
 *    .dataController(dc)
 *    .run();
 *
 */
export function map() {
  let state = {
    id: uniqueId("map"),

    width: 1000,
    height: 1000,

    // margin
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,

    // Whether the chart is enabled.
    enabled: true,

    // whether to draw labels
    labels: false,

    // whether to draw a legend on the map
    legend: true,

    // whether to display a tooltip.
    tooltip: true,

    exclude: null,

    include: null,

    // the geojson wich is drawn
    geoJSON: null,

    // The data controller.
    dataController: null,

    // the number format
    numberFormat: DEFAULT_NUMBER_FORMAT,

    featureIDAccessor: FEATURE_ID_ACCESSOR,

    featureNameAccessor: FEATURE_NAME_ACCESSOR,
  };

  // Create new underlying chart with the specified state.
  let chart = baseChart(state);
  state.projection = d3.geoMercator();
  state.path = d3.geoPath().projection(state.projection);

  function colors() {
    return state.dataController.dataColors();
  }

  /**
   * Tells the map chart that the GeoJSON has changed.
   * @private
   */
  function geoJSONDidChange() {
    let geoJSON = state.geoJSON;
    if (!geoJSON) return;

    state.workGeoJSON = geoJSON;

    // precalculate the center of each feature
    state.workGeoJSON.features.forEach((f) => (f.center = d3.geoCentroid(f)));

    if (Array.isArray(state.exclude)) {
      state.workGeoJSON = removeFeatures(state.workGeoJSON, state.exclude);
    }

    if (Array.isArray(state.include)) {
      state.workGeoJSON = filterFeatures(state.workGeoJSON, state.include);
    }

    // precalculate lotivis feature ids
    let feature, id;
    for (let i = 0; i < state.workGeoJSON.features.length; i++) {
      feature = state.workGeoJSON.features[i];
      id = state.featureIDAccessor(feature);
      state.workGeoJSON.features[i].lotivisId = id;
    }

    chart.zoomTo(state.workGeoJSON);

    if (chart.dataController() === null) {
      chart.dataController(new DataController([]));
    }
  }

  /**
   * Returns the collection of selected features.
   * @returns {Array<feature>} The collection of selected features
   * @private
   */
  function getSelectedFeatures() {
    if (!state.workGeoJSON) return null;

    let filtered = state.dataController.filters("locations");
    if (filtered.length === 0) return [];

    let selectedFeatures = state.workGeoJSON.features.filter(
      (f) => filtered.indexOf(f.lotivisId) !== -1
    );

    return selectedFeatures;
  }

  function htmlTitle(features) {
    if (features.length > 3) {
      let featuresSlice = features.slice(0, 3);
      let ids = featuresSlice
        .map((feature) => `${feature.lotivisId}`)
        .join(", ");
      let names = featuresSlice.map(state.featureNameAccessor).join(", ");
      let moreCount = features.length - 3;
      return `IDs: ${ids} (+${moreCount})<br>Names: ${names} (+${moreCount})`;
    } else {
      let ids = features.map((feature) => `${feature.lotivisId}`).join(", ");
      let names = features.map(state.featureNameAccessor).join(", ");
      return `IDs: ${ids}<br>Names: ${names}`;
    }
  }

  function htmlValues(features, dv) {
    if (!chart.controller) return "";

    let combinedByLabel = {};
    for (let i = 0; i < features.length; i++) {
      let feature = features[i];
      let data = dv.byLocationLabel.get(feature.lotivisId);
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
      let color = colors.label(label);
      let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
      sum += combinedByLabel[label];
      let value = numberFormat(combinedByLabel[label]);
      components.push(`${divHTML} ${label}: <b>${value}</b>`);
    }

    components.push("");
    components.push(`Sum: <b>${numberFormat(sum)}</b>`);

    return components.length === 0 ? "No Data" : components.join("<br>");
  }

  function positionTooltip(event, feature, calc) {
    // position tooltip
    let size = calc.tooltip.size();
    let tOff = CONFIG.tooltipOffset;
    let projection = state.projection;

    let fBounds = d3.geoBounds(feature);
    let fLowerLeft = projection(fBounds[0]);
    let fUpperRight = projection(fBounds[1]);
    let fWidth = fUpperRight[0] - fLowerLeft[0];

    // svg is presented in dynamic sized view box so we need to get the actual size
    // of the element in order to calculate a scale for the position of the tooltip.
    let domRect = calc.svg.node().getBoundingClientRect();
    let factor = domRect.width / state.width;
    let offset = [domRect.x + window.scrollX, domRect.y + window.scrollY];

    function getTooltipLeft() {
      return (fLowerLeft[0] + fWidth / 2) * factor - size[0] / 2 + offset[0];
    }

    function tooltipTop() {
      return fLowerLeft[1] > state.height / 2
        ? fUpperRight[1] * factor - size[1] + offset[1] - tOff
        : fLowerLeft[1] * factor + offset[1] + tOff;
    }

    calc.tooltip.left(getTooltipLeft()).top(tooltipTop()).show();
  }

  /**
   *
   * @param {*} container
   * @param {*} calc
   */
  function renderSVG(container, calc) {
    calc.svg = container
      .append("svg")
      .attr("class", "ltv-chart-svg ltv-map-svg")
      .attr("viewBox", `0 0 ${state.width} ${state.height}`);
  }

  function renderBackground(calc, dv) {
    calc.svg
      .append("rect")
      .attr("class", "ltv-map-background")
      .attr("width", state.width)
      .attr("height", state.height)
      .on("click", () => state.dataController.clear("locations", chart));
  }

  function renderExteriorBorders(calc, dv) {
    let geoJSON = state.workGeoJSON;
    if (!geoJSON) return console.log("[ltv]  No GeoJSON to render");

    let bordersGeoJSON = joinFeatures(geoJSON.features);
    if (!bordersGeoJSON) return console.log("[ltv]  No borders to render.");

    calc.borders = calc.svg
      .selectAll(".ltv-map-exterior-borders")
      .append("path")
      .data(bordersGeoJSON.features)
      .enter()
      .append("path")
      .attr("d", state.path)
      .attr("class", "ltv-map-exterior-borders");
  }

  function filterLocation(location) {
    return state.dataController.isFilter("locations", location);
  }

  function renderFeatures(calc, dv) {
    function opacity(location) {
      return filterLocation(location) ? CONFIG.selectionOpacity : 1;
    }

    function featureMapID(f) {
      return `ltv-map-area-id-${f.lotivisId}`;
    }

    function resetHover() {
      calc.svg
        .selectAll(".ltv-map-area")
        .classed("ltv-map-area-hover", false)
        .attr("opacity", (f) => opacity(f.lotivisId));
    }

    function mouseEnter(event, feature) {
      calc.svg
        .selectAll(`#${featureMapID(feature)}`)
        .raise()
        .classed("ltv-map-area-hover", true);

      calc.svg.selectAll(".ltv-map-label").raise();

      calc.tooltip.show();

      if (filterLocation(feature.lotivisId)) {
        calc.tooltip.html(
          [
            htmlTitle(calc.selectedFeatures),
            htmlValues(calc.selectedFeatures),
          ].join("<br>")
        );
        positionTooltip(event, calc.selectionBorderGeoJSON.features[0], calc);
      } else {
        calc.tooltip.html(
          [htmlTitle([feature]), htmlValues([feature])].join("<br>")
        );
        positionTooltip(event, feature, calc);
      }
    }

    function mouseOut(event, feature) {
      resetHover();
      calc.tooltip.hide();
      // chart.emit("mouseout", event, feature);
      // dragged
      if (event.buttons === 1) mouseClick(event, feature);
    }

    function mouseClick(event, feature) {
      if (!state.enabled) return;
      if (!feature || !feature.properties) return;
      state.dataController.toggleFilter("locations", feature.lotivisId, chart);
      // chart.emit("click", event, feature);
    }

    let locationToSum = dv.locationToSum;
    let max = d3.max(locationToSum, (item) => item[1]);
    let generator = MapColors(1);

    calc.areas = calc.svg
      .selectAll(".ltv-map-area")
      .append("path")
      .data(state.workGeoJSON.features)
      .enter()
      .append("path")
      .attr("d", state.path)
      .classed("ltv-map-area", true)
      .attr("id", (f) => featureMapID(f))
      .style("stroke-dasharray", "1,4")
      .style("fill", (f) => {
        let value = locationToSum.get(f.lotivisId);
        let opacity = Number(value / max);
        return opacity === 0 ? "WhiteSmoke" : generator(opacity);
      })
      .style("fill-opacity", 1)
      .on("click", mouseClick)
      .on("mouseenter", mouseEnter)
      .on("mouseout", mouseOut)
      .raise();
  }

  function renderLabels(calc, dv) {
    // calc.svg.selectAll(".ltv-map-label").remove();
    calc.svg
      .selectAll("text")
      .data(state.workGeoJSON.features)
      .enter()
      .append("text")
      .attr("class", "ltv-map-label")
      .text((f) => {
        let featureID = state.featureIDAccessor(f);
        let data = dv.byLocationLabel.get(featureID);
        if (!data) return "";
        let labels = Array.from(data.keys());
        let values = labels.map((label) => data.get(label));
        let sum = d3.sum(values);
        return sum === 0 ? "" : state.numberFormat(sum);
      })
      .attr("x", (f) => state.projection(f.center)[0])
      .attr("y", (f) => state.projection(f.center)[1]);
  }

  function renderSelection(calc, dv) {
    calc.selectedFeatures = getSelectedFeatures();
    calc.selectionBorderGeoJSON = joinFeatures(calc.selectedFeatures);
    if (!calc.selectionBorderGeoJSON)
      return ltv_debug("no features selected", chart.id());

    calc.svg.selectAll(".ltv-map-selection-border").remove();
    calc.svg
      .selectAll(".ltv-map-selection-border")
      .append("path")
      .attr("class", "ltv-map-selection-border")
      .data(calc.selectionBorderGeoJSON.features)
      .enter()
      .append("path")
      .attr("d", state.path)
      .attr("class", "ltv-map-selection-border")
      .raise();
  }

  function renderLegend(calc, dv) {
    let numberFormat = chart.config.numberFormat || CONFIG.numberFormat;
    let stackNames = chart.dataView.stacks;
    let label = chart.config.label || stackNames[0];
    let locationToSum = dataView.locationToSum || [];
    let max = d3max(locationToSum, (item) => item[1]) || 0;

    let offset = 0 * 80;
    let labelColor = chart.controller.stackColor(label);

    let steps = 4;
    let data = [0, (1 / 4) * max, (1 / 2) * max, (3 / 4) * max, max];
    let generator = MapColors(max);

    let legend = chart.svg
      .append("svg")
      .attr("class", "ltv-map-legend")
      .attr("width", chart.config.width)
      .attr("height", 200)
      .attr("x", 0)
      .attr("y", 0);

    // chart.on("mouseenter", () => legend.raise());
    // chart.on("mouseout", () => legend.raise());

    legend
      .append("text")
      .attr("class", "ltv-map-legend-title")
      .attr("x", offset + 10)
      .attr("y", "20")
      .style("fill", labelColor)
      .text(label);

    legend
      .append("g")
      .selectAll("text")
      .data(["No Data"])
      .enter()
      .append("text")
      .attr("class", "ltv-map-legend-text")
      .attr("x", offset + 35)
      .attr("y", 44)
      .text((d) => d);

    legend
      .append("g")
      .selectAll("rect")
      .data([0])
      .enter()
      .append("rect")
      .attr("class", "ltv-map-legend-rect")
      .style("fill", "white")
      .attr("x", offset + 10)
      .attr("y", 30)
      .attr("width", 18)
      .attr("height", 18)
      .style("stroke-dasharray", "1,3")
      .style("stroke", "black")
      .style("stroke-width", 1);

    legend
      .append("g")
      .selectAll("text")
      .data([0])
      .enter()
      .append("text")
      .attr("class", "lotivis-location-chart-legend-text")
      .attr("x", offset + 35)
      .attr("y", 64)
      .text((d) => d);

    legend
      .append("g")
      .selectAll("rect")
      .data([0])
      .enter()
      .append("rect")
      .attr("class", "ltv-map-legend-rect")
      .style("fill", "WhiteSmoke")
      .attr("x", offset + 10)
      .attr("y", 50)
      .attr("width", 18)
      .attr("height", 18)
      .style("stroke", "black")
      .style("stroke-width", 1);

    legend
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "ltv-map-legend-rect")
      .style("fill", generator)
      .attr("x", offset + 10)
      .attr("y", (d, i) => i * 20 + 70)
      .attr("width", 18)
      .attr("height", 18)
      .style("stroke", "black")
      .style("stroke-width", 1);

    legend
      .append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "ltv-map-legend-text")
      .attr("x", offset + 35)
      .attr("y", (d, i) => i * 20 + 84)
      .text(function (d, i) {
        if (d === 0) {
          return "> 0";
        } else {
          return numberFormat((i / steps) * max);
        }
      });
  }

  // public

  chart.zoomTo = function (geoJSON) {
    if (state.projection)
      state.projection.fitSize([state.width - 20, state.height - 20], geoJSON);
  };

  chart.geoJSON = function (_) {
    return arguments.length
      ? (((state.geoJSON = _), geoJSONDidChange()), this)
      : state.geoJSON;
  };

  /**
   * Calculates the data view for the bar chart.
   *
   * @param {*} calc
   * @returns
   */
  chart.dataView = function (dc) {
    var dv = {};

    dv.snapshot = dc.snapshot();
    dv.data = dc.snapshot();
    dv.labels = dc.data().labels;
    dv.stacks = dc.data().stacks;
    dv.locations = dc.data().locations;

    dv.byLocationLabel = d3.rollup(
      dv.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.location,
      (d) => d.label
    );

    dv.byLocationStack = d3.rollup(
      dv.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.location,
      (d) => d.stack
    );

    dv.locationToSum = d3.rollup(
      dv.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.location
    );

    dv.maxLocation = d3.max(dv.locationToSum, (item) => item[1]);
    dv.maxLabel = d3.max(dv.byLocationLabel, (i) => d3.max(i[1], (d) => d[1]));
    dv.maxStack = d3.max(dv.byLocationStack, (i) => d3.max(i[1], (d) => d[1]));

    return dv;
  };

  /**
   *
   * @param {*} container
   * @param {*} state
   * @param {*} calc
   * @param {*} dv
   */
  chart.render = function (container, calc, dv) {
    calc.graphWidth = state.width - state.marginLeft - state.marginRight;
    calc.graphHeight = state.height - state.marginTop - state.marginBottom;
    calc.graphBottom = state.height - state.marginBottom;
    calc.graphRight = state.width - state.marginRight;

    if (!state.geoJSON) {
      chart.geoJSON(createGeoJSON(dv.locations));
    }

    renderSVG(container, calc);
    renderBackground(calc, dv);
    renderExteriorBorders(calc, dv);
    renderFeatures(calc, dv);
    renderSelection(calc, dv);
    renderLabels(calc, dv);

    if (state.labels) {
      renderLabels(calc, dv);
    }

    if (state.tooltip) {
      calc.tooltip = tooltip().container(container).run();
    }
  };

  // return generated chart
  return chart;
}
