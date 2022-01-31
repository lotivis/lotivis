import * as d3 from "d3";
import { baseChart } from "./chart";
import { LOTIVIS_CONFIG } from "./common/config";
import { uniqueId } from "./common/identifiers";
import { tooltip } from "./tooltip";
import { hash } from "./common/hash";
import { PlotColors } from "./common/colors";
import { DEFAULT_NUMBER_FORMAT } from "./common/formats";

function transX(x) {
  return "translate(" + x + ",0)";
}

function transY(y) {
  return "translate(0," + y + ")";
}

export const DATE_ACCESS = function (d) {
  return d;
};

export const PLOT_SORT = {
  /**
   * Sorts datasets alphabetically.
   */
  alphabetically: (left, right) => left.label < right.label,

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
    id: uniqueId("plot"),

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
    colorMode: "multi",

    // Whether the chart is selectable.
    selectable: true,

    // the border style of the data preview
    border: LOTIVIS_CONFIG.defaultBorder,

    // transformes a given date into a numeric value.
    dateAccess: DATE_ACCESS,

    // format for displayed numbers
    numberFormat: DEFAULT_NUMBER_FORMAT,

    // sort, "alphabetically"
    sort: null,

    // displayed dates
    dates: null,

    // whether to draw the bottom axis
    drawBottomAxis: false,

    // whether to draw labels on chart
    labels: true,

    // whether to show the tooltip
    tooltip: true,

    // the data controller.
    dataController: null,

    // the data view.
    dataView: null,
  };

  // create new underlying chart with the specified state
  let chart = baseChart(state);

  // private

  /**
   * Creates the scales used by the plot chart.
   *
   * @param {calc} calc The calc object
   * @param {dataView} dv The data view
   * @private
   */
  function createScales(calc, dv) {
    // preferre dates from state if specified. fallback to
    // dates of data view
    let dates = Array.isArray(state.dates) ? state.dates : dv.dates;

    // Sort date according to access function
    dates = dates.sort((a, b) => state.dateAccess(a) - state.dateAccess(b));

    calc.xChart = d3
      .scaleBand()
      .domain(dates)
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

    calc.yBandwidth = calc.yChart.bandwidth();
  }

  /**
   * Renders the main svg of the chart.
   *
   * @param {calc} calc The calc object.
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
   * Renders the axis of the chart.
   *
   * @param {calc} calc The calc object.
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
    if (state.drawBottomAxis) {
      calc.svg
        .append("g")
        .call(d3.axisBottom(calc.xChart))
        .attr("transform", transY(calc.height - state.marginBottom));
    }
  }

  /**
   * Renders the grid of the plot chart.
   *
   * @param {calc} calc The calc object.
   * @private
   */
  function renderGrid(calc) {
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
   * @param {calc} calc The calc object.
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

  /**
   * Renders the bars of of the chart for style "fraction".
   *
   * @param {calc} calc The calc object.
   * @param {*} dv The data view
   */
  function renderBarsFraction(calc, dv) {
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
      .attr("id", (d) => "ltv-plot-rect-" + hash(d[0]))
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

    if (state.labels === true) {
      calc.labels = calc.barsData
        .append("g")
        .attr("transform", (d) => `translate(0,${calc.yChartPadding(d[0])})`)
        .attr("id", (d) => "rect-" + hash(d[0]))
        .selectAll(".text")
        .data((d) => d[1]) // map to dates data
        .enter()
        .filter((d) => d[1] > 0)
        .append("text")
        .attr("class", "ltv-plot-label")
        .attr("y", (d) => calc.yBandwidth / 2)
        .attr("x", (d) => calc.xChart(d[0]) + 4)
        .text((d) => (d.sum === 0 ? null : state.numberFormat(d[1])));
    }
  }

  /**
   *
   * @param {calc} calc The calc object.
   * @param {*} dv
   * @param {*} dc
   */
  function renderBarsGradient(calc, dv, dc) {
    let plotColors = PlotColors(dv.max);
    calc.definitions = calc.svg.append("defs");

    for (let index = 0; index < dv.datasets.length; index++) {
      createGradient(dv.datasets[index], dv, calc, plotColors, dc);
    }

    calc.barsData = calc.svg
      .append("g")
      .selectAll("g")
      .data(dv.datasets)
      .enter();

    calc.bars = calc.barsData
      .append("rect")
      .attr("transform", (d) => `translate(0,${calc.yChartPadding(d.label)})`)
      .attr("fill", (d) => `url(#${state.id}-${hash(d.label)})`)
      .attr("class", "ltv-plot-bar")
      .attr("rx", state.radius)
      .attr("ry", state.radius)
      .attr("x", (d) =>
        calc.xChart(d.duration < 0 ? d.lastDate : d.firstDate || 0)
      )
      .attr("height", calc.yChartPadding.bandwidth())
      .attr("width", (d) => {
        if (!d.firstDate || !d.lastDate) return 0;
        return (
          calc.xChart(d.lastDate) -
          calc.xChart(d.firstDate) +
          calc.xChart.bandwidth()
        );
      });

    if (state.labels === true) {
      calc.labels = calc.barsData
        .append("text")
        .attr("transform", `translate(0,${calc.yBandwidth / 2 + 4})`)
        .attr("class", "ltv-plot-label")
        .attr("id", (d) => "rect-" + hash(d.label))
        .attr("x", (d) => calc.xChart(d.firstDate) + calc.yBandwidth / 2)
        .attr("y", (d) => calc.yChart(d.label))
        .attr("height", calc.yChartPadding.bandwidth())
        .attr(
          "width",
          (d) =>
            calc.xChart(d.lastDate) - calc.xChart(d.firstDate) + calc.yBandwidth
        )
        .text(function (dataset) {
          if (dataset.sum === 0) return;
          return `${state.numberFormat(
            dataset.sum
          )} (${dataset.duration + 1} years)`;
        });
    }
  }

  /**
   *
   * @param {*} ds
   * @param {*} dv
   * @param {*} calc
   * @param {*} plotColors
   * @returns
   */
  function createGradient(ds, dv, calc, plotColors) {
    let gradient = calc.definitions
      .append("linearGradient")
      .attr("id", state.id + "-" + hash(ds.label))
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    if (!ds.data || ds.data.length === 0) return;

    let count = ds.data.length;
    let latestDate = ds.lastDate;

    let dataController = chart.dataController();
    let colorGenerator = dataController.colorGenerator();
    let isSingle = state.colorMode === "single";
    let colors = isSingle ? colorGenerator.label : plotColors;

    function append(value, percent) {
      gradient
        .append("stop")
        .attr("offset", percent + "%")
        .attr("stop-color", colors(isSingle ? ds.label : value))
        .attr("stop-opacity", isSingle ? value / dv.max : 1);
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

  /**
   *
   * @param {*} calc
   * @param {*} ds
   */
  function showTooltip(calc, ds) {
    if (!state.tooltip) return;
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

    switch (state.sort) {
      case "alphabetically":
        dv.datasets = dv.datasets.sort(PLOT_SORT.alphabetically);
        break;
      case "duration":
        dv.datasets = dv.datasets.sort(PLOT_SORT.duration);
        break;
      case "intensity":
        dv.datasets = dv.datasets.sort(PLOT_SORT.intensity);
        break;
      case "firstDate":
        dv.datasets = dv.datasets.sort(PLOT_SORT.firstDate);
        break;
      default:
        dv.datasets = dv.datasets.reverse();
        break;
    }

    dv.labels = dv.datasets.map((d) => d.label);
    dv.firstDate = dv.dates[0];
    dv.lastDate = dv.dates[dv.dates.length - 1];
    dv.max = d3.max(dv.datasets, (d) => d3.max(d.data, (i) => i.value));

    return dv;
  };

  /**
   * Renders all components of the plot chart.
   *
   * @param {*} container The d3 container
   * @param {*} calc The calc objct of the chart
   * @param {*} dv The data view
   * @returns The chart itself
   *
   * @public
   */
  chart.render = function (container, calc, dv) {
    // calculations
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

  // return generated chart
  return chart;
}
