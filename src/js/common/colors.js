import * as d3 from "d3";

/** Returns the darker darker version of the passed color. */
function darker(color) {
    return color.darker().darker();
}

// constants

/** The default colors used by lotivis. */
export const DATA_COLORS = []
    .concat(d3.schemeTableau10)
    .concat(d3.schemeCategory10)
    .concat(d3.schemeDark2);

/** The default tint color used by lotivis. */
export const TINT_COLOR = DATA_COLORS[0];

/**
 *
 * @param {*} data The data to generate colors for
 * @return {DataColors} A data colors object
 */
export function DataColors(data) {
    let baseColors = DATA_COLORS,
        stackColors = new Map(),
        labelColors = new Map(),
        stacksToLabels = d3.group(
            data,
            (d) => d.stack || d.label,
            (d) => d.label
        ),
        stacks = Array.from(stacksToLabels.keys());

    /**
     * Returns a collection of label belonging the passed stack.
     * @private
     */
    function stackLabels(stack) {
        return Array.from((stacksToLabels.get(stack) || []).keys());
    }

    /**
     * From the collection of base color returns the color for
     * the passed stack by calculating the stacks index.
     * @private
     */
    function stackColor(stack) {
        return baseColors[stacks.indexOf(stack) % baseColors.length];
    }

    stacks.forEach((stack) => {
        let labels = stackLabels(stack);
        let c1 = d3.color(stackColor(stack));
        let colors = ColorScale(labels.length, [c1, darker(c1)]);

        stackColors.set(stack, c1);

        labels.forEach((label, index) => {
            labelColors.set(label, colors(index));
        });
    });

    function main() {}

    /**
     * Returns the color for the given stack.
     *
     * @param {stack} stack The stack
     * @returns The d3.color for the stack
     * @public
     */
    main.stack = function (stack) {
        return stackColors ? stackColors.get(stack) || TINT_COLOR : TINT_COLOR;
    };

    /**
     * Returns the color for the given label.
     *
     * @param {label} label The label
     * @returns {d3.Color} The color for the label
     * @public
     */
    main.label = function (label) {
        return labelColors ? labelColors.get(label) || TINT_COLOR : TINT_COLOR;
    };

    return main;
}

export function MapColors(max) {
    return d3
        .scaleLinear()
        .domain([0, (1 / 3) * max, (2 / 3) * max, max])
        .range(["yellow", "orange", "red", "purple"]);
}

export function PlotColors(max) {
    return ColorScale(max, ["yellow", "orange", "red", "purple"]);
}

export function ColorScale(max, colors) {
    return d3
        .scaleLinear()
        .domain(colors.map((c, i) => (i / (colors.length - 1)) * max))
        .range(colors);
}
