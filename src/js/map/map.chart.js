import {Chart} from '../components/chart';
import {combineByLocation, combineByStacks} from '../data-juggle/dataset.combine';
import {removeFeatures} from "../geojson-juggle/remove.features";
import {MapTooltipRenderer} from "./map.tooltip.renderer";
import {MapLegendRenderer} from "./map.legend.renderer";
import {MapLabelRenderer} from "./map.label.renderer";
import {MapDatasetRenderer} from "./map.dataset.renderer";
import {MapGeojsonRenderer} from "./map.geojson.renderer";
import {MapExteriorBorderRenderer} from "./map.exterior.border.renderer";
import {createGeoJSON} from "../geojson-juggle/create.geojson";
import {MapMinimapRenderer} from "./map.minimap.renderer";
import {MapSelectionBoundsRenderer} from "./map.selection.bounds.renderer";
import {defaultMapChartConfig} from "./map.chart.config";
import {DatasetsController} from "../data/datasets.controller";
import {MapBackgroundRenderer} from "./map.background.renderer";

/**
 * A component which renders a geo json with d3.
 *
 * @class MapChart
 * @extends Chart
 */
export class MapChart extends Chart {

  /**
   * Creates a new instance of MapChart.
   *
   * @param parent The parental component.
   * @param config The configuration of the map chart.
   */
  constructor(parent, config) {
    super(parent, config);
    this.element = parent
      .append('div')
      .attr('id', this.selector);

    this.initialize();
    this.renderSVG();
    this.backgroundRenderer = new MapBackgroundRenderer(this);
    this.geoJSONRenderer = new MapGeojsonRenderer(this);
    this.datasetRenderer = new MapDatasetRenderer(this);
    this.exteriorBorderRenderer = new MapExteriorBorderRenderer(this);
    this.minimapRenderer = new MapMinimapRenderer(this);
    this.labelRenderer = new MapLabelRenderer(this);
    this.legendRenderer = new MapLegendRenderer(this);
    this.selectionBoundsRenderer = new MapSelectionBoundsRenderer(this);
    this.tooltipRenderer = new MapTooltipRenderer(this);
  }

  /**
   * Initialize with default values.
   */
  initialize() {
    let theConfig = this.config;
    let margin;
    margin = Object.assign({}, defaultMapChartConfig.margin);
    margin = Object.assign(margin, theConfig.margin || {});

    let config = Object.assign({}, defaultMapChartConfig);
    this.config = Object.assign(config, this.config);
    this.config.margin = margin;

    this.projection = d3.geoMercator();
    this.path = d3.geoPath().projection(this.projection);
  }

  /**
   * Tells the receiving map chart to update its view.
   */
  update() {
    if (!this.updateSensible) return;
    this.geoJSONDidChange();
    this.datasetsDidChange();
  }

  /**
   *
   */
  renderSVG() {
    this.svg = d3
      .select(`#${this.selector}`)
      .append('svg')
      .attr('id', this.svgSelector)
      .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
  }

  /**
   * Sets the size of the projection to fit the given geo json.
   *
   * @param geoJSON
   */
  zoomTo(geoJSON) {
    this.projection.fitSize([this.config.width, this.config.height], geoJSON);
  }

  /**
   *
   * @param event
   * @param feature
   */
  onSelectFeature(event, feature) {
    if (!feature || !feature.properties) return;
    if (!this.datasetController) return;
    let locationID = this.config.featureIDAccessor(feature);
    this.updateSensible = false;
    this.datasetController.setLocationsFilter([locationID]);
    this.updateSensible = true;
  }

  /**
   * Sets the presented geo json.
   *
   * @param newGeoJSON
   */
  setGeoJSON(newGeoJSON) {
    this.geoJSON = newGeoJSON;
    this.presentedGeoJSON = newGeoJSON;
    this.geoJSONDidChange();
  }

  /**
   * Tells the receiving map chart that its `geoJSON` property did change.
   */
  geoJSONDidChange() {
    if (!this.geoJSON) return;
    // precalculate the center of each feature
    this.geoJSON.features.forEach((feature) => feature.center = d3.geoCentroid(feature));
    this.presentedGeoJSON = removeFeatures(this.geoJSON, this.config.excludedFeatureCodes);
    this.zoomTo(this.geoJSON);
    this.exteriorBorderRenderer.render();
    this.geoJSONRenderer.renderGeoJson();
  }

  /**
   * Sets the datasets of this map chart.
   * @param newDatasets The new dataset.
   */
  set datasets(newDatasets) {
    this.setDatasetController(new DatasetsController(newDatasets));
  }

  /**
   *
   * @returns {*}
   */
  get datasets() {
    if (!this.datasetController) return [];
    return this.datasetController.datasets;
  }

  /**
   * Tells the receiving map chart that its `datasets` property did change.
   */
  datasetsDidChange() {
    if (!this.datasetController) return;
    const combinedByStack = combineByStacks(this.datasetController.enabledFlatData());
    this.combinedData = combineByLocation(combinedByStack);

    this.svg.remove();
    this.renderSVG();

    if (!this.geoJSON) {
      this.geoJSON = createGeoJSON(this.datasetController.workingDatasets);
      this.geoJSONDidChange();
    }

    this.exteriorBorderRenderer.render();
    this.geoJSONRenderer.renderGeoJson();
    this.tooltipRenderer.raise();
    this.legendRenderer.render();
    this.datasetRenderer.render();
    this.labelRenderer.render();
    this.minimapRenderer.render();
    this.tooltipRenderer.raise();
    this.selectionBoundsRenderer.raise();
  }

  /**
   *
   * @param newController
   */
  setDatasetController(newController) {
    this.datasetController = newController;
    this.datasetController.addListener(this);
    this.datasetsDidChange();
  }
}
