import {Component} from '../components/component';
import {GeoJson} from '../geojson/geojson';
import {Color} from '../shared/colors';
import { combine } from '../data-juggle/dataset-combine';
import {log_debug} from "../shared/debug";
import {formatNumber} from "../shared/format";
import {flatDatasets} from "../data-juggle/dataset-flat";

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
    this.initializeProjection();
    this.initializePath();

    this.renderSVG();
    this.renderMapBackground();
    this.renderTooltipContainer();
    this.renderLegend();
  }

  // MARK: - Initialize

  /**
   * Initialize with default values.
   */
  initialize() {
    this.width = 1000;
    this.height = 1000;

    this.tintColor = Color.defaultTint.rgbString();
    this.backgroundColor = 'white';
    this.backgroundOpacity = 0.2;

    this.isDrawsBackground = true;
    // this.isZoomable = true;
    this.isShowLabels = true;

    this.datasets = [];
    this.geoJSON = null;
    this.departmentsData = [];
    this.excludedFeatureCodes = [];
  }

  /**
   * Initializes a mercator projection.
   */
  initializeProjection() {
    this.projection = d3.geoMercator(); //.geoAlbers().rotate(30);
  }

  /**
   * Initializes a geo path.
   */
  initializePath() {
    this.path = d3.geoPath().projection(this.projection);
  }


  // MARK: - Inject

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

    // .call(d3.zoom().on('zoom', function (event) {
    //     if (!this.isZoomable) return;
    //     this.svg.selectAll('path').attr('transform', event.transform);
    //     this.svg.selectAll('text').attr('transform', event.transform);
    // }.bind(this)));
  }

  /**
   * Appends a rectangle to the svg which can be used as background.
   */
  renderMapBackground() {
    this.background = this.svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', this.backgroundColor)
      .attr('fill-opacity', function () {
        return this.isDrawsBackground ? this.backgroundOpacity : 0;
      }.bind(this));
  }

  /**
   * Appends a division to the svg.
   */
  renderTooltipContainer() {
    let color = this.tintColor;
    this.tooltip = this.element
      .append('div')
      .attr('class', 'map-tooltip')
      .attr('rx', 5) // corner radius
      .attr('ry', 5)
      .style('position', 'absolute')
      .style('color', 'black')
      .style('border', function () {
        return `solid 1px ${color}`;
      })
      .style('opacity', 0);

    this.bounds = this.svg
      .append('rect')
      .attr('class', 'bounds')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('fill-opacity', 0)
      .style('stroke', 'red')
      .style('stroke-width', '0.7px')
      .style('stroke-dasharray', '1,1');
  }

  renderLegend() {
    this.legend = this.svg
      .append('svg')
      .attr('class', 'legend')
      .attr('fill', 'red')
      .attr('width', this.width)
      .attr('height', 200)
      .attr('x', 0)
      .attr('y', 0);
  }


  // MARK: - Render

  /**
   * Renders the `geoJSON` property.
   */
  renderGeoJson() {
    let geoJSON = this.geoJSON;
    let projection = this.projection;

    // precalculate the center of each feature
    geoJSON.features.forEach(function (feature) {
      feature.center = d3.geoCentroid(feature);
      let code = feature.properties.code;
      if (!this.departmentsData || !this.departmentsData.length) return;
      feature.departmentsData = this.departmentsData.find(dataset => +dataset.departmentNumber === +code);
    }.bind(this));

    // let max = d3.max(this.departmentsData, data => data.value);
    let tooltip = this.tooltip;
    let boundsRectangle = this.bounds;
    // let tooltipWidth = String(this.tooltip.style('width') || 210).replace('px', '');
    let tintColor = this.tintColor;
    let thisReference = this;

    this.svg
      .selectAll('path')
      .data(geoJSON.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('id', feature => feature.properties.code)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.5)
      .attr('stroke', 'black')
      .attr('stroke-width', '0.7')
      .attr('stroke-dasharray', function (feature) {
        return feature.departmentsData ? '0' : '1,4';
      }.bind(this))
      .attr('cursor', 'pointer')
      .on('click', function (event, feature) {
        // this.zoomTo(feature);
      }.bind(this))
      .on('mouseenter', function (event, feature) {
        d3.select(this)
          .attr('stroke', () => tintColor)
          .attr('stroke-width', '2')
          .attr('stroke-dasharray', '0');


        // set tooltip content
        let properties = feature.properties;
        if (!properties) return;

        let code = properties.code;
        let propertiesSelection = Object.keys(properties);
        let components = propertiesSelection.map(function (propertyName) {
          return `${propertyName}: ${properties[propertyName]}`;
        });

        let flatData = flatDatasets(thisReference.datasets);
        let data = flatData.filter(item => +item.location === +code);

        if (data) {
          components.push('');
          for (let index = 0; index < data.length; index++) {
            let item = data[index];
            components.push(item.stack + ': ' + item.value);
          }
        }

        tooltip.html(components.join('<br>'));


        // position tooltip
        let tooltipWidth = Number(tooltip.style('width').replace('px', '') || 200);
        let tooltipHeight = Number(tooltip.style('height').replace('px', ''));
        tooltipWidth += 20;
        tooltipHeight += 20;

        let featureBounds = d3.geoBounds(feature);
        let featureLowerLeft = projection(featureBounds[0]);
        let featureUpperRight = projection(featureBounds[1]);
        let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];
        let featureBoundsHeight = featureLowerLeft[1] - featureUpperRight[1];

        // svg is presented in dynamic sized view box so we need to get the actual size
        // of the element in order to calculate a scale for the position of the tooltip.
        let effectiveSize = thisReference.getElementEffectiveSize();
        let factor = effectiveSize[0] / thisReference.width;
        let heightFactor = effectiveSize[1] / thisReference.height;

        // calculate offset
        let positionOffset = thisReference.getElementPosition();

        // calculate scaled position
        let top = 0;

        if ((featureLowerLeft[1] * heightFactor) > (effectiveSize[1] / 2)) {
          top += featureUpperRight[1];
          top *= factor;
          top -= tooltipHeight;
          top -= 5;
        } else {
          top += featureLowerLeft[1];
          top *= factor; // Use width factor instead of heightFactor for propert using. Can't figure out why width factor works better.
          top += 5;
        }

        top += positionOffset[1];

        // calculate tooltip center
        let centerBottom = featureLowerLeft[0];
        centerBottom += (featureBoundsWidth / 2);
        centerBottom *= factor;
        centerBottom -= (Number(tooltipWidth) / 2);
        centerBottom += positionOffset[0];

        tooltip.style('opacity', 1)
          .style('left', centerBottom + 'px')
          .style('top', top + 'px');

        boundsRectangle
          .style('opacity', 1)
          .style('width', featureBoundsWidth + 'px')
          .style('height', featureBoundsHeight + 'px')
          .style('x', featureLowerLeft[0])
          .style('y', featureUpperRight[1]);

      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke', 'black')
          .attr('stroke-width', '0.7')
          .attr('stroke-dasharray', function (feature) {
            return feature.departmentsData ? '0' : '1,4';
          });
        tooltip.style('opacity', 0);
        boundsRectangle.style('opacity', 0);
      });
  }

  /**
   * Iterates the datasets per stack and draws them on svg.
   */
  renderDatasets() {
    if (!this.geoJSON) return;
    if (!this.datasets) return;
    this.calculateAuxiliaryData();
    let stackNames = this.getStackNames();
    let combinedData = this.combinedData;

    // reset colors
    this.svg
      .selectAll('path')
      .attr('fill', 'white')
      .attr('fill-opacity', '.5');

    for (let index = 0; index < stackNames.length; index++) {
      let stackName = stackNames[index];
      let dataForStack = combinedData.filter(data => data.stack === stackName);
      log_debug('dataForStack', dataForStack);
      let max = d3.max(dataForStack, item => item.value);
      let color = Color.colorsForStack(index)[0];

      for (let index = 0; index < dataForStack.length; index++) {
        let datasetEntry = dataForStack[index];
        let id = +datasetEntry.location;
        this.svg
          .selectAll('path')
          .filter(item => +item.properties.code === id)
          .attr('fill', color.rgbString())
          .attr('fill-opacity', datasetEntry.value / max);
      }
    }
  }

  /**
   * Removes all labels.
   */
  removeDatasetLabels() {
    this.svg.selectAll('.map-label').remove();
  }

  /**
   * Appends labels from datasets.
   */
  renderDatasetLabels() {
    log_debug('renderDatasetLabels');
    log_debug(this.geoJSON);
    if (!this.geoJSON) return log_debug('no geoJSON');
    if (!this.datasets) return log_debug('no datasets');

    let geoJSON = this.geoJSON;
    let combinedData = this.combinedData;

    this.removeDatasetLabels();
    this.svg
      .selectAll('text')
      .data(geoJSON.features)
      .enter()
      .append('text')
      .attr('class', 'map-label')
      .attr('text-anchor', 'middle')
      .attr('fill', this.tintColor)
      .attr('font-size', 12)
      .attr('opacity', function () {
        return this.isShowLabels ? 1 : 0;
      }.bind(this))
      .text(function (feature) {
        let code = +feature.properties.code;
        let dataset = combinedData.find(dataset => +dataset.location === code);
        return dataset ? formatNumber(dataset.value) : '';
      })
      .attr('x', function (feature) {
        return this.projection(feature.center)[0];
      }.bind(this))
      .attr('y', function (feature) {
        return this.projection(feature.center)[1];
      }.bind(this));
  }

  removeDatasetLegend() {
    this.legend.selectAll('rect').remove();
    this.legend.selectAll('text').remove();
  }

  /**
   *
   */
  renderDatasetsLegend() {
    if (!this.datasets) return;

    if (!this.combinedData) {
      this.calculateAuxiliaryData();
    }
    let stackNames = this.getStackNames();
    let combinedData = this.combinedData;

    this.legend.raise();
    this.removeDatasetLegend();

    for (let index = 0; index < stackNames.length; index++) {

      let stackName = stackNames[index];
      let dataForStack = combinedData.filter(data => data.stack === stackName);
      let max = d3.max(dataForStack, item => item.value);
      let offset = index * 80;
      let color = Color.colorsForStack(index, 1)[0];

      let steps = 4;
      let data = [0, 1, 2, 3, 4];

      this.legend
        .append('text')
        .attr('x', offset + 20)
        .attr('y', '14')
        .style('fill', color.rgbString())
        .text(stackName);

      this.legend
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .style('fill', color.rgbString())
        .attr('x', '20')
        .attr('y', '20')
        .attr('width', 18)
        .attr('height', 18)
        .attr('transform', function (d, i) {
          return 'translate(' + offset + ',' + (i * 20) + ')';
        })
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill-opacity', (d, i) => i / steps);

      this.legend
        .append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style('fill', color.rgbString())
        .attr('x', '40')
        .attr('y', '35')
        .attr('width', 18)
        .attr('height', 18)
        .attr('transform', function (d, i) {
          return 'translate(' + offset + ',' + (i * 20) + ')';
        })
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill-opacity', (d, i) => i / steps)
        .text(function (d, i) {
          return formatNumber((i / steps) * max);
        }.bind(this));
    }
  }

  calculateAuxiliaryData() {
    this.stackNames = this.getStackNames();
    this.flatData = flatDatasets(this.datasets);
    this.combinedData = combine(this.flatData);
    log_debug('this.stackNames', this.stackNames);
    log_debug('this.flatData', this.flatData);
    log_debug('this.combinedData', this.combinedData);
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
   * Returns an array of strings containing the names of stacks in the datasets.
   *
   * @returns {string[]}
   */
  getStackNames() {
    if (!this.datasets) return [];
    let stackNames = this.datasets.map(dataset => String(dataset.stack));
    return Array.from(new Set(stackNames));
  }

  /**
   * Tells the receiving map chart to update its view.
   */
  update() {
    this.geoJSONDidChange();
    this.datasetsDidChange();
  }


  // MARK: - Load JSON

  /**
   * Loads the geo json at the given url into the map.
   */
  loadGeoJSON(geoJSONURL) {
    d3.json(geoJSONURL)
      .then(function (rawJSON) {
        this.setGeoJSON(new GeoJson(rawJSON));
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      }.bind(this));
  }

  /**
   *
   * @param newGeoJSON
   */
  setGeoJSON(newGeoJSON) {
    this.geoJSON = newGeoJSON;
    this.geoJSONDidChange();
    this.tooltip.raise();
  }

  /**
   *
   * @param newDatasets
   */
  setDatasets(newDatasets) {
    this.datasets = newDatasets;
    this.datasetsDidChange();
    this.tooltip.raise();
    this.bounds.raise();
  }

  /**
   * Tells the receiving map chart that its `geoJSON` property did change.
   */
  geoJSONDidChange() {
    if (!this.geoJSON) return;
    this.removeExcludedFeatures();
    this.zoomTo(this.geoJSON);
    this.renderGeoJson();
    this.renderDatasets();
  }

  /**
   * Tells the receiving map chartt that its `datasets` property did change.
   */
  datasetsDidChange() {
    if (!this.datasets) return;
    this.renderDatasets();
    this.renderDatasetLabels();
    this.renderDatasetsLegend();
  }


  // MARK: - Auxiliary

  removeExcludedFeatures() {
    if (!this.geoJSON) return;
    let excludedFeatureCodes = this.excludedFeatureCodes;
    for (let index = 0; index < excludedFeatureCodes.length; index++) {
      let code = excludedFeatureCodes[index];
      let candidate = this.geoJSON.features.find(feature => feature.properties.code === code);
      if (!candidate) return;
      let candidateIndex = this.geoJSON.features.indexOf(candidate);
      if (candidateIndex < 0) return;
      this.geoJSON.features.splice(candidateIndex, 1);
    }
  }
}

