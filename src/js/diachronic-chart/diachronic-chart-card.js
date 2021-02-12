import {Card} from "../components/card";
import {Button} from "../components/button";
import {DiachronicChart} from "./diachronic-chart";
import {createUUID} from "../shared/uuid";
import {DiachronicChartSettingsPopup} from "./diachronic-chart-settings-popup";
import {URLParameters} from "../shared/url-parameters";
import {screenshotElement} from "../shared/screenshot";

/**
 *
 *
 * @class DiachronicChartCard
 * @extends Card
 */
export class DiachronicChartCard extends Card {

    /**
     *
     * @param selector
     * @param name
     */
    constructor(selector, name) {
        super(selector);
        if (!selector) {
            throw 'No selector specified.';
        }
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
        this.chart = new DiachronicChart(this.body);
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

        this.screenshotButton.onClick = function (event) {
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
        let button = document.getElementById(this.moreActionButton.selector);
        let settingsPopup = new DiachronicChartSettingsPopup(application.element);
        settingsPopup.diachronicChart = this.chart;
        settingsPopup.showUnder(button, 'right');
    }
}
