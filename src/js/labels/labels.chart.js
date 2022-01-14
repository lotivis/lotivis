import * as d3 from "d3";
import { Chart } from "../common/chart.js";
import { LABELS_CHART_CONFIG } from "./labels.config.js";
import { LabelsLabelsRenderer } from "./labels.labels.js";
import { DataViewLabels } from "./labels.data.view.js";

export class LabelsChart extends Chart {
  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, LABELS_CHART_CONFIG.margin);
    margin = Object.assign(margin, this.config.margin);

    let config = Object.assign({}, LABELS_CHART_CONFIG);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;
  }

  appendRenderers() {
    this.renderers.push(new LabelsLabelsRenderer());
  }

  createDataView() {
    return DataViewLabels(this.controller.data);
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
