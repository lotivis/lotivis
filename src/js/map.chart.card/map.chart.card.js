import { MapChart } from "../map.chart/map.chart";
import { MapChartSettingsPopup } from "./map.chart.settings.popup";
import { ChartCard } from "../shared.components/chart.card";
import { downloadImage } from "../shared/download";
import { createDownloadFilename } from "../shared/filename";

/**
 * A lotivis card containing a location chart.
 * @class MapChartCard
 * @extends ChartCard
 */
export class MapChartCard extends ChartCard {
  /**
   * Creates a new instance of MapChartCard.
   * @param {Component|String} parent The parental component.
   * @param config The config of the map.chart chart.
   */
  constructor(parent, config) {
    super(parent || "map-chart-card", config);
  }

  /**
   * Creates and injects the map.chart chart.
   */
  injectChart() {
    this.chartID = this.selector + "-chart";
    this.body.attr("id", this.chartID);
    this.chart = new MapChart(this.chartID, this.config);
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let filename = "Unknown";
    if (this.chart && this.chart.datasetController) {
      filename = this.chart.datasetController.getFilename();
    }
    let downloadFilename = createDownloadFilename(filename, `map-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }

  /**
   * Triggered when the more button is pushed.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select("body");
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new MapChartSettingsPopup(bodyElement);
    settingsPopup.mapChart = this.chart;
    settingsPopup.showUnder(button, "right");
  }
}
