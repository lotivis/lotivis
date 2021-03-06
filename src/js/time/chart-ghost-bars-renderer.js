import {log_debug} from "../shared/debug";

export class ChartGhostBarsRenderer {

  constructor(timeChart) {

    this.hideAll = function () {
      timeChart.svg
        .selectAll('.ghost-rect')
        .transition()
        .attr("opacity", 0);
    };

    function createID(date) {
      return `ghost-rect-${String(date).replaceAll('.', '-')}`;
    }

    this.onMouseEnter = function (event, date) {
      log_debug('onMouseEnter');

      this.hideAll();
      let controller = timeChart.datasetController;
      let id = createID(date);

      timeChart.updateSensible = false;
      controller.setDatesFilter([date]);
      timeChart.updateSensible = true;
      timeChart
        .svg
        .select(`#${id}`)
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
        .attr("id", date => createID(date))
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
