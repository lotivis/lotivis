import {log_debug} from "../shared/debug";

export class ChartGhostBarsRenderer {

  constructor(timeChart) {

    this.hideAll = function () {
      timeChart.svg
        .selectAll('.ghost-rect')
        .transition()
        .attr("opacity", 0);
    }

    this.onMouseEnter = function (event, date) {
      this.hideAll();
      let controller = timeChart.datasetController;
      timeChart.updateSensible = false;
      controller.setDatesFilter([date]);
      timeChart.updateSensible = true;
      timeChart
        .svg
        .select(`#ghost-rect-${date}`)
        .transition()
        .attr("opacity", 0.5);
    }.bind(this);

    this.renderGhostBars = function () {
      let dates = timeChart.datasetController.dates;
      timeChart
        .svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", 'ghost-rect')
        .attr("id", date => `ghost-rect-${date}`)
        .attr("fill", 'gray')
        .attr("opacity", 0)
        .attr("x", (date) => timeChart.xChart(date))
        .attr("y", timeChart.margin.bottom)
        .attr("width", timeChart.xChart.bandwidth())
        .attr("height", timeChart.height - timeChart.margin.bottom - timeChart.margin.top)
        .on('mouseenter', this.onMouseEnter);

    };
  }
}
