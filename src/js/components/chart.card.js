import {Card} from "./card";
import {Button} from "./button";
import {RadioGroup} from "./radio.group";
import {Option} from "./option";
import {LotivisUnimplementedMethodError} from "../data.juggle/data.validate.error";
import {lotivis_log} from "../shared/debug";

/**
 * A lotivis card with a chart.
 * @class ChartCard
 * @extends Card
 */
export class ChartCard extends Card {

  /**
   * Creates a new instance of ChartCard.
   * @param parent The parental component.
   * @param config The configuration
   */
  constructor(parent, config) {

    if (parent && config && typeof parent === 'string') {
      config.selector = parent;
      super(config);
    } else {
      super(parent);
    }

    this.chart = null;
    this.config = config;
    this.injectButtons();
    this.injectRadioGroup();
    this.injectChart();

    let cardSelector = this.selector;
    this.setTitle((config && config.title) ? config.title : (cardSelector || 'No Title'));
  }

  /**
   * Creates and injects the chart.
   * Should be overridden by subclasses.
   */
  injectChart() {
    return new LotivisUnimplementedMethodError(`injectChart()`);
  }

  /**
   * Creates and injects a screenshot button and a more button.
   */
  injectButtons() {
    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.onClick = this.screenshotButtonAction.bind(this);

    this.moreButton = new Button(this.headerRightComponent);
    this.moreButton.setText('More');
    this.moreButton.element.classed('simple-button', true);
    this.moreButton.onClick = this.presentSettingsPopupAction.bind(this);
  }

  /**
   * Creates and injects a radio button group.
   */
  injectRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      if (!dataset) return lotivis_log(`Can't find dataset with label ${value}`);
      this.chart.datasets = [dataset];
      this.chart.update();
    }.bind(this);
  }

  /**
   * Updates the options of the radio button group dependant on the given datasets.
   */
  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label || 'Unknown Label');
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

  /**
   *
   * @param datasets
   */
  setDatasets(datasets) {
    this.datasets = datasets;
    this.updateRadioGroup();
    let firstDataset = datasets[0];
    this.setDataset(firstDataset);
  }

  setDataset(dataset) {
    if (!this.chart) return;
    this.chart.datasets = [dataset];
    this.chart.update();
    if (this.onSelectedDatasetChanged) {
      this.onSelectedDatasetChanged(dataset.stack);
    }
  }

  /**
   * Triggered when the screenshot button is pushed.
   *
   * Should be overridden by subclasses.
   */
  screenshotButtonAction() {
    return new LotivisUnimplementedMethodError(`screenshotButtonAction()`);
  }

  /**
   * Triggered when the more button is pushed.
   *
   * Should be overridden by subclasses.
   */
  presentSettingsPopupAction() {
    return new LotivisUnimplementedMethodError(`presentSettingsPopupAction()`);
  }

  /**
   * Triggered for a change of the radio group.
   *
   * Should be overridden by subclasses.
   */
  onSelectedDatasetChanged() {
    return new LotivisUnimplementedMethodError(`onSelectedDatasetChanged()`);
  }
}
