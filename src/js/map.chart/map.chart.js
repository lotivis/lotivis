import {Chart} from '../chart/chart';
import {removeFeatures} from "../geojson/remove.features";
import {MapTooltipRenderer} from "./map.tooltip.renderer";
import {MapLegendRenderer} from "./map.legend.renderer";
import {MapLabelRenderer} from "./map.label.renderer";
import {MapDatasetRenderer} from "./map.dataset.renderer";
import {MapGeoJSONRenderer} from "./map.geojson.renderer";
import {MapExteriorBorderRenderer} from "./map.exterior.border.renderer";
import {createGeoJSON} from "../geojson/create.geojson";
import {MapSelectionBoundsRenderer} from "./map.selection.bounds.renderer";
import {MapChartConfig} from "./map.chart.config";
import {MapBackgroundRenderer} from "./map.background.renderer";
import {GeoJson} from "../geojson/geojson";
import {MapSelectionRenderer} from "./map.selection.renderer";
import {lotivis_log} from "../shared/debug";

/**
 * A component which renders a GeoJSON with d3.
 * @class MapChart
 * @extends Chart
 */
export class MapChart extends Chart {

  /**
   * Creates a new instance of MapChart.
   * @param parent The parental component.
   * @param config The configuration of the map.chart chart.
   */
  constructor(parent, config) {
    super(parent, config);
    // empty. constructor defined for documentation.
  }

  /**
   * Initialize with default values.
   */
  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, MapChartConfig.margin);
    margin = Object.assign(margin, theConfig.margin || {});

    let config = Object.assign({}, MapChartConfig);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;

    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);

    this.initializeRenderers();
  }

  initializeRenderers() {
    this.backgroundRenderer = new MapBackgroundRenderer(this);
    this.geoJSONRenderer = new MapGeoJSONRenderer(this);
    this.datasetRenderer = new MapDatasetRenderer(this);
    this.exteriorBorderRenderer = new MapExteriorBorderRenderer(this);
    this.labelRenderer = new MapLabelRenderer(this);
    this.legendRenderer = new MapLegendRenderer(this);
    this.selectionBoundsRenderer = new MapSelectionBoundsRenderer(this);
    this.selectionRenderer = new MapSelectionRenderer(this);
    this.tooltipRenderer = new MapTooltipRenderer(this);
  }

  remove() {
    if (!this.svg) return;
    this.svg.remove();
  }

  precalculate() {
    this.renderSVG();
    if (!this.datasetController) return;
    this.dataview = this.datasetController.getLocationDataview();
    if (this.geoJSON) return;
    let geoJSON = createGeoJSON(this.datasetController.datasets);
    this.setGeoJSON(geoJSON);
  }

  draw() {
    lotivis_log('[lotivis] ', this.constructor.name, 'draw');
    if (!this.geoJSON) {
      return lotivis_log('[lotivis]  No GeoJSON to render.');
    }
    this.backgroundRenderer.render();
    this.exteriorBorderRenderer.render();
    this.geoJSONRenderer.render();
    this.legendRenderer.render();
    this.datasetRenderer.render();
    this.labelRenderer.render();
    this.tooltipRenderer.raise();
    this.selectionBoundsRenderer.render();
    this.selectionBoundsRenderer.raise();
    this.selectionRenderer.render();
  }

  /**
   *
   */
  renderSVG() {
    this.svg = this.element
      .append('svg')
      .attr('id', this.svgSelector)
      .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
  }

  /**
   * Sets the size of the projection to fit the given geo json.
   * @param geoJSON
   */
  zoomTo(geoJSON) {
    this.projection.fitSize([this.config.width, this.config.height], geoJSON);
  }

  /**
   * Tells this map.chart chart that the given feature was selected with the mouse.
   * @param event The mouse event.
   * @param feature The feature.
   */
  onSelectFeature(event, feature) {


  }

  /**
   * Sets the presented geo json.
   * @param newGeoJSON
   */
  setGeoJSON(newGeoJSON) {
    if (typeof newGeoJSON === 'object' && newGeoJSON.prototype === 'GeoJSON') {
      this.geoJSON = newGeoJSON;
    } else {
      this.geoJSON = new GeoJson(newGeoJSON);
    }
    this.presentedGeoJSON = this.geoJSON;
    this.geoJSONDidChange();
  }

  /**
   * Tells the receiving map.chart chart that its `geoJSON` property did change.
   */
  geoJSONDidChange() {
    if (!this.geoJSON) return;
    // precalculate the center of each feature
    this.geoJSON.features.forEach((feature) => feature.center = d3.geoCentroid(feature));

    if (this.config.excludedFeatureCodes) {
      this.presentedGeoJSON = removeFeatures(this.geoJSON, this.config.excludedFeatureCodes);
    }

    // precalculate lotivis feature ids

    let feature;
    for (let i = 0; i < this.presentedGeoJSON.features.length; i++) {
      feature = this.presentedGeoJSON.features[i];
      this.presentedGeoJSON.features[i].lotivisId = this.config.featureIDAccessor(feature);
    }

    this.zoomTo(this.geoJSON);
    this.draw();

    // this.backgroundRenderer.render();
    // this.exteriorBorderRenderer.render();
    // this.geoJSONRenderer.render();
  }
}
