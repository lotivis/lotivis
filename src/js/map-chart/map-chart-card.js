import {Card} from "../components/card";
import {Button} from "../components/button";
import {MapChart} from "./map-chart";
import {Slider} from "../components/slider";
import {screenshotElement} from "../shared/screenshot";
import {MapChartSettingsPopup} from "./map-chart-settings-popup";

/**
 *
 * @class MapChartCard
 * @extends Card
 */
export class MapChartCard extends Card {

  /**
   * Creates a new instance of MapChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.renderMenuItems();
    this.renderMapChart();
  }

  /**
   *
   */
  renderSlider() {
    this.slider = new Slider(this.headerCenterComponent);
    this.slider.minimum = 1995;
    this.slider.maximum = 2020;
    this.slider.value = 2000;
  }

  /**
   *
   */
  renderMenuItems() {
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
   *
   */
  renderMapChart() {
    this.mapChart = new MapChart(this.body);
    this.mapChart.loadGeoJSON('/assets/Departements-Simple.geojson');
  }


  // MARK: - Actions

  /**
   * Triggered when the screenshot button is pushed.
   */
  screenshotButtonAction() {
    let name = 'my_image.jpg';
    let chartID = this.mapChart.selector;
    screenshotElement("#" + chartID, name);
  }

  /**
   * Triggered when the more button is pushed.
   */
  presentSettingsPopupAction() {
    let application = window.frcvApp;
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new MapChartSettingsPopup(application.element);
    settingsPopup.mapChart = this.mapChart;
    settingsPopup.showUnder(button, 'right');
  }
}
