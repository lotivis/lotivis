import {Card} from "../components/card";
import {Button} from "../components/button";
import {MapChart} from "./map-chart";
import {Language} from "../language/language";
import {Checkbox} from "../components/checkbox";
import {URLParameters} from "../shared/url-parameters";
import {Slider} from "../components/slider";
import {screenshotElement} from "../shared/screenshot";
import {DiachronicChartSettingsPopup} from "../diachronic-chart/diachronic-chart-settings-popup";
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
        // this.renderSlider();
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

        // this.showLabelsCheckbox = new Checkbox(this.headerRightComponent)
        //     .setText(Language.translate('Labels'))
        //     .setChecked(true);
        //
        // this.showLabelsCheckbox.onClick = function (checked) {
        //     this.mapChart.isShowLabels = checked;
        //     this.mapChart.update();
        //     URLParameters.getInstance().setWithoutDeleting('map-show-labels', checked);
        // }.bind(this);
        //
        // this.zoomEnabledCheckbox = new Checkbox(this.headerRightComponent)
        //     .setText(Language.translate('Zoom'))
        //     .setChecked(true);
        //
        // this.zoomEnabledCheckbox.onClick = function (checked) {
        //     this.mapChart.isZoomable = checked;
        //     this.mapChart.update();
        //     URLParameters.getInstance().setWithoutDeleting('map-zoomable', checked);
        // }.bind(this);

        this.centerButton = new Button(this.headerRightComponent);
        this.centerButton.setText(Language.translate('Center'));
        this.centerButton.hide();
        this.centerButton.onClick = function (event) {
            console.log(event);
        }.bind(this);

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
        this.mapChart.loadGeoJSON('/assets/geojson/departements.simple.geojson');
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
