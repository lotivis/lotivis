import {Card} from "../components/card";
import {Button} from "../components/button";
import {TimeChart} from "./time-chart";
import {createUUID} from "../shared/uuid";
import {TimeChartSettingsPopup} from "./time-chart-settings-popup";
import {URLParameters} from "../shared/url-parameters";
import {screenshotElement} from "../shared/screenshot";

/**
 *
 *
 * @class TimeChartCard
 * @extends Card
 */
export class TimeChartCard extends Card {

  /**
   *
   * @param selector
   * @param name
   */
  constructor(selector, name) {
    super(selector);
    if (!selector) throw 'No selector specified.';
    this.selector = selector;
    this.name = selector;
    this.renderChart();
    this.renderScreenshotButton();
    this.renderMoreActionsButton();
    this.applyURLParameters();
  }

  /**
   *
   */
  renderChart() {
    this.chart = new TimeChart(this.body);
    this.chart.margin.left = 150;
    this.chart.margin.right = 150;
  }

  /**
   *
   */
  renderScreenshotButton() {
    this.chartID = createUUID();
    this.body.attr('id', this.chartID);

    this.screenshotButton = new Button(this.headerRightComponent);
    this.screenshotButton.setText('Screenshot');
    this.screenshotButton.element.classed('simple-button', true);
    this.screenshotButton.element.html('<i class="fas fa-camera"></i>');

    this.screenshotButton.onClick = function () {
      let name = 'my_image.jpg';
      let chartID = this.chartID;
      screenshotElement("#" + chartID, name);
    }.bind(this);
  }

  /**
   *
   */
  renderMoreActionsButton() {
    this.moreActionButton = new Button(this.headerRightComponent);
    this.moreActionButton.setText('More');
    this.moreActionButton.element.classed('simple-button', true);
    this.moreActionButton.element.html('<i class="fas fa-ellipsis-h"></i>');
    this.moreActionButton.onClick = function (event) {
      if (!event || !event.target) return;
      this.presentSettingsPopup();
    }.bind(this);
  }

  /**
   *
   */
  applyURLParameters() {
    this.chart.type = URLParameters.getInstance()
      .getString(URLParameters.chartType, 'bar');
    this.chart.isShowLabels = URLParameters.getInstance()
      .getBoolean(URLParameters.chartShowLabels, false);
    this.chart.isCombineStacks = URLParameters.getInstance()
      .getBoolean(URLParameters.chartCombineStacks, false);
  }


  // MARK: - Settings Popup

  /**
   *
   */
  presentSettingsPopup() {
    let application = window.frcvApp;
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreActionButton.selector);
    let settingsPopup = new TimeChartSettingsPopup(bodyElement);
    settingsPopup.diachronicChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }
}
