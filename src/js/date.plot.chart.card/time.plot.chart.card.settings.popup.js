import {Checkbox} from "../shared.components/checkbox";
import {UrlParameters} from "../shared/url.parameters";
import {Dropdown} from "../shared.components/dropdown";
import {Option} from "../shared.components/option";
import {TimePlotChartSort} from "../date.plot.chart/time.plot.chart.sort";
import {SettingsPopup} from "../shared.components/settings.popup";

/**
 *
 * @class TimePlotChartCardSettingsPopup
 * @extends SettingsPopup
 */
export class TimePlotChartCardSettingsPopup extends SettingsPopup {

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
      new Option(TimePlotChartSort.alphabetically),
      new Option(TimePlotChartSort.duration),
      new Option(TimePlotChartSort.intensity),
      new Option(TimePlotChartSort.firstDate)
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
