import * as d3 from "d3";
import { ltv_chart } from "./common/lotivis.chart";
import { DEFAULT_NUMBER_FORMAT, LOTIVIS_CONFIG } from "./common/config";
import { uniqueId } from "./common/create.id";
import "./common/d3selection.js";
import { safeId } from "./common/safe.id";
import { tooltip } from "./tooltip";
import { hash_str } from "./common/hash";

function transX(x) {
  return "translate(" + x + ",0)";
}

function transY(y) {
  return "translate(0," + y + ")";
}

export function PlotColors(till) {
  return d3
    .scaleLinear()
    .domain([0, (1 / 3) * till, (2 / 3) * till, till])
    .range(["yellow", "orange", "red", "purple"]);
}

export const DATE_ACCESS = function (d) {
  return d;
};

export const PLOT_SORT = {
  /**
   * Sorts datasets alphabetically.
   */
  alphabetically: (left, right) => left.label > right.label,

  /**
   * Sorts datasets by duration.
   */
  duration: (left, right) => left.duration - right.duration,

  /**
   * Sorts datasets by intensity.
   */
  intensity: (left, right) => left.sum - right.sum,

  /**
   * Sorts datasets by first date.
   */
  firstDate: (left, right) => left.firstDate - right.firstDate,
};

/**
 * Reusable Plot Chart API class that renders a
 * simple and configurable plot chart.
 *
 * @requires d3
 *
 * @example
 * var chart = lotivis
 *    .plot()
 *    .selector(".css-selector")
 *    .dataController(dc)
 *    .run();
 *
 */
