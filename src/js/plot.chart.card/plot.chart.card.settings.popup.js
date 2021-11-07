import {Checkbox} from "../shared.components/checkbox";
import {UrlParameters} from "../shared/url.parameters";
import {Dropdown} from "../shared.components/dropdown";
import {Option} from "../shared.components/option";
import {PlotChartSort} from "../plot.chart/plot.chart.sort";
import {SettingsPopup} from "../shared.components/settings.popup";
import {PlotChartType} from "../plot.chart/plot.chart.config";

/**
 *
 * @class PlotChartCardSettingsPopup
 * @extends SettingsPopup
 */
export class PlotChartCardSettingsPopup extends SettingsPopup {

  /**
   * Appends the headline and the content row of the popup.
   */
  inject() {
    super.inject();

    let container = this.row.append('div');

    let showLabelsCheckboxContainer = container.append('div').classed('lotivis-settings-card-row', true);
    this.showLabelsCheckbox = new Checkbox(showLabelsCheckboxContainer);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.config.showLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels, checked);
    }.bind(this);

    let typeDropdownContainer = container.append('div').classed('lotivis-settings-card-row', true);
    this.typeDropdown = new Dropdown(typeDropdownContainer);
    this.typeDropdown.setLabelText('Type');
    this.typeDropdown.setOptions([
      new Option(PlotChartType.gradient),
      new Option(PlotChartType.fraction)
    ]);
    this.typeDropdown.setOnChange(function (value) {
      this.chart.config.type = value;
      this.chart.update();
    }.bind(this));

    let dropdownContainer = container.append('div').classed('lotivis-settings-card-row', true);
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
    this.typeDropdown.setSelectedOption(this.chart.config.type);
    this.sortDropdown.setSelectedOption(this.chart.config.sort);
  }
}
