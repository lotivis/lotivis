import {Card} from "./card";
import {Button} from "./button";
import {RadioGroup} from "./radio.group";
import {Option} from "./option";

/**
 *
 * @class ChartCard
 * @extends Card
 */
export class ChartCard extends Card {
  chart;

  /**
   * Creates a new instance of ChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.injectMapChart();
    this.injectButtons();
    this.injectRadioGroup();
  }

  /**
   * Creates and injects a screenshot button and a more button.
   */
  injectButtons() {
    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.setFontAwesomeImage('camera');
    this.screenshotButton.onClick = function (event) {
      this.screenshotButtonAction(event);
    }.bind(this);

    this.moreButton = new Button(this.headerRightComponent);
    this.moreButton.setText('More');
    this.moreButton.element.classed('simple-button', true);
    this.moreButton.setFontAwesomeImage('ellipsis-h');
    this.moreButton.onClick = function (event) {
      this.presentSettingsPopupAction(event);
    }.bind(this);
  }

  /**
   * Creates and injects the chart.
   *
   * Should be overridden by subclasses.
   */
  injectMapChart() {
    // empty
  }

  /**
   * Creates and injects a radio button group.
   */
  injectRadioGroup() {
    this.radioGroup = new RadioGroup(this.headerCenterComponent);
    this.radioGroup.onChange = function (value) {
      let dataset = this.datasets.find(dataset => dataset.label === value);
      this.chart.datasets = [dataset];
      this.chart.update();
    }.bind(this);
  }

  /**
   * Updates the options of the radio button group dependant on the given datasets.
   */
  updateRadioGroup() {
    if (!this.datasets) return;
    let names = this.datasets.map(dataset => dataset.label);
    let options = names.map(name => new Option(name));
    this.radioGroup.setOptions(options);
  }

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
    // empty
  }

  /**
   * Triggered when the more button is pushed.
   *
   * Should be overridden by subclasses.
   */
  presentSettingsPopupAction() {
    // empty
  }

  /**
   * Triggered for a change of the radio group.
   *
   * Should be overridden by subclasses.
   */
  onSelectedDatasetChanged() {
    // empty
  }
}
