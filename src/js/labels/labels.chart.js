import { Chart } from "../common/chart.js";
import { DataViewLabels } from "./labels.data.view.js";
import { LABELS_CHART_CONFIG } from "./labels.chart.config.js";
import { LabelsFlowingRenderer } from "./labels.flowing.js";
import { LabelsGroupedRenderer } from "./labels.lines.js";

export class LabelsChart extends Chart {
  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, LABELS_CHART_CONFIG.margin);
    margin = Object.assign(margin, theConfig.margin || {});

    let config = Object.assign({}, LABELS_CHART_CONFIG);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;
  }

  addRenderers() {
    this.renderers.push(new LabelsFlowingRenderer());
    this.renderers.push(new LabelsGroupedRenderer());
  }

  createDataView() {
    return DataViewLabels(this.controller);
  }

  createSVG() {
    this.div = this.element
      .append("div")
      .attr("id", this.svgSelector)
      .attr("class", "ltv-chart-div");
  }

  remove() {
    this.listeners = {};
    this.div.selectAll("*").remove();
  }
}
