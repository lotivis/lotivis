import * as d3 from "d3";
import { Chart } from "../common/chart.js";
import { MAP_CHART_CONFIG } from "./map.chart.config";
import { removeFeatures } from "../geojson/remove.features";
import { createGeoJSON } from "../geojson/from.data";
import { GeoJSON } from "../geojson/geojson";
import { MapBackgroundRenderer } from "./map.background";
import { MapGeojsonRenderer } from "./map.geojson.js";
import { MapExteriorBorderRenderer } from "./map.exterior.border";
import { MapLegendRenderer } from "./map.legend.js";
import { MapDatasetRenderer } from "./map.dataset";
import { MapLabelsRenderer } from "./map.labels";
import { MapTooltipRenderer } from "./map.tooltip";
import { MapSelectionRenderer } from "./map.selection";
import { dataViewMap } from "./data.view.map.js";

export class MapChart extends Chart {
  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, MAP_CHART_CONFIG.margin);
    margin = Object.assign(margin, theConfig.margin || {});

    let config = Object.assign({}, MAP_CHART_CONFIG);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;

    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);
  }

  appendRenderers() {
    this.renderers.push(new MapBackgroundRenderer());
    this.renderers.push(new MapExteriorBorderRenderer());
    this.renderers.push(new MapGeojsonRenderer());
    this.renderers.push(new MapDatasetRenderer());
    this.renderers.push(new MapLegendRenderer());
    this.renderers.push(new MapLabelsRenderer());
    this.renderers.push(new MapTooltipRenderer());
    this.renderers.push(new MapSelectionRenderer());
  }

  prepare() {
    this.svg
      .classed("ltv-map-chart-svg", true)
      .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);

    if (this.geoJSON) return;
    let geoJSON = createGeoJSON(this.controller.data);
    this.setGeoJSON(geoJSON);
  }

  createDataView() {
    return dataViewMap(this.controller.data);
  }

  zoomTo(geoJSON) {
    this.projection.fitSize(
      [this.config.width - 20, this.config.height - 20],
      geoJSON
    );
  }

  setGeoJSON(newGeoJSON) {
    if (typeof newGeoJSON === "object" && newGeoJSON.prototype === "GeoJSON") {
      this.geoJSON = newGeoJSON;
    } else {
      this.geoJSON = new GeoJSON(newGeoJSON);
    }
    this.presentedGeoJSON = this.geoJSON;
    this.geoJSONDidChange();
  }

  geoJSONDidChange() {
    if (!this.geoJSON) return;
    // precalculate the center of each feature
    this.geoJSON.features.forEach((f) => (f.center = d3.geoCentroid(f)));

    if (this.config.excludedFeatureCodes) {
      this.presentedGeoJSON = removeFeatures(
        this.geoJSON,
        this.config.excludedFeatureCodes
      );
    }

    // precalculate lotivis feature ids
    let feature, id;
    for (let i = 0; i < this.presentedGeoJSON.features.length; i++) {
      feature = this.presentedGeoJSON.features[i];
      id = this.config.featureIDAccessor(feature);
      this.presentedGeoJSON.features[i].lotivisId = id;
    }

    this.zoomTo(this.geoJSON);
    this.update(this.controller, "geojson");
  }
}
