import * as d3 from "d3";
import { LOTIVIS_CONFIG } from "../common/config";
import { lotivis_log } from "../common/debug";
import { Renderer } from "../common/renderer";

export class MapLabelsRenderer extends Renderer {
  render(chart, controller, dataView) {
    if (!chart.geoJSON) return lotivis_log(`[lotivis]  No GeoJSON to render.`);
    if (!dataView) return;
    if (!chart.config.labels) return;

    let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;

    function raise() {
      chart.svg.selectAll(".ltv-map-chart-label").raise();
    }

    chart.addListener("mouseenter", raise);

    chart.svg.selectAll(".ltv-map-chart-label").remove();
    chart.svg
      .selectAll("text")
      .data(chart.geoJSON.features)
      .enter()
      .append("text")
      .attr("class", "ltv-map-chart-label")
      .text((f) => {
        let featureID = chart.config.featureIDAccessor(f);
        let data = dataView.byLocationLabel.get(featureID);
        if (!data) return "";
        let labels = Array.from(data.keys());
        let values = labels.map((label) => data.get(label));
        let sum = d3.sum(values);
        if (sum === 0) return "";
        return numberFormat(sum);
      })
      .attr("x", (f) => chart.projection(f.center)[0])
      .attr("y", (f) => chart.projection(f.center)[1]);
  }
}
