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

        // a collection of ids NOT to show a label for
        labelsExclude: null,

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
        state.workGeoJSON.features.forEach(
            (f) => (f.center = d3.geoCentroid(f))
        );

        if (Array.isArray(state.exclude)) {
            state.workGeoJSON = removeFeatures(
                state.workGeoJSON,
                state.exclude
            );
        }

        if (Array.isArray(state.include)) {
            state.workGeoJSON = filterFeatures(
                state.workGeoJSON,
                state.include
            );
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

        return state.workGeoJSON.features.filter(
            (f) => filtered.indexOf(f.lotivisId) !== -1
        );
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
            let ids = features
                .map((feature) => `${feature.lotivisId}`)
                .join(", ");
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
        let size = calc.tooltip.size(),
            tOff = CONFIG.tooltipOffset,
            projection = state.projection,
            fBounds = d3.geoBounds(feature),
            fLowerLeft = projection(fBounds[0]),
            fUpperRight = projection(fBounds[1]),
            fWidth = fUpperRight[0] - fLowerLeft[0];

        // svg is presented in dynamic sized view box so we need to get the actual size
        // of the element in order to calculate a scale for the position of the tooltip.
        let domRect = calc.svg.node().getBoundingClientRect(),
            factor = domRect.width / state.width,
            off = [domRect.x + window.scrollX, domRect.y + window.scrollY];

        let top = fLowerLeft[1] * factor + off[1] + tOff,
            left = (fLowerLeft[0] + fWidth / 2) * factor - size[0] / 2 + off[0];

        calc.tooltip.left(left).top(top).show();
    }

    function contains(arr, obj) {
        return Array.isArray(arr) && arr.indexOf(obj) !== -1;
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
                .classed("ltv-map-area-hover", true);

            if (filterLocation(feature.lotivisId)) {
                calc.tooltip.html(
                    [
                        htmlTitle(calc.selectedFeatures),
                        htmlValues(calc.selectedFeatures),
                    ].join("<br>")
                );
                positionTooltip(
                    event,
                    calc.selectionBorderGeoJSON.features[0],
                    calc
                );
            } else {
                calc.tooltip.html(
                    [htmlTitle([feature]), htmlValues([feature])].join("<br>")
                );
                positionTooltip(event, feature, calc);
            }

            calc.tooltip.show();
        }

        function mouseOut(event, feature) {
            resetHover();
            calc.tooltip.hide();
            // dragged
            if (event.buttons === 1) mouseClick(event, feature);
        }

        function mouseClick(event, feature) {
            if (!state.enabled) return;
            if (!feature || !feature.properties) return;
            state.dataController.toggleFilter(
                "locations",
                feature.lotivisId,
                chart
            );
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
            .attr("x", (f) => state.projection(f.center)[0])
            .attr("y", (f) => state.projection(f.center)[1])
            .text((f) => {
                let featureID = state.featureIDAccessor(f);
                if (contains(state.labelsExclude, featureID)) return "";
                let data = dv.byLocationLabel.get(featureID);
                if (!data) return "";
                let labels = Array.from(data.keys()),
                    values = labels.map((label) => data.get(label)),
                    sum = d3.sum(values);
                return sum === 0 ? "" : state.numberFormat(sum);
            });
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
        let label = state.label || dv.stacks[0];
        let locationToSum = dv.locationToSum || [];
        let max = d3.max(locationToSum, (item) => item[1]) || 0;

        let xOff = 10 + state.marginLeft;
        let labelColor = state.dataController.stackColor(label);

        let mapColors = MapColors(max);
        let allData = [
            "No Data",
            "0",
            "> 0",
            (1 / 4) * max,
            (1 / 2) * max,
            (3 / 4) * max,
            max,
        ];

        let legend = calc.svg
            .append("svg")
            .attr("class", "ltv-map-legend")
            .attr("width", state.width)
            .attr("height", 200)
            .attr("x", 0)
            .attr("y", 0);

        // data label title
        legend
            .append("text")
            .attr("class", "ltv-map-legend-title")
            .attr("x", xOff)
            .attr("y", "20")
            .style("fill", labelColor)
            .text(label);

        // rects
        legend
            .append("g")
            .selectAll("rect")
            .data(allData)
            .enter()
            .append("rect")
            .attr("class", "ltv-map-legend-rect")
            .style("fill", (d, i) => {
                return i === 0
                    ? "white"
                    : i === 1
                    ? "whitesmoke"
                    : mapColors(i === 2 ? 0 : d);
            })
            .attr("x", xOff)
            .attr("y", (d, i) => i * 20 + 30)
            .attr("width", 18)
            .attr("height", 18)
            .style("stroke-dasharray", (d, i) => (i === 0 ? "1,3" : null));

        legend
            .append("g")
            .selectAll("text")
            .data(allData)
            .enter()
            .append("text")
            .attr("class", "ltv-map-legend-text")
            .attr("x", xOff + 24)
            .attr("y", (d, i) => i * 20 + 30 + 14)
            .text((d) => (typeof d === "number" ? state.numberFormat(d) : d));

        return;
    }

    // public

    chart.zoomTo = function (geoJSON) {
        if (state.projection)
            state.projection.fitSize(
                [state.width - 20, state.height - 20],
                geoJSON
            );
    };

    /**
     * Gets or sets the presented GeoJSON.
     * @param {GeoJSON} _
     * @returns
     */
    chart.geoJSON = function (_) {
        return arguments.length
            ? (((state.geoJSON = _), geoJSONDidChange()), this)
            : state.geoJSON;
    };

    /**
     * Calculates the data view for the bar chart.
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
        dv.maxLabel = d3.max(dv.byLocationLabel, (i) =>
            d3.max(i[1], (d) => d[1])
        );
        dv.maxStack = d3.max(dv.byLocationStack, (i) =>
            d3.max(i[1], (d) => d[1])
        );

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

        if (state.labels) {
            renderLabels(calc, dv);
        }

        if (state.tooltip) {
            calc.tooltip = tooltip().container(container).run();
        }

        if (state.legend) {
            renderLegend(calc, dv);
        }
    };

    // return generated chart
    return chart;
}