export function plot() {
  // Private
  let svg;
  let dc;
  let dv;
  let calc = {};
  let state = {
    ltvId: uniqueId("bar"),

    // width of the svg
    width: 1000,

    // height of a bar
    barHeight: 30,

    // margin
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,

    // bar radius
    radius: 5,

    // the plot's style, "gradient" or "fraction"
    style: "gradient",

    // the plot's color mode, "single" or "multi"
    colorMode: "single",

    // Whether the chart is selectable.
    selectable: true,

    // transformes a given date into a numeric value.
    dateAccess: DATE_ACCESS,

    // format for displayed numbers
    numberFormat: DEFAULT_NUMBER_FORMAT,

    // the data controller.
    dataController: null,

    // the data view.
    dataView: null,
  };

  // Create new underlying chart with the specified state.
  let chart = ltv_chart(state);

  /**
   *
   * @param {*} dv
   * @private
   */
  function sortDatasets(dv) {
    let datasets = dv.datasets;
    let sortedDatasets = [];
    switch (state.sort) {
      case PLOT_CHART_SORT.alphabetically:
        sortedDatasets = datasets.sort((set1, set2) => set1.label > set2.label);
        break;
      case PLOT_CHART_SORT.duration:
        sortedDatasets = datasets.sort(
          (set1, set2) => set1.duration < set2.duration
        );
        break;
      case PLOT_CHART_SORT.intensity:
        sortedDatasets = datasets.sort((set1, set2) => set1.sum < set2.sum);
        break;
      case PLOT_CHART_SORT.firstDate:
        sortedDatasets = datasets.sort(
          (set1, set2) => set1.firstDate > set2.firstDate
        );
        break;
      default:
        sortedDatasets = datasets;
        break;
    }

    this.dv.labels = sortedDatasets
      .map((dataset) => String(dataset.label))
      .reverse();
    this.dv.datasetsSorted = this.dv.labels;
  }

  /**
   * Creates the scales used by the plot chart.
   *
   * @param {calc} calc The calc object
   * @param {dataView} dv The data view
   * @private
   */
  function createScales(calc, dv) {
    calc.xChart = d3
      .scaleBand()
      .domain(dv.dates)
      .rangeRound([state.marginLeft, calc.graphRight])
      .paddingInner(0.1);

    calc.yChartPadding = d3
      .scaleBand()
      .domain(dv.labels)
      .rangeRound([calc.graphBottom, state.marginTop])
      .paddingInner(0.1);

    calc.yChart = d3
      .scaleBand()
      .domain(dv.labels)
      .rangeRound([calc.graphBottom, state.marginTop]);

    calc.xAxisGrid = d3
      .axisBottom(calc.xChart)
      .tickSize(-calc.graphHeight)
      .tickFormat("");

    calc.yAxisGrid = d3
      .axisLeft(calc.yChart)
      .tickSize(-calc.graphWidth)
      .tickFormat("");
  }

  /**
   *
   * @param {*} calc
   * @private
   */
  function renderSVG(calc) {
    calc.svg = calc.container
      .append("svg")
      .attr("class", "ltv-chart-svg ltv-bar-chart-svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${state.width} ${calc.height}`);
  }

  /**
   *
   * @param {*} calc
   * @private
   */
  function renderAxis(calc) {
    // top
    calc.svg
      .append("g")
      .call(d3.axisTop(calc.xChart))
      .attr("transform", transY(state.marginTop));

    // left
    calc.svg
      .append("g")
      .call(d3.axisLeft(calc.yChart))
      .attr("transform", transX(state.marginLeft));

    // bottom
    calc.svg
      .append("g")
      .call(d3.axisBottom(calc.xChart))
      .attr("transform", transY(calc.height - state.marginBottom));
  }

  /**
   * Renders the grid of the plot chart.
   *
   * @param {*} calc The calculations
   * @param {*} dv The data view
   * @private
   */
  function renderGrid(calc, dv) {
    calc.svg
      .append("g")
      .classed("ltv-plot-grid ltv-plot-grid-x", true)
      .attr("transform", transY(calc.height - state.marginBottom))
      .call(calc.xAxisGrid);

    calc.svg
      .append("g")
      .classed("ltv-plot-grid ltv-plot-grid-y", true)
      .attr("transform", transX(state.marginLeft))
      .call(calc.yAxisGrid);
  }

  /**
   * Renders the selction bars of the plot chart.
   *
   * @param {*} calc The calculations
   * @param {*} dv The data view
   * @private
   */
  function renderSelection(calc, dv) {
    calc.svg
      .append("g")
      .selectAll("g")
      .data(dv.datasets)
      .enter()
      .append("rect")
      .attr("class", "ltv-plot-chart-selection-rect")
      .attr(`opacity`, 0)
      .attr("x", state.marginLeft)
      .attr("y", (d) => calc.yChart(d.label))
      .attr("width", calc.graphWidth)
      .attr("height", calc.yChart.bandwidth())
      .on("mouseenter", (e, d) => showTooltip(calc, d))
      .on("mouseout", (e, d) => calc.tooltip.hide())
      .on("click", (e, d) => {
        state.dataController.toggleLabel(d.label, chart);
        calc.svg
          .selectAll(".ltv-plot-chart-selection-rect")
          .classed("ltv-selected", (d) =>
            state.dataController.isFilterLabel(d.label)
          );
      });
  }

  function renderBarsFraction(calc, dv, dc) {
    let colors = PlotColors(dv.max);
    let brush = dv.max / 2;
    let colorGenerator = state.dataController.colorGenerator();
    let isSingle = state.colorMode === "single";

    calc.barsData = calc.svg
      .append("g")
      .selectAll("g")
      .data(dv.byLabelDate)
      .enter();

    calc.bars = calc.barsData
      .append("g")
      .attr("transform", (d) => transY(calc.yChartPadding(d[0])))
      .attr("id", (d) => "ltv-plot-rect-" + hash_str(d[0]))
      .attr(`fill`, (d) => (isSingle ? colorGenerator.label(d[0]) : null))
      .selectAll(".rect")
      .data((d) => d[1]) // map to dates data
      .enter()
      .filter((d) => d[1] > 0)
      .append("rect")
      .attr("class", "ltv-plot-bar")
      .attr("x", (d) => calc.xChart(d[0]))
      .attr("y", 0)
      .attr("width", calc.xChart.bandwidth())
      .attr("height", calc.yChartPadding.bandwidth())
      .attr(`fill`, (d) => (isSingle ? null : colors(d[1])))
      .attr("opacity", (d) =>
        isSingle ? (d[1] + brush) / (dv.max + brush) : 1
      )
      .attr("rx", state.radius)
      .attr("ry", state.radius);

    // Labels
    let yBandwidth = calc.yChart.bandwidth() / 2;

    calc.labels = calc.barsData
      .append("g")
      .attr("transform", (d) => `translate(0,${calc.yChartPadding(d[0])})`)
      .attr("id", (d) => "rect-" + hash_str(d[0]))
      .selectAll(".text")
      .data((d) => d[1]) // map to dates data
      .enter()
      .filter((d) => d[1] > 0)
      .append("text")
      .attr("class", "ltv-plot-label")
      .attr("y", (d) => yBandwidth)
      .attr("x", (d) => calc.xChart(d[0]) + 4)
      .text((d) => (d.sum === 0 ? null : state.numberFormat(d[1])));
  }

  function renderBarsGradient(calc, dv, dc) {
    let plotColors = PlotColors(dv.max);
    let datasets = dv.datasets;

    console.log("renderBarsGradient", dv);

    calc.definitions = calc.svg.append("defs");

    for (let index = 0; index < datasets.length; index++) {
      createGradient(datasets[index], dv, calc, plotColors, dc);
    }

    calc.barsData = calc.svg.append("g").selectAll("g").data(datasets).enter();

    calc.bars = calc.barsData
      .append("rect")
      .attr("transform", (d) => `translate(0,${calc.yChartPadding(d.label)})`)
      .attr("fill", (d) => `url(#${state.id}-${hash_str(d.label)})`)
      .attr("class", "ltv-plot-bar")
      .attr("rx", state.radius)
      .attr("ry", state.radius)
      .attr("x", (d) =>
        calc.xChart(d.duration < 0 ? d.lastDate : d.firstDate || 0)
      )
      // .attr("y", (d) => chart.yChartPadding(d.label))
      .attr("height", calc.yChartPadding.bandwidth())
      .attr("id", (d) => "ltv-plot-rect-" + hash_str(d.label))
      .attr("width", (d) => {
        if (!d.firstDate || !d.lastDate) return 0;
        return (
          calc.xChart(d.lastDate) -
          calc.xChart(d.firstDate) +
          calc.xChart.bandwidth()
        );
      });

    let xBandwidth = calc.yChart.bandwidth();

    calc.labels = calc.barsData
      .append("text")
      .attr("transform", `translate(0,${xBandwidth / 2 + 4})`)
      .attr("class", "ltv-plot-label")
      .attr("id", (d) => "rect-" + hash_str(d.label))
      .attr("x", (d) => calc.xChart(d.firstDate) + xBandwidth / 2)
      .attr("y", (d) => calc.yChart(d.label))
      .attr("height", calc.yChartPadding.bandwidth())
      .attr(
        "width",
        (d) => calc.xChart(d.lastDate) - calc.xChart(d.firstDate) + xBandwidth
      )
      .text(function (dataset) {
        if (dataset.sum === 0) return;
        return `${state.numberFormat(
          dataset.sum
        )} (${dataset.duration + 1} years)`;
      });
  }

  function createGradient(ds, dv, calc, plotColors) {
    let max = dv.max;
    let gradient = calc.definitions
      .append("linearGradient")
      .attr("id", state.id + "-" + hash_str(ds.label))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    if (!ds.data || ds.data.length === 0) return;

    console.log("state", state);

    let count = ds.data.length;
    let latestDate = ds.lastDate;

    let brush = max / 2;
    let dataController = chart.dataController();
    let colorGenerator = dataController.colorGenerator();
    let isSingle = state.colorMode === "single";

    function append(value, percent) {
      gradient
        .append("stop")
        .attr("offset", percent + "%")
        .attr(
          "stop-color",
          isSingle ? colorGenerator.label(ds.label) : plotColors(value)
        )
        .attr("stop-opacity", isSingle ? (value + brush) / (max + brush) : 1);
    }

    if (ds.duration === 0) {
      append(ds.data[0].value, 100);
    } else {
      for (let i = 0; i < count; i++) {
        let diff = latestDate - ds.data[i].date;
        let opacity = diff / ds.duration;
        let percent = (1 - opacity) * 100;
        append(ds.data[i].value, percent);
      }
    }
  }

  function showTooltip(calc, ds) {
    // if (!state.showTooltip) return;
    calc.tooltip.html(tooltipHTML(ds));

    // position tooltip
    let domRect = calc.svg.node().getBoundingClientRect();
    let factor = domRect.width / state.width;
    let offset = [domRect.x + window.scrollX, domRect.y + window.scrollY];

    let top =
      calc.yChart(ds.label) * factor +
      offset[1] +
      state.barHeight * factor +
      LOTIVIS_CONFIG.tooltipOffset;

    calc.tooltip
      .left(calc.xChart(ds.firstDate) * factor + offset[0])
      .top(top)
      .show();
  }

  // Auxiliary

  /**
   * Returns the tooltip text for the given dataset.
   *
   * @param {*} ds The dataset
   * @returns The generated HTML as string
   * @private
   */
  function tooltipHTML(ds) {
    let filtered = ds.data.filter((item) => item.value !== 0);
    let sum = d3.sum(ds.data, (d) => d.value);
    let comps = [
      "Label: " + ds.label,
      "",
      "Start: " + ds.firstDate,
      "End: " + ds.lastDate,
      "",
      "Sum: " + state.numberFormat(sum),
      "",
    ];

    for (let i = 0; i < filtered.length; i++) {
      let entry = filtered[i];
      let frmt = state.numberFormat(entry.value);
      comps.push(`${entry.date}: ${frmt}`);
    }

    return comps.join("<br/>");
  }

  /**
   * Calculates the data view for the bar chart.
   *
   * @param {*} calc The calc object
   * @returns The generated data view
   *
   * @public
   */
  chart.dataView = function (dc) {
    var dv = {};
    dv.labels = dc.labels();
    dv.dates = dc.dates().sort();
    dv.data = dc.snapshotOrData();
    dv.byLabelDate = d3.rollups(
      dv.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.label,
      (d) => d.date
    );

    dv.datasets = dv.byLabelDate.map((d) => {
      let label = d[0];
      let data = d[1]
        .filter((d) => d[1] > 0)
        .map((d) => {
          return { date: d[0], value: d[1] };
        })
        .sort((a, b) => a.date - b.date);

      let sum = d3.sum(data, (d) => d.value);
      let firstDate = (data[0] || {}).date;
      let lastDate = (data[data.length - 1] || {}).date;
      let duration = dv.dates.indexOf(lastDate) - dv.dates.indexOf(firstDate);

      return { label, data, sum, firstDate, lastDate, duration };
    });

    dv.firstDate = dv.dates[0];
    dv.lastDate = dv.dates[dv.dates.length - 1];
    dv.max = d3.max(datasets, (d) => d3.max(d.data, (i) => i.value));

    return dv;
  };

  /**
   * Renders all components of the plot chart.
   *
   * @param {*} container The d3 container
   * @param {*} state The state object of the chart
   * @param {*} calc The calc objct of the chart
   * @param {*} dv The data view
   * @returns The chart itself
   *
   * @public
   */
  chart.render = function (container, state, calc, dv) {
    // calculations
    // Sort date accoding to access function
    // calc.dates = dates.sort((a, b) => dateAccess(a) - dateAccess(b));
    calc.container = container;
    calc.graphWidth = state.width - state.marginLeft - state.marginRight;
    calc.graphHeight = dv.labels.length * state.barHeight;
    calc.height = calc.graphHeight + state.marginTop + state.marginBottom;
    calc.graphLeft = state.width - state.marginLeft;
    calc.graphTop = calc.height - state.marginTop;
    calc.graphRight = state.width - state.marginRight;
    calc.graphBottom = calc.height - state.marginBottom;

    // scales
    createScales(calc, dv);

    // render
    renderSVG(calc, dv);
    renderAxis(calc, dv);
    renderGrid(calc, dv);
    renderSelection(calc, dv);

    if (state.style === "fraction") {
      renderBarsFraction(calc, dv, state.dataController);
    } else {
      renderBarsGradient(calc, dv, state.dataController);
    }

    calc.tooltip = tooltip().container(container).run();

    return chart;
  };

  // Return generated chart
  return chart;
}
