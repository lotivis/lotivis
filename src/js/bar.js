import * as d3 from "d3";
import { baseChart } from "./chart";
import { CONFIG } from "./common/config";
import { uniqueId } from "./common/identifiers";
import { safeId } from "./common/identifiers";
import { tooltip } from "./tooltip";
import { legend } from "./legend";
import { DEFAULT_NUMBER_FORMAT } from "./common/formats";
import { DEFAULT_DATE_ORDINATOR } from "./common/date.ordinator";

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
    let state = {
        // a unique id for this chart
        id: uniqueId("bar"),

        // the width of the chart's svg
        width: 1000,

        // the height of the chart's svg
        height: 600,

        // margin
        marginLeft: 20,
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,

        // corner radius of bars
        radius: 5,

        // whether the chart is enabled.
        enabled: true,

        // whether to draw labels
        labels: false,

        legend: legend(),

        // whether to display a tooltip.
        tooltip: true,

        style: "stacks",

        // the data controller.
        dataController: null,

        // transformes a given date t a numeric value.
        dateAccess: DEFAULT_DATE_ORDINATOR,

        // the number format
        numberFormat: DEFAULT_NUMBER_FORMAT,

        // displayed dates
        dates: null,
    };

    // Create new underlying chart with the specified state.
    let chart = baseChart(state);

    function colors() {
        return state.dataController.dataColors();
    }

    /**
     *
     * @param {*} calc
     * @param {*} dv
     */
    function createScales(calc, dv) {
        // preferre dates from state if specified. fallback to
        // dates of data view
        let dates = Array.isArray(state.dates) ? state.dates : dv.dates;

        // Sort date according to access function
        dates = dates.sort((a, b) => state.dateAccess(a) - state.dateAccess(b));

        calc.xChartScale = d3
            .scaleBand()
            .domain(dates)
            .rangeRound([state.marginLeft, calc.graphRight]);

        calc.xChartScalePadding = d3
            .scaleBand()
            .domain(dates)
            .rangeRound([state.marginLeft, calc.graphRight])
            .paddingInner(0.2);

        calc.xStack = d3
            .scaleBand()
            .domain(dv.stacks)
            .rangeRound([0, calc.xChartScale.bandwidth()])
            .padding(0.05);

        calc.yChart = d3
            .scaleLinear()
            .domain([0, dv.maxTotal])
            .nice()
            .rangeRound([state.height - state.marginBottom, state.marginTop]);
    }

    function renderSVG(container, calc) {
        calc.svg = container
            .append("svg")
            .attr("class", "ltv-chart-svg ltv-bar-chart-svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${state.width} ${state.height}`);
    }

    /**
     * Renders the axis of the chart.
     * @param {*} calc The calc obj
     * @private
     */
    function renderAxis(calc) {
        calc.svg
            .append("g")
            .call(d3.axisLeft(calc.yChart))
            .attr("transform", () => `translate(${state.marginLeft},0)`);

        // bottom axis
        calc.svg
            .append("g")
            .call(d3.axisBottom(calc.xChartScale))
            .attr(
                "transform",
                `translate(0,${state.height - state.marginBottom})`
            );
    }

    /**
     * Renders the grid of the chart.
     * @param {*} calc The calc obj
     * @private
     */
    function renderGrid(calc) {
        let xAxisGrid = d3
            .axisBottom(calc.xChartScale)
            .tickSize(-calc.graphHeight)
            .tickFormat("");

        let yAxisGrid = d3
            .axisLeft(calc.yChart)
            .tickSize(-calc.graphWidth)
            .tickFormat("")
            .ticks(20);

        calc.svg
            .append("g")
            .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-x")
            .attr("transform", "translate(0," + calc.graphBottom + ")")
            .call(xAxisGrid);

        calc.svg
            .append("g")
            .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-y")
            .attr("transform", `translate(${state.marginLeft},0)`)
            .call(yAxisGrid);
    }

    function renderSelection(calc, dv) {
        calc.selection = calc.svg
            .append("g")
            .selectAll("rect")
            .data(dv.dates)
            .enter()
            .append("rect")
            .attr("class", "ltv-bar-chart-selection-rect")
            .attr(
                "id",
                (d) => `ltv-bar-chart-selection-rect-${safeId(String(d))}`
            )
            .attr("width", calc.xChartScale.bandwidth())
            .attr("height", calc.graphHeight)
            .attr("x", (d) => calc.xChartScale(d))
            .attr("y", state.marginTop)
            .attr("opacity", (d) =>
                state.dataController.isFilter("dates", d) ? 0.3 : 0
            )
            .on("mouseenter", mouseEnter)
            .on("mouseout", mouseOut)
            .on("mousedrag", mouseDrag)
            .on("click", click)
            .raise();

        // #  HANDLERS  ##############################################################

        function mouseEnter(event, date) {
            calc.svg
                .select(`ltv-bar-chart-selection-rect-${safeId(String(date))}`)
                .attr("opacity", 0.3);

            // position tooltip
            let tooltipSize = calc.tip.size();
            let domRect = calc.svg.node().getBoundingClientRect();
            let factor = domRect.width / state.width;
            let offset = [
                domRect.x + window.scrollX,
                domRect.y + window.scrollY,
            ];
            let top = getTop(factor, offset, tooltipSize, calc);
            let left = calc.xChartScalePadding(date);

            // differ tooltip position on bar position
            if (left > state.width / 2) {
                left = getXLeft(date, factor, offset, tooltipSize, calc);
            } else {
                left = getXRight(date, factor, offset, calc);
            }

            calc.tip
                .html(getHTMLForDate(date, dv))
                .top(`${top}px`)
                .left(`${left}px`)
                .show();
        }

        function mouseOut(event, date) {
            calc.tip.hide();
        }

        function mouseDrag(event, date) {
            // check for mouse down
            if (event.buttons === 1) onMouseClick(event, date);
        }

        function click(event, date) {
            if (!state.enabled) return;
            var dc = state.dataController;
            dc.toggleFilter("dates", date, chart);

            calc.svg
                .select(`#ltv-bar-chart-selection-rect-${safeId(String(date))}`)
                .attr(`opacity`, (d) => (dc.isFilter("dates", d) ? 0.3 : 0));

            // calc.svg
            //   .selectAll(`.ltv-bar-chart-dates-area`)
            //   .attr(`opacity`, (d) => (dc.isFilterDate(d[0]) ? 1 : 0.3))
            //   .raise();
        }
    }

    function renderCombined(calc, dv) {
        calc.svg
            .append("g")
            .selectAll("g")
            .data(dv.byDateStack)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${calc.xChartScale(d[0])},0)`)
            // .attr("opacity", (d) => opacity(d[0]))
            .attr("class", "ltv-bar-chart-dates-area")
            .selectAll("rect")
            .data((d) => d[1]) // map to by stack
            .enter()
            .append("rect")
            .attr("class", "ltv-bar-chart-bar")
            .attr("fill", (d) => colors().stack(d[0]))
            .attr("x", (d) => calc.xStack(d[0]))
            .attr("y", (d) => calc.yChart(d[1]))
            .attr("width", calc.xStack.bandwidth())
            .attr("height", (d) => state.height - calc.yChart(d[1]))
            .attr("rx", state.radius)
            .attr("ry", state.radius)
            .raise();
    }

    function renderStacked(calc, dv) {
        calc.svg
            .append("g")
            .selectAll("g")
            .data(dv.byDatesStackSeries)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${calc.xChartScale(d[0])},0)`) // translate to x of date
            .attr("class", "ltv-bar-chart-dates-area")
            .selectAll("rect")
            .data((d) => d[1]) // map to by stack
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${calc.xStack(d[0])},0)`)
            .selectAll("rect")
            .data((d) => d[1]) // map to series
            .enter()
            .append("rect")
            .attr("class", "ltv-bar-chart-bar")
            .attr("fill", (d) => colors().label(d[2]))
            .attr("width", calc.xStack.bandwidth())
            .attr("height", (d) =>
                !d[1] ? 0 : calc.yChart(d[0]) - calc.yChart(d[1])
            )
            .attr("y", (d) => calc.yChart(d[1]))
            .attr("rx", state.radius)
            .attr("ry", state.radius)
            .raise();
    }

    function renderLabels(calc, dv) {
        calc.labels = calc.svg
            .append("g")
            .selectAll("g")
            .data(dv.dates)
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${calc.xChartScale(d)},0)`) // translate to x of date
            .selectAll(".text")
            .data((date) => dv.byDateStack.get(date) || [])
            .enter()
            .append("text")
            .attr("class", "ltv-bar-chart-label")
            .attr("transform", (d) => {
                let stack = d[0];
                let value = d[1];
                let width = calc.xStack.bandwidth() / 2;
                let x = (calc.xStack(stack) || 0) + width;
                let y = calc.yChart(value) - 5;
                return `translate(${x},${y})rotate(-60)`;
            })
            .text((d) => (d[1] === 0 ? "" : state.numberFormat(d[1])))
            .raise();
    }

    function getTop(factor, offset, tooltipSize, calc) {
        let top = state.marginTop * factor;
        top += (calc.graphHeight * factor - tooltipSize[1]) / 2;
        top += offset[1] - 10;
        return top;
    }

    function getXLeft(date, factor, offset, tooltipSize, calc) {
        return (
            calc.xChartScalePadding(date) * factor +
            offset[0] -
            tooltipSize[0] -
            22 -
            CONFIG.tooltipOffset
        );
    }

    function getXRight(date, factor, offset, calc) {
        return (
            (calc.xChartScalePadding(date) +
                calc.xChartScalePadding.bandwidth()) *
                factor +
            offset[0] +
            CONFIG.tooltipOffset
        );
    }

    function getHTMLForDate(date, dv) {
        let filtered = dv.byDateLabel.get(date);
        if (!filtered) return "No Data";

        let title = `${date}`;
        let sum = 0;
        let dataHTML = Array.from(filtered.keys())
            .map(function (label) {
                let value = filtered.get(label);
                if (!value) return undefined;
                let color = colors().label(label);
                let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
                let valueFormatted = state.numberFormat(value);
                sum += value;
                return `${divHTML} ${label}: <b>${valueFormatted}</b>`;
            })
            .filter((d) => d)
            .join("<br>");

        let sumFormatted = state.numberFormat(sum);
        return `<b>${title}</b><br>${dataHTML}<br><br>Sum: <b>${sumFormatted}</b>`;
    }

    /**
     * Calculates the data view for the bar chart.
     *
     * @param {*} calc
     * @returns
     */
    chart.dataView = function (dc) {
        var dv = {};

        dv.data = dc.data();
        dv.snapshot = dc.snapshot();

        dv.byDateStackOriginal = d3.rollup(
            dv.data,
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.date,
            (d) => d.stack || d.label
        );

        dv.maxTotal = d3.max(dv.byDateStackOriginal, (d) =>
            d3.max(d[1], (d) => d[1])
        );
        dv.dates = dc.dates();
        dv.stacks = dv.snapshot.stacks;
        dv.labels = dv.snapshot.labels;
        dv.enabledStacks = dv.snapshot.stacks;

        dv.byDateLabel = d3.rollup(
            dv.snapshot,
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.date,
            (d) => d.label
        );

        dv.byDateStack = d3.rollup(
            dv.snapshot,
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.date,
            (d) => d.stack || d.label
        );

        dv.byDateStackLabel = d3.rollup(
            dv.snapshot,
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.date,
            (d) => d.stack || d.label,
            (d) => d.label
        );

        dv.byDatesStackSeries = new d3.InternMap();
        dv.dates.forEach((date) => {
            let byStackLabel = dv.byDateStackLabel.get(date);
            if (!byStackLabel) return;
            dv.byDatesStackSeries.set(date, new d3.InternMap());

            dv.stacks.forEach((stack) => {
                let byLabel = byStackLabel.get(stack);
                if (!byLabel) return;
                let value = 0;
                let series = Array.from(byLabel)
                    .reverse()
                    .map((item) => [value, (value += item[1]), item[0]]);
                dv.byDatesStackSeries.get(date).set(stack, series);
            });
        });

        dv.max = d3.max(dv.byDateStack, (d) => d3.max(d[1], (d) => d[1]));

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

        createScales(calc, dv);

        renderSVG(container, calc);
        renderAxis(calc, dv);
        renderGrid(calc, dv);
        renderSelection(calc, dv);

        if (state.style === "combine") {
            renderCombined(calc, dv);
        } else {
            renderStacked(calc, dv);
        }

        if (state.labels) renderLabels(calc, dv);

        if (state.tooltip) calc.tip = tooltip().container(container).run();

        if (state.legend) {
            let dc = state.dataController;
            let dv = state.legend.dataView(dc);
            let calc = {};
            state.legend.skipFilterUpdate = () => true;
            state.legend.dataController(dc).render(container, calc, dv);
        }
    };

    // return generated chart
    return chart;
}
