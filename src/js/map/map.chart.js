import {Chart} from '../components/chart';
import {combineByLocation, combineByStacks} from '../data-juggle/dataset.combine';
import {removeFeatures} from "../geojson-juggle/remove.features";
import {MapTooltipRenderer} from "./map.tooltip.renderer";
import {MapLegendRenderer} from "./map.legend.renderer";
import {MapLabelRenderer} from "./map.label.renderer";
import {MapDatasetRenderer} from "./map.dataset.renderer";
import {DatasetsControllerFilter} from "../data/datasets.controller.filter";
import {MapGeojsonRenderer} from "./map.geojson.renderer";
import {MapExteriorBorderRenderer} from "./map.exterior.border.renderer";
import {createGeoJSON} from "../geojson-juggle/create.geojson";
import {MapMinimapRenderer} from "./map.minimap.renderer";
import {hashCode} from "../shared/hash";
import {MapSelectionBoundsRenderer} from "./map.selection.bounds.renderer";

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
    this.geoJSONRenderer = new MapGeojsonRenderer(this);
    this.datasetRenderer = new MapDatasetRenderer(this);
    this.exteriorBorderRenderer = new MapExteriorBorderRenderer(this);
    this.minimapRenderer = new MapMinimapRenderer(this);
    this.tooltipRenderer = new MapTooltipRenderer(this);
    this.selectionBoundsRenderer = new MapSelectionBoundsRenderer(this);
  }

  /**
   * Initialize with default values.
   */
  initialize() {
    this.width = 1000;
    this.height = 1000;

    this.isShowLabels = true;
    this.geoJSON = null;
    this.departmentsData = [];
    this.excludedFeatureCodes = [];
    this.updateSensible = true;
    this.drawRectangleAroundSelection = true;

    this.featureIDAccessor = function (feature) {
      if (feature.id) return feature.id;
      if (feature.properties && feature.properties.id) return feature.properties.id;
      if (feature.properties && feature.properties.code) return feature.properties.code;
      return hashCode(feature.properties);
    };

    this.featureNameAccessor = function (feature) {
      if (feature.name) return feature.name;
      if (feature.properties && feature.properties.name) return feature.properties.name;
      if (feature.properties && feature.properties.nom) return feature.properties.nom;
      return 'Unknown';
    };

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
      .attr('class', 'lotivis-chart-svg lotivis-map')
      // .style('width', this.width)
      // .style('height', this.height);
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    this.background = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white');

    // create a background rectangle for receiving mouse enter events
    // in order to reset the location data filter.
    this.background
      .on('mouseenter', function () {
        let controller = this.datasetController;
        if (!controller) return;
        let filters = controller.locationFilters;
        if (!filters || filters.length === 0) return;
        this.updateSensible = false;
        controller.setLocationsFilter([]);
        this.updateSensible = true;
      }.bind(this));
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
    if (!this.datasetController) return;
    let locationID = this.featureIDAccessor(feature);
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
    this.exteriorBorderRenderer.render();
    this.geoJSONRenderer.renderGeoJson();
  }

  /**
   *
   * @param newDatasets
   */
  set datasets(newDatasets) {
    this.setDatasetController(new DatasetsControllerFilter(newDatasets));
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
