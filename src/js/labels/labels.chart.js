import * as d3 from "d3";
import { Chart } from "../common/chart.js";
import { LabelsLabelsRenderer } from "./labels.labels.js";
import { DataViewLabels } from "./labels.data.view.js";

export class LabelsChart extends Chart {
  initialize() {}

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
