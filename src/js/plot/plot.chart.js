import * as d3 from "d3";
import { Chart } from "../common/chart.js";
import {
  PLOT_CHART_CONFIG,
  PLOT_CHART_SORT,
  PLOT_CHART_TYPE,
} from "./plot.config";
import { PlotAxisRenderer } from "./plot.axis";
import { PlotTooltipRenderer } from "./plot.tooltip";
import { PlotLabelRenderer } from "./plot.labels.gradient";
import { PlotGridRenderer } from "./plot.grid";
import { PlotBackgroundRenderer } from "./plot.background";
import { PlotHoverBarsRenderer } from "./plot.hover.bars";
import { PlotBarsFractionsRenderer } from "./plot.bars.fraction";
import { PlotBarsGradientRenderer } from "./plot.bars.gradient";
import { PlotLabelsFractionsRenderer } from "./plot.labels.fractions";
import { PlotChartSelectionRenderer } from "./plot.selection";
import { dataViewPlot } from "./plot.data.view.js";

export class PlotChart extends Chart {
  static Type = PLOT_CHART_TYPE;
  static Sort = PLOT_CHART_SORT;

  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, PLOT_CHART_CONFIG.margin);
    margin = Object.assign(margin, this.config.margin);

    let config = Object.assign({}, PLOT_CHART_CONFIG);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;
  }

  addRenderers() {
    this.renderers.push(new PlotBackgroundRenderer());
    this.renderers.push(new PlotAxisRenderer());
    this.renderers.push(new PlotGridRenderer());
    this.renderers.push(new PlotChartSelectionRenderer());
    this.renderers.push(new PlotHoverBarsRenderer());
    this.renderers.push(new PlotBarsFractionsRenderer());
    this.renderers.push(new PlotBarsGradientRenderer());
    this.renderers.push(new PlotLabelRenderer());
    this.renderers.push(new PlotLabelsFractionsRenderer());
    this.renderers.push(new PlotTooltipRenderer());
  }

  createDataView() {
    return dataViewPlot(this.controller);
  }

  prepare() {
    this.svg
      .classed("ltv-plot-chart-svg", true)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);

    this.sortDatasets();

    let margin = this.config.margin;
    let barsCount = this.dataView.labels.length || 0;

    this.graphWidth = this.config.width - margin.left - margin.right;
    this.graphHeight = barsCount * this.config.lineHeight;
    this.height = this.graphHeight + margin.top + margin.bottom;
    this.preferredHeight = this.height;

    this.svg.attr(
      "viewBox",
      `0 0 ${this.config.width} ${this.preferredHeight}`
    );

    this.createScales();
  }

  createScales() {
    let dates = this.config.dates || this.config.dates || this.dataView.dates;
    let labels = this.dataView.labels || [];

    this.xChart = d3
      .scaleBand()
      .domain(dates)
      .rangeRound([
        this.config.margin.left,
        this.config.width - this.config.margin.right,
      ])
      .paddingInner(0.1);

    this.yChartPadding = d3
      .scaleBand()
      .domain(labels)
      .rangeRound([
        this.height - this.config.margin.bottom,
        this.config.margin.top,
      ])
      .paddingInner(0.1);

    this.yChart = d3
      .scaleBand()
      .domain(labels)
      .rangeRound([
        this.height - this.config.margin.bottom,
        this.config.margin.top,
      ]);

    this.xAxisGrid = d3
      .axisBottom(this.xChart)
      .tickSize(-this.graphHeight)
      .tickFormat("");

    this.yAxisGrid = d3
      .axisLeft(this.yChart)
      .tickSize(-this.graphWidth)
      .tickFormat("");
  }

  sortDatasets() {
    // console.log("this.dataView", this.dataView);
    let datasets = this.dataView.datasets;
    let sortedDatasets = [];
    switch (this.config.sort) {
      case PLOT_CHART_SORT.alphabetically:
        sortedDatasets = datasets.sort((set1, set2) => set1.label > set2.label);
        break;
      case PLOT_CHART_SORT.duration:
        sortedDatasets = datasets.sort(
          (set1, set2) => set1.duration < set2.duration
        );
        break;
      case PLOT_CHART_SORT.intensity:
        sortedDatasets = datasets.sort((set1, set2) => set1.sum < set2.sum);
        break;
      case PLOT_CHART_SORT.firstDate:
        sortedDatasets = datasets.sort(
          (set1, set2) => set1.firstDate > set2.firstDate
        );
        break;
      default:
        sortedDatasets = datasets;
        break;
    }

    this.dataView.labels = sortedDatasets
      .map((dataset) => String(dataset.label))
      .reverse();
    this.dataView.datasetsSorted = this.dataView.labels;
  }
}
