import * as d3 from "d3";
import { Chart } from "../common/chart.js";
import { BAR_CHART_CONFIG, BAR_CHART_TYPE } from "./bar.config";
import { BarAxisRender } from "./bar.axis";
import { BarLabelsRenderer } from "./bar.labels";
import { BarLegendRenderer } from "./bar.legend";
import { BarBarsRenderer } from "./bar.bars";
import { BarTooltipRenderer } from "./bar.tooltip";
import { BarSelectionRenderer } from "./bar.selection";
import { BarHoverRenderer } from "./bar.bars.hover";
import { BarGridRenderer } from "./bar.grid.js";
import { BarBackgroundRenderer } from "./bar.background.js";
import { dataViewBar } from "./bar.data.view.js";

export class BarChart extends Chart {
  static Type = BAR_CHART_TYPE;

  initialize() {
    let margin, config;
    margin = Object.assign({}, BAR_CHART_CONFIG.margin);
    margin = Object.assign(margin, this.config.margin);
    config = Object.assign({}, BAR_CHART_CONFIG);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;
  }

  addRenderers() {
    this.renderers.push(new BarBackgroundRenderer());
    this.renderers.push(new BarAxisRender());
    this.renderers.push(new BarGridRenderer());
    this.renderers.push(new BarSelectionRenderer());
    this.renderers.push(new BarHoverRenderer());
    this.renderers.push(new BarBarsRenderer());
    this.renderers.push(new BarLabelsRenderer());
    this.renderers.push(new BarTooltipRenderer());
    this.renderers.push(new BarLegendRenderer());
  }

  createDataView() {
    return dataViewBar(this.controller);
  }

  prepare() {
    this.svg
      .attr("class", "ltv-bar-chart-svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);

    let config = this.config;
    let margin = config.margin;
    this.graphWidth = config.width - margin.left - margin.right;
    this.graphHeight = config.height - margin.top - margin.bottom;

    this.dataView = this.createDataView();
    this.createScales();
  }

  draw() {
    this.graph = this.svg
      .append("g")
      .attr("width", this.graphWidth)
      .attr("height", this.graphHeight)
      .attr(
        "transform",
        `translate(${this.config.margin.left},${this.config.margin.top})`
      );
    this.renderers.forEach((r) =>
      r.render(this, this.controller, this.dataView)
    );
  }

  createScales() {
    if (!this.dataView) return;

    let config = this.config;
    let margin = config.margin;

    /*
     * Prefer dates specified by configuration. Fallback to dates of datasets.
     */
    let dates = config.dates || this.dataView.dates;
    let stacks = this.dataView.enabledStacks;

    let dateAccess = config.dateAccess;
    dates = dates.sort((a, b) => dateAccess(a) - dateAccess(b));

    this.xChartScale = d3
      .scaleBand()
      .domain(dates)
      .rangeRound([margin.left, config.width - margin.right]);

    this.xChartScalePadding = d3
      .scaleBand()
      .domain(dates)
      .rangeRound([margin.left, config.width - margin.right])
      .paddingInner(0.2);

    this.xStack = d3
      .scaleBand()
      .domain(stacks)
      .rangeRound([0, this.xChartScale.bandwidth()])
      .padding(0.05);

    this.yChart = d3
      .scaleLinear()
      .domain([0, this.dataView.maxTotal])
      .nice()
      .rangeRound([config.height - margin.bottom, margin.top]);
  }
}
