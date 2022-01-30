import * as d3 from "d3";
import { ltv_chart } from "./common/lotivis.chart";
import { LOTIVIS_CONFIG } from "./common/config";
import { uniqueId } from "./common/create.id";
import "./common/d3selection.js";
import { safeId } from "./common/safe.id";
import { tooltip } from "./tooltip";

export const DATE_ACCESS = function (d) {
  return d;
};

/**
 * Reusable Bar Chart API class that renders a
 * simple and configurable bar chart.
 *
 * @requires d3
 *
 * @example
 * var chart = lotivis
 *    .bar()
 *    .selector(".css-selector")
 *    .dataController(dc)
 *    .run();
 *
 */
export function bar() {
  // Create new underlying chart with the specified state.
  let chart = ltv_chart({
    ltvId: uniqueId("bar"),

    width: 1000,
    height: 600,

    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,

    radius: 5,

    // Whether the chart is selectable.
    selectable: true,

    // The data controller.
    dataController: null,

    // Transformes a given date t a numeric value.
    dateAccess: DATE_ACCESS,
  });

  /**
   * Calculates the data view for the bar chart.
   *
   * @param {*} calc
   * @returns
   */
  chart.prepare = function (calc) {
    // console.log("prepare", this);
    var dc = this.dataController();
    if (!dc) return console.log("[ltv]  no data controller"), this;

    var calc = {};
    calc.snapshot = dc.snapshot();
    let data = calc.snapshot || dc.data;

    calc.byDateStackOriginal = d3.rollup(
      dc.data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.stack || d.label
    );

    calc.maxTotal = d3.max(calc.byDateStackOriginal, (d) =>
      d3.max(d[1], (d) => d[1])
    );
    calc.dates = dc.dates();
    calc.stacks = dc.stacks();
    calc.labels = dc.labels();
    calc.enabledStacks = dc.stacks();

    calc.byDateLabel = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.label
    );

    calc.byDateStack = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.stack || d.label
    );

    calc.byDateStackLabel = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.stack || d.label,
      (d) => d.label
    );

    calc.byDatesStackSeries = new d3.InternMap();
    calc.dates.forEach((date) => {
      let byStackLabel = calc.byDateStackLabel.get(date);
      if (!byStackLabel) return;
      calc.byDatesStackSeries.set(date, new d3.InternMap());

      calc.stacks.forEach((stack) => {
        let byLabel = byStackLabel.get(stack);
        if (!byLabel) return;
        let value = 0;
        let series = Array.from(byLabel)
          .reverse()
          .map((item) => [value, (value += item[1]), item[0]]);
        calc.byDatesStackSeries.get(date).set(stack, series);
      });
    });

    calc.max = d3.max(calc.byDateStack, (d) => d3.max(d[1], (d) => d[1]));

    return calc;
  };

  chart.render = function (container, state, calc) {
    console.log("state", state);

    // Prefer dates specified by user in state, fallback calculated dates.
    let dates = state.dates || calc.dates;
    let stacks = calc.stacks;
    let dateAccess = state.dateAccess;
    let dc = state.dataController;
    let colors = dc.stateItem("colorGenerator");
    let numberFormat = LOTIVIS_CONFIG.numberFormat;
    console.log("colors", colors);

    // Sort date accoding to access function
    let datesSorted = dates.sort((a, b) => dateAccess(a) - dateAccess(b));

    let graphWidth = state.width - state.marginLeft - state.marginRight,
      graphHeight = state.height - state.marginTop - state.marginBottom,
      graphBottom = state.height - state.marginBottom,
      graphRight = state.width - state.marginRight;

    // #  SCALES  ###############################################################

    let xChartScale = d3
      .scaleBand()
      .domain(datesSorted)
      .rangeRound([state.marginLeft, graphRight]);

    let xChartScalePadding = d3
      .scaleBand()
      .domain(datesSorted)
      .rangeRound([state.marginLeft, graphRight])
      .paddingInner(0.2);

    let xStack = d3
      .scaleBand()
      .domain(stacks)
      .rangeRound([0, xChartScale.bandwidth()])
      .padding(0.05);

    let yChart = d3
      .scaleLinear()
      .domain([0, calc.maxTotal])
      .nice()
      .rangeRound([state.height - state.marginBottom, state.marginTop]);

    // #  DRAWING  ##############################################################

    // -  SVG  ------------------------------------------------------------------

    let svg = container
      .append("svg")
      .attr("class", "ltv-chart-svg ltv-bar-chart-svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${state.width} ${state.height}`);

    let graph = svg
      .append("g")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("transform", `translate(${state.marginLeft},${state.marginTop})`);

    // -  AXIS  ------------------------------------------------------------------

    // left axis
    svg
      .append("g")
      .call(d3.axisLeft(yChart))
      .attr("transform", () => `translate(${state.marginLeft},0)`);

    // bottom axis
    svg
      .append("g")
      .call(d3.axisBottom(xChartScale))
      .attr("transform", `translate(0,${state.height - state.marginBottom})`);

    // -  GRID  ------------------------------------------------------------------

    let xAxisGrid = d3
      .axisBottom(xChartScale)
      .tickSize(-graphHeight)
      .tickFormat("");

    let yAxisGrid = d3
      .axisLeft(yChart)
      .tickSize(-graphWidth)
      .tickFormat("")
      .ticks(20);

    svg
      .append("g")
      .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-x")
      .attr("transform", "translate(0," + graphBottom + ")")
      .call(xAxisGrid);

    svg
      .append("g")
      .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-y")
      .attr("transform", `translate(${state.marginLeft},0)`)
      .call(yAxisGrid);

    // -  SELECTION  ------------------------------------------------------------------

    let selection = svg
      .append("g")
      .selectAll("rect")
      .data(datesSorted)
      .enter()
      .append("rect")
      .attr("class", "ltv-bar-chart-selection-rect")
      .attr("id", (d) => `ltv-bar-chart-selection-rect-${safeId(String(d))}`)
      .attr("width", xChartScale.bandwidth())
      .attr("height", graphHeight)
      .attr("x", (d) => xChartScale(d))
      .attr("y", state.marginTop)
      .attr("opacity", (d) => (dc.isFilterDate(d) ? 0.3 : 0))
      .on("mouseenter", mouseEnter)
      .on("mouseout", mouseOut)
      .on("mousedrag", mouseDrag)
      .on("click", click)
      .raise();

    // -  BARS  ------------------------------------------------------------------

    if (state.style === "combine") {
      svg
        .append("g")
        .selectAll("g")
        .data(calc.byDateStack)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${xChartScale(d[0])},0)`)
        // .attr("opacity", (d) => opacity(d[0]))
        .attr("class", "ltv-bar-chart-dates-area")
        .selectAll("rect")
        .data((d) => d[1]) // map to by stack
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-bar")
        .attr("fill", (d) => colors.stack(d[0]))
        .attr("x", (d) => xStack(d[0]))
        .attr("y", (d) => yChart(d[1]))
        .attr("width", xStack.bandwidth())
        .attr("height", (d) => state.height - yChart(d[1]))
        .attr("rx", state.radius)
        .attr("ry", state.radius)
        .raise();
    } else {
      svg
        .append("g")
        .selectAll("g")
        .data(calc.byDatesStackSeries)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${xChartScale(d[0])},0)`) // translate to x of date
        .attr("class", "ltv-bar-chart-dates-area")
        .selectAll("rect")
        .data((d) => d[1]) // map to by stack
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${xStack(d[0])},0)`)
        .selectAll("rect")
        .data((d) => d[1]) // map to series
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-bar")
        .attr("fill", (d) => colors.label(d[2]))
        .attr("width", xStack.bandwidth())
        .attr("height", (d) => (!d[1] ? 0 : yChart(d[0]) - yChart(d[1])))
        .attr("y", (d) => yChart(d[1]))
        .attr("rx", state.radius)
        .attr("ry", state.radius)
        .raise();
    }

    // -  LABELS  ------------------------------------------------------------------

    let labels = svg
      .append("g")
      .selectAll("g")
      .data(datesSorted)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${xChartScale(d)},0)`) // translate to x of date
      .selectAll(".text")
      .data((date) => calc.byDateStack.get(date) || [])
      .enter()
      .append("text")
      .attr("class", "ltv-bar-chart-label")
      .attr("transform", (d) => {
        let stack = d[0];
        let value = d[1];
        let width = xStack.bandwidth() / 2;
        let x = (xStack(stack) || 0) + width;
        let y = yChart(value) - 5;
        return `translate(${x},${y})rotate(-60)`;
      })
      .text((d) => (d[1] === 0 ? "" : numberFormat(d[1])))
      .raise();

    // -  TOOLTIP  ------------------------------------------------------------------

    let tip = tooltip().container(container).run();
    // const tooltip = container
    //   .append("div")

    //   .attr("class", "ltv-tooltip")
    //   .attr("rx", 5) // corner radius
    //   .attr("ry", 5)
    //   .style("opacity", 0);

    function getTop(factor, offset, tooltipSize) {
      let top = state.marginTop * factor;
      top += (graphHeight * factor - tooltipSize[1]) / 2;
      top += offset[1] - 10;
      return top;
    }

    function getXLeft(date, factor, offset, tooltipSize) {
      return (
        xChartScalePadding(date) * factor +
        offset[0] -
        tooltipSize[0] -
        22 -
        LOTIVIS_CONFIG.tooltipOffset
      );
    }

    function getXRight(date, factor, offset) {
      return (
        (xChartScalePadding(date) + xChartScalePadding.bandwidth()) * factor +
        offset[0] +
        LOTIVIS_CONFIG.tooltipOffset
      );
    }

    function getHTMLForDate(date) {
      let filtered = calc.byDateLabel.get(date);
      if (!filtered) return "No Data";

      let title = `${date}`;
      let sum = 0;
      let dataHTML = Array.from(filtered.keys())
        .map(function (label) {
          let value = filtered.get(label);
          if (!value) return undefined;
          let color = colors.label(label);
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          let valueFormatted = numberFormat(value);
          sum += value;
          return `${divHTML} ${label}: <b>${valueFormatted}</b>`;
        })
        .filter((d) => d)
        .join("<br>");

      let sumFormatted = numberFormat(sum);
      return `<b>${title}</b><br>${dataHTML}<br><br>Sum: <b>${sumFormatted}</b>`;
    }

    // #  HANDLERS  ##############################################################

    function mouseEnter(event, date) {
      svg
        .select(`ltv-bar-chart-selection-rect-${safeId(String(date))}`)
        .attr("opacity", 0.3);

      // position tooltip
      let tooltipSize = tip.size();
      let domRect = svg.node().getBoundingClientRect();
      let factor = domRect.width / state.width;
      let offset = [domRect.x + window.scrollX, domRect.y + window.scrollY];
      let top = getTop(factor, offset, tooltipSize);
      let left = xChartScalePadding(date);

      // differ tooltip position on bar position
      if (left > state.width / 2) {
        left = getXLeft(date, factor, offset, tooltipSize);
      } else {
        left = getXRight(date, factor, offset);
      }

      tip.html(getHTMLForDate(date)).top(`${top}px`).left(`${left}px`).show();
    }

    function mouseOut(event, date) {
      tip.hide();
    }

    function mouseDrag(event, date) {
      // check for mouse down
      if (event.buttons === 1) onMouseClick(event, date);
    }

    function click(event, date) {
      console.log("click", date, event);
      if (!state.selectable) return;
      dc.toggleDate(date, chart);

      svg
        .select(`#ltv-bar-chart-selection-rect-${safeId(String(date))}`)
        .attr(`opacity`, (d) => (dc.isFilterDate(d) ? 0.3 : 0));

      svg
        .selectAll(`.ltv-bar-chart-dates-area`)
        .attr(`opacity`, (d) => (dc.isFilterDate(d[0]) ? 1 : 0.3))
        .raise();
    }
  };

  // Return generated chart
  return chart;
}
