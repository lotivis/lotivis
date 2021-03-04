import {hashCode} from "../shared/hash";

export class PlotBarsRenderer {

  constructor(plotChart) {

    /**
     *
     */
    this.renderBars = function () {
      let datasets = plotChart.workingDatasets;

      this.max = d3.max(datasets, function (dataset) {
        return d3.max(dataset.data, function (item) {
          return item.value;
        });
      });

      this.defs = plotChart.svg.append("defs");
      for (let index = 0; index < datasets.length; index++) {
        let dataset = datasets[index];
        this.createGradient(dataset);
      }

      let radius = 6;

      plotChart.barsData = plotChart.svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      plotChart.bars = plotChart.barsData
        .append("rect")
        .attr("fill", (d) => `url(#${this.createIDFromDataset(d)})`)
        .style("stroke", 'gray')
        .style("stroke-width", 0.4)
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => plotChart.xChart(d.earliestDate || 0))
        .attr("y", (d) => plotChart.yChart(d.label) + 1)
        .attr("height", plotChart.yChart.bandwidth() - 2)
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .on('mouseenter', plotChart.tooltipRenderer.showTooltip.bind(plotChart))
        .on('mouseout', plotChart.tooltipRenderer.hideTooltip.bind(plotChart))
        .on('click', plotChart.onClick.bind(this))
        .attr("width", function (data) {
          if (!data.earliestDate || !data.latestDate) return 0;
          return plotChart.xChart(data.latestDate) - plotChart.xChart(data.earliestDate) + plotChart.xChart.bandwidth();
        }.bind(this));

      plotChart.labels = plotChart.barsData
        .append('g')
        .attr('transform', `translate(0,${(plotChart.yChart.bandwidth() / 2) + 4})`)
        .append('text')
        .attr("id", (d) => 'rect-' + hashCode(d.label))
        .attr("fill", 'black')
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .attr('class', 'map-label')
        .attr('opacity', plotChart.isShowLabels ? 1 : 0)
        .attr("x", function (d) {
          let rectX = plotChart.xChart(d.earliestDate);
          let offset = plotChart.xChart.bandwidth() / 2;
          return rectX + offset;
        })
        .attr("y", (d) => plotChart.yChart(d.label))
        .attr("width", (d) => plotChart.xChart(d.latestDate) - plotChart.xChart(d.earliestDate) + plotChart.xChart.bandwidth())
        .text(function (dataset) {
          return `${dataset.duration} years, ${dataset.sum} items`;
        });
    };

    this.createGradient = function (dataset) {

      let gradient = this.defs
        .append("linearGradient")
        .attr("id", this.createIDFromDataset(dataset))
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      let data = dataset.data;
      let count = data.length;
      let firstDate = dataset.earliestDate;
      let lastDate = dataset.latestDate;
      let timespan = lastDate - firstDate;
      let colorInterpolator = d3.interpolateRgb(
        plotChart.configuration.lowColor,
        plotChart.configuration.highColor
      );

      if (firstDate === lastDate) {

        if (!data || data.length === 0) {
          return;
        }

        let item = data[0];
        let value = item.value;
        let opacity = value / this.max;

        gradient
          .append("stop")
          .attr("offset", `100%`)
          .attr("stop-color", colorInterpolator(opacity));

      } else {

        for (let index = 0; index < count; index++) {

          let item = data[index];
          let date = item.date;
          let opacity = item.value / this.max;

          let dateDifference = lastDate - date;
          let datePercentage = (1 - (dateDifference / timespan)) * 100;

          gradient
            .append("stop")
            .attr("offset", `${datePercentage}%`)
            .attr("stop-color", colorInterpolator(opacity));

        }
      }
    };

    this.createIDFromDataset = function (dataset) {
      return hashCode(dataset.label);
    };
  }
}
