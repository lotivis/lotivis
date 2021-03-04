import {Component} from '../components/component';
import {Color} from '../shared/colors';
import {combineByLocation, combineByStacks} from '../data-juggle/dataset-combine';
import {removeFeatures} from "../geojson/remove-features";
import {MapTooltipRenderer} from "./map-tooltip-renderer";
import {MapLegendRenderer} from "./map-legend-renderer";
import {MapLabelRenderer} from "./map-label-renderer";
import {MapDatasetRenderer} from "./map-dataset-renderer";
import {FilterableDatasetController} from "../data/filterable-dataset-controller";
import {log_debug} from "../shared/debug";
import {MapGeoJsonRenderer} from "./map-geojson-renderer";

/**
 * A component which renders a geo json with d3.
 *
 * @class MapChart
 * @extends Component
 */
export class MapChart extends Component {

  /**
   * Creates a new instance of MapChart.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = parent
      .append('div')
      .attr('id', this.selector);

    this.initialize();
    this.renderSVG();
    this.labelRenderer = new MapLabelRenderer(this);
    this.legendRenderer = new MapLegendRenderer(this);
    this.tooltipRenderer = new MapTooltipRenderer(this);
    this.datasetRenderer = new MapDatasetRenderer(this);
  }

  /**
   * Initialize with default values.
   */
  initialize() {
    this.width = 1000;
    this.height = 1000;

    this.tintColor = Color.defaultTint.rgbString();
    this.isShowLabels = true;
    this.geoJSON = null;
    this.departmentsData = [];
    this.excludedFeatureCodes = [];
    this.updateSensible = true;

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
      .attr('id', 'map')
      .classed('map', true)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    this.background = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white')

    // create a background rectangle for receiving mouse enter events
    // in order to reset the location data filter.
    this.background
      .on('mouseenter', function (event) {
        let controller = this.datasetController;
        let filters = controller.locationFilters;
        if (!filters || filters.length === 0) return;
        this.updateSensible = false;
        controller.setLocationsFilter([])
        this.updateSensible = true;
      }.bind(this))
  }

  /**
   * Sets the size of the projection to fit the given geo json.
   *
   * @param geoJSON
   */
  zoomTo(geoJSON) {
    this.projection.fitSize([this.width, this.height], geoJSON);
  }

  /**
   *
   * @param event
   * @param feature
   */
  onSelectFeature(event, feature) {
    if (!feature || !feature.properties) return;
    let locationID = feature.properties.code;
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
    this.presentedGeoJSON = removeFeatures(this.geoJSON, this.excludedFeatureCodes);
    this.zoomTo(this.geoJSON);
    this.geoJSONRenderer = new MapGeoJsonRenderer(this);
    this.geoJSONRenderer.renderGeoJson();
  }

  /**
   *
   * @param newDatasets
   */
  set datasets(newDatasets) {
    this.setDatasetController(new FilterableDatasetController(newDatasets));
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
    const combinedByStack = combineByStacks(this.datasetController.enabledFlatData);
    this.combinedData = combineByLocation(combinedByStack);
    this.legendRenderer.renderDatasetsLegend();
    this.datasetRenderer.renderDatasets();
    this.labelRenderer.renderDatasetLabels()
    this.tooltipRenderer.raise();
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
