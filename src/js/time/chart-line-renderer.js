
export class ChartLineRenderer {
  constructor(timeChart) {

    /**
     *
     * @param dataset
     * @param index
     */
    this.renderLine = function (dataset, index) {
      timeChart.graph
        .append("path")
        .datum(dataset.data)
        .attr("fill", "none")
        .attr("stroke", dataset.color.rgbString())
        .attr("stroke-width", 3.5)
        .attr("d", d3.line()
          // .x((item) => this.x0(item.date))
          // .y((item) => this.y0(item.value))
          .curve(d3.curveMonotoneX));

      let dots = timeChart.graph
        .selectAll(".dot")
        .data(dataset.data.filter((item) => item.value > 0))
        .enter()
        .append("circle")
        .attr("r", 6)
        // .attr("cx", (item) => this.x0(item.date))
        // .attr("cy", (item) => this.y0(item.value))
        .attr("fill", dataset.color.rgbString());

      let tooltip = timeChart.element
        .append("div")
        .attr("class", "toolTip")
        .style('z-index', '9999');

      dots
        .on("mousemove", function (event, item) {
          let text = "<b>" + item.searchText + "</b>"
            + " in "
            + "<b>" + item.date + "</b>"
            + "<br>Abs.: <b>" + item.value + "</b>"
            // + "<br>Rel.: <b>" + item.relativeValue + "</b>"
            + "<br>Total Date: <b>" + item.dateTotal + "</b>";
          tooltip
            .style("left", event.pageX - 20 + "px")
            .style("top", event.pageY - 160 + "px")
            .style("padding", "10px")
            .style("background", "none repeat scroll 0 0 #ffffff")
            .style("position", "absolute")
            .style("border", "1px solid " + dataset.color.rgbString())
            .style("display", "inline-block")
            .html(text);
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        });

      if (timeChart.isShowLabels === true) {
        this.renderLineLabels(dataset);
      }
    }

    /**
     *
     * @param dataset
     */
    this.renderLineLabels = function (dataset) {
      timeChart
        .graph
        .selectAll(".text")
        .data(dataset.data.filter((item) => item.value > 0))
        .enter()
        .append('text')
        .attr('dy', '-10')
        .attr('text-anchor', 'middle')
        .attr("font-size", 15)
        .attr('fill', 'gray')
        .text((item) => timeChart.numberFormat.format(item.value || 0));
    }
  }
}
