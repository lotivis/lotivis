import {MapChart} from "./map-chart";
import {screenshotElement} from "../shared/screenshot";
import {MapChartSettingsPopup} from "./map-chart-settings-popup";
import {ChartCard} from "../components/chart-card";

/**
 *
 * @class MapChartCard
 * @extends ChartCard
 */
export class MapChartCard extends ChartCard {

  /**
   * Creates a new instance of MapChartCard.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
  }

  /**
   * Creates and injects the map chart.
   */
  injectMapChart() {
    this.chart = new MapChart(this.body);
  }

  /**
   * Triggered when the screenshot button is pushed.
   */
  screenshotButtonAction() {
    let name = 'my_image.jpg';
    let chartID = this.chart.selector;
    screenshotElement("#" + chartID, name);
  }

  /**
   * Triggered when the more button is pushed.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select('body');
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new MapChartSettingsPopup(bodyElement);
    settingsPopup.mapChart = this.chart;
    settingsPopup.showUnder(button, 'right');
  }
}
