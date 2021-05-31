import {Checkbox} from "../components/checkbox";
import {UrlParameters} from "../shared/url.parameters";
import {Dropdown} from "../components/dropdown";
import {Option} from "../components/option";
import {PlotChartSort} from "./plot.chart.sort";
import {SettingsPopup} from "../components/settings.popup";

/**
 *
 * @class PlotChartSettingsPopup
 * @extends SettingsPopup
 */
export class PlotChartSettingsPopup extends SettingsPopup {

  /**
   * Appends the headline and the content row of the popup.
   */
  inject() {
    super.inject();

    let container = this.row.append('div');

    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.config.showLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels, checked);
    }.bind(this);

    let dropdownContainer = this.row.append('div');
    this.sortDropdown = new Dropdown(dropdownContainer);
    this.sortDropdown.setLabelText('Sort');
    this.sortDropdown.setOptions([
      new Option(PlotChartSort.alphabetically),
      new Option(PlotChartSort.duration),
      new Option(PlotChartSort.intensity),
      new Option(PlotChartSort.firstDate)
    ]);
    this.sortDropdown.setOnChange(function (value) {
      this.chart.config.sort = value;
      this.chart.update();
    }.bind(this));
  }

  /**
   * Tells this popup that it is about to be displayed.
   */
  willShow() {
    this.showLabelsCheckbox.setChecked(this.chart.config.showLabels);
    this.sortDropdown.setSelectedOption(this.chart.config.sort);
  }
}
