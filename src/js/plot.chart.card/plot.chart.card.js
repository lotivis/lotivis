import { Card } from "../shared.components/card";
import { UrlParameters } from "../shared/url.parameters";
import { ChartCard } from "../shared.components/chart.card";
import { PlotChart } from "../plot.chart/plot.chart";
import { PlotChartCardSettingsPopup } from "./plot.chart.card.settings.popup";
import { downloadImage } from "../shared/download";
import { createDownloadFilename } from "../shared/filename";
import * as d3 from "d3";

/**
 * A card containing a date.chart.plot.chart chart.
 * @class PlotChartCard
 * @extends Card
 */
export class PlotChartCard extends ChartCard {
  /**
   * Creates a new instance of PlotChartCard.
   * @param selector The selector
   * @param config
   */
  constructor(selector, config) {
    let theSelector = selector || "plot-chart-card";
    super(theSelector, config);
    this.applyURLParameters();
    // this.setTitle('Plot');
  }

  /**
   * Injects the time plot chart in the body of the card.
   */
  injectChart() {
    this.chartID = this.selector + "-chart";
    this.body.attr("id", this.chartID);
    this.chart = new PlotChart(this.chartID, this.config);
  }

  /**
   * Applies possible url parameters.
   */
  applyURLParameters() {
    let instance = UrlParameters.getInstance();
    this.chart.type = instance.getString(UrlParameters.chartType, "bar");
    this.chart.isShowLabels = instance.getBoolean(
      UrlParameters.chartShowLabels,
      false
    );
    this.chart.isCombineStacks = instance.getBoolean(
      UrlParameters.chartCombineStacks,
      false
    );
  }

  /**
   * Presents the settings popup.
   */
  presentSettingsPopupAction() {
    let bodyElement = d3.select("body");
    let button = document.getElementById(this.moreButton.selector);
    let settingsPopup = new PlotChartCardSettingsPopup(bodyElement);
    settingsPopup.chart = this.chart;
    settingsPopup.showUnder(button, "right");
  }

  /**
   * Creates and downloads a screenshot from the chart.
   * @override
   */
  screenshotButtonAction() {
    let filename = this.chart.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `plot-chart`);
    downloadImage(this.chart.svgSelector, downloadFilename);
  }
}
