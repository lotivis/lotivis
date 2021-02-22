import {Card} from "./card";
import {Button} from "./button";
import {RadioGroup} from "./radio-group";
import {Option} from "./option";

/**
 *
 * @class ChartCard
 * @extends Card
 */
export class ChartCard extends Card {

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
    this.screenshotButton.onClick = this.screenshotButtonAction.bind(this);

    this.moreButton = new Button(this.headerRightComponent);
    this.moreButton.setText('More');
    this.moreButton.element.classed('simple-button', true);
    this.moreButton.setFontAwesomeImage('ellipsis-h');
    this.moreButton.onClick = this.presentSettingsPopupAction.bind(this);
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

  /**
   *
   *
   * @param datasets
   */
  setDatasets(datasets) {
    this.datasets = datasets;
    this.updateRadioGroup();
    let firstDataset = datasets[0];
    this.chart.datasets = [firstDataset];
    this.chart.update();
    this.chart.datasetsDidChange();
  }

  /**
   * Triggered when the screenshot button is pushed.
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
}
