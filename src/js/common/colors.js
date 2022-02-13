import * as d3 from "d3";

/** Returns the darker darker version of the passed color. */
function darker(color) {
    // return color.darker().darker();
    return color.darker();
}

// constants

export const colorSchemeCategory10 = d3.schemeCategory10;

export const colorSchemeTableau10 = d3.schemeTableau10;

export const colorSchemeLotivis10 = [
    "RoyalBlue",
    "MediumSeaGreen",
    "MediumPurple",
    "Violet",
    "Orange",
    "Tomato",
    "Turquoise",
    "LightGray",
    "Gray",
    "BurlyWood",
];

export const tintColor = colorSchemeLotivis10[0];

export const colorScale1 = colorScale("Yellow", "Orange", "Red", "Purple");

export const colorScale2 = colorScale("White", "MediumSeaGreen", "RoyalBlue");

export function ColorsGenerator(c, d) {
    let colors = c || colorSchemeLotivis10,
        data = d || [],
        stackColors,
        labelColors,
        stacksToLabels,
        stacks;

    function fallback() {
        return Array.isArray(colors) && colors.length ? colors[0] : "RoyalBlue";
    }

    function generator(index) {
        return colors[(+index || 0) % colors.length];
    }

    function calc() {
        stackColors = new Map();
        labelColors = new Map();
        stacksToLabels = d3.group(
            data,
            (d) => d.stack || d.label,
            (d) => d.label
        );
        stacks = Array.from(stacksToLabels.keys());

        stacks.forEach((stack) => {
            let labels = Array.from((stacksToLabels.get(stack) || []).keys());
            let stackColor = colors[stacks.indexOf(stack) % colors.length];
            let c1 = d3.color(stackColor);
            let stackScale = colorScale(c1, darker(c1));

            stackColors.set(stack, c1);

            labels.forEach((label, index) => {
                labelColors.set(label, stackScale(index / labels.length));
            });
        });

        return generator;
    }

    generator.data = function (_) {
        return arguments.length ? ((data = _), calc()) : data;
    };

    generator.colors = function (_) {
        return arguments.length ? ((colors = _), calc()) : colors;
    };

    generator.stack = function (stack) {
        return stackColors ? stackColors.get(stack) || fallback() : fallback();
    };

    generator.label = function (label) {
        return labelColors ? labelColors.get(label) || fallback() : fallback();
    };

    return generator;
}

/**
 *
 * @param {*} data The data to generate colors for
 * @return {DataColors} A data colors object
 */
export function DataColors(data) {
    let baseColors = colorSchemeLotivis10,
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
        let colors = colorScale(c1, darker(c1));

        stackColors.set(stack, c1);

        labels.forEach((label, index) => {
            labelColors.set(label, colors(index / labels.length));
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
        return stackColors ? stackColors.get(stack) || tintColor : tintColor;
    };

    /**
     * Returns the color for the given label.
     *
     * @param {label} label The label
     * @returns {d3.Color} The color for the label
     * @public
     */
    main.label = function (label) {
        return labelColors ? labelColors.get(label) || tintColor : tintColor;
    };

    return main;
}

export function colorScale(...colors) {
    if (!colors.length) throw new Error("no colors");
    return d3
        .scaleLinear()
        .domain(colors.map((c, i) => i / (colors.length - 1)))
        .range(colors);
}
