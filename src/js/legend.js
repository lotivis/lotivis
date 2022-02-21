import * as d3 from "d3";
import { baseChart } from "./chart.js";
import { colorSchemeDefault, ColorsGenerator } from "./common/colors.js";
import { CONFIG } from "./common/config.js";
import { uniqueId } from "./common/identifiers.js";

export const LABEL_FORMAT = function (l, v, i) {
    return `${l} (${v})`;
};

export const STACK_FORMAT = function (s, v, ls, i) {
    return `${s}`;
};

export const GROUP_TITLE_FORMAT = function (s, v, ls, i) {
    return `${i + 1}) ${s} (Sum: ${v})`;
};

// export const GROUP_TITLE_FORMAT = function (s, v, ls, i) {
//   return `${i}) ${s} (Labels: ${ls.length}, Sum: ${v})`;
// };

export function legend() {
    let state = {
        // the id of the legend
        id: uniqueId("legend"),

        // margin
        marginLeft: 0,
        marginTop: 10,
        marginRight: 0,
        marginBottom: 20,

        // whether the legend is enabled
        enabled: true,

        // the number formatter vor values displayed
        numberFormat: CONFIG.numberFormat,

        // the format of displaying a datasets label
        labelFormat: LABEL_FORMAT,

        // the format of displaying a datasets stack
        stackFormat: STACK_FORMAT,

        // the format of displaying a group
        groupFormat: GROUP_TITLE_FORMAT,

        colorScheme: colorSchemeDefault,

        // (optional) title of the legend
        title: null,

        // whether to display stacks instead of labels
        stacks: false,

        // whether group the legend (by stacks)
        group: false,

        // the data controller
        dataController: null,
    };

    var chart = baseChart(state);

    /**
     * Toggles the filtered state of the passed label.
     *
     * @param {Event} event The event of the checkbox
     * @param {String} label The label to be toggled
     * @private
     */
    function toggleLabel(event, label) {
        event.target.checked
            ? state.dataController.removeFilter("labels", label, chart)
            : state.dataController.addFilter("labels", label, chart);
    }

    /**
     * Toggles the filtered state of the passed stack.
     *
     * @param {Event} event The event of the checkbox
     * @param {String} stack The stack to be toggled
     * @private
     */
    function toggleStack(event, stack) {
        event.target.checked
            ? state.dataController.removeFilter("stacks", stack, chart)
            : state.dataController.addFilter("stacks", stack, chart);
    }

    /**
     * Returns the value for the "checked" attribute dependant on whether
     * given label is filtered by the data controller.
     *
     * @param {*} label The label to be checked
     * @returns {null | boolean}
     * @private
     */
    function labelChecked(label) {
        return state.dataController.isFilter("labels", label) ? null : true;
    }

    /**
     * Returns the value for the "checked" attribute dependant on whether
     * given stack is filtered by the data controller.
     *
     * @param {*} stack The stack to be checked
     * @returns {null | boolean}
     * @private
     */
    function stackChecked(stack) {
        return state.dataController.isFilter("stacks", stack) ? null : true;
    }

    /**
     * Formattes the given number.
     *
     * @param {Number} value The number to be formatted
     * @returns The formatted value
     * @private
     */
    function format(value) {
        return state.numberFormat(value);
    }

    /**
     *
     * @param {*} label
     * @param {*} index
     * @param {*} dv
     * @returns
     */
    function labelText(label, index, dv) {
        if (typeof state.labelFormat !== "function") return label;
        return state.labelFormat(label, format(dv.byLabel.get(label)), index);
    }

    function stackText(stack, index, dv) {
        if (typeof state.stackFormat !== "function") return stack;
        var value = format(dv.byStack.get(stack));
        var labelsToValue = dv.byStackLabel.get(stack);
        var labels = Array.from(labelsToValue ? labelsToValue.keys() : []);
        return state.stackFormat(stack, value, labels, index);
    }

    function disabled() {
        return unwrap(state.enabled) ? null : true;
    }

    function isGroups() {
        return unwrap(state.group) === true;
    }

    function isStacks() {
        return unwrap(state.stacks) === true;
    }

    function unwrap(value) {
        return typeof value === "function" ? value(chart) : value;
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
        dv.data = dc.data();
        dv.labels = dc.labels();
        dv.stacks = dc.stacks();
        dv.locations = dc.locations();
        dv.dates = dc.dates();

        dv.byLabel = d3.rollup(
            dc.data(),
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.label
        );

        dv.byStack = d3.rollup(
            dc.data(),
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.stack || d.label
        );

        dv.byStackLabel = d3.rollup(
            dc.data(),
            (v) => d3.sum(v, (d) => d.value),
            (d) => d.stack || d.label,
            (d) => d.label
        );

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
        calc.colors = ColorsGenerator(state.colorScheme).data(dv.data);
        calc.div = container
            .append("div")
            .classed("ltv-legend", true)
            .attr("id", state.id)
            .style("margin-left", state.marginLeft + "px")
            .style("margin-top", state.marginTop + "px")
            .style("margin-right", state.marginRight + "px")
            .style("margin-bottom", state.marginBottom + "px");

        // if a title is given render div with title inside
        if (state.title) {
            calc.titleDiv = calc.div
                .append("div")
                .classed("ltv-legend-title", true)
                .text(unwrap(state.title));
        }

        var colorFn = isStacks() ? calc.colors.stack : calc.colors.label;
        var changeFn = isStacks() ? toggleStack : toggleLabel;
        var textFn = isStacks() ? stackText : labelText;

        calc.groups = calc.div
            .selectAll(".div")
            .data(isGroups() ? dv.stacks : [""]) // use single group when mode is not "groups"
            .enter()
            .div("ltv-legend-group")
            .style("color", (s) => calc.colors.stack(s));

        // draw titles only in "groups" mode
        if (isGroups()) {
            calc.titles = calc.groups.append("div").text((stack, index) => {
                var labelsToValue = dv.byStackLabel.get(stack);
                return state.groupFormat(
                    stack,
                    format(dv.byStack.get(stack)),
                    Array.from(labelsToValue ? labelsToValue.keys() : []),
                    index
                );
            });
        }

        var pillsData = isGroups()
            ? (d) => (isStacks() ? [d] : dv.byStackLabel.get(d))
            : isStacks()
            ? dv.stacks
            : dv.labels;

        calc.pills = calc.groups
            .selectAll(".label")
            .data(pillsData)
            .enter()
            .append("label")
            .classed("ltv-legend-pill", true)
            .datum((d) => (isGroups() && !isStacks() ? d[0] : d));

        calc.checkboxes = calc.pills
            .append("input")
            .classed("ltv-legend-checkbox", true)
            .attr("type", "checkbox")
            .attr("checked", isStacks() ? stackChecked : labelChecked)
            .attr("disabled", disabled())
            .on("change", (e, d) => changeFn(e, d));

        calc.spans = calc.pills
            .append("span")
            .classed("ltv-legend-pill-span", true)
            .style("background-color", colorFn)
            .text((d, i) => textFn(d, i, dv));

        if (CONFIG.debug && state.debug) console.log(this);

        return chart;
    };

    // Return generated chart
    return chart;
}
