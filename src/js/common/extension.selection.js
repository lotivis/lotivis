import * as d3 from "d3";

d3.selection.prototype.radius = function (radius) {
    return this.attr("rx", radius).attr("ry", radius);
};

d3.selection.prototype.div = function (aClass) {
    return this.append("div").classed(aClass, true);
};

d3.selection.prototype.error = function (text) {
    return this.append("div").text(text);
};

d3.selection.prototype.checkbox = function () {
    // return this.append("div").text(text);

    let pills = this.append("foreignobject")
        .attr("width", 100)
        .attr("height", 100)
        // .append("label")
        .classed("ltv-legend-pill", true);

    let checkboxes = pills
        .append("input")
        .classed("ltv-legend-checkbox", true)
        .attr("type", "checkbox");

    let spans = pills
        .append("g")
        .attr("fill", "red")
        .classed("ltv-legend-pill-span", true)
        .text((d, i) => "Hello World");

    let texts = pills.append("text").text("Hello");

    return pills;
};
