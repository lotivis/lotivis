import {Popup} from "../components/popup";
import {Checkbox} from "../components/checkbox";
import {URLParameters} from "../shared/url-parameters";
import {Language} from "../../../../frc-visualization/src/language/language";
import {log_debug} from "../shared/debug";
import {Dropdown} from "../components/dropdown";
import {Option} from "../components/option";
import {PlotChartSort} from "./plot-chart";

/**
 *
 * @class PlotChartSettingsPopup
 * @extends Popup
 */
export class PlotChartSettingsPopup extends Popup {
  chart;

  /**
   *
   */
  render() {
    this.card.headerRow.append('h3').text('Settings');
    this.row = this.card.body.append('div').classed('row', true);
    this.renderShowLabelsCheckbox();
  }

  /**
   *
   */
  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText(Language.translate('Labels'));
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.showLabels = checked;
      this.chart.update();
      URLParameters.getInstance().set(URLParameters.chartShowLabels, checked);
    }.bind(this);

    let dropdownContainer = this.row.append('div').classed('col-12', true);
    this.sortDropdown = new Dropdown(dropdownContainer);
    this.sortDropdown.setLabelText('Sort');
    this.sortDropdown.setOptions([
      new Option(PlotChartSort.alphabetically),
      new Option(PlotChartSort.duration),
      new Option(PlotChartSort.intensity),
      new Option(PlotChartSort.firstDate)
    ])
    this.sortDropdown.setOnChange(function (value) {
      this.chart.sort = value;
      this.chart.update();
    }.bind(this));
  }

  /**
   * Returns the preferred size of the popup.
   * @returns {{width: number, height: number}}
   */
  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }

  /**
   *
   */
  willShow() {
    log_debug('this.chart.showLabels', this.chart.showLabels);
    this.showLabelsCheckbox.setChecked(this.chart.showLabels);
    this.sortDropdown.setSelectedOption(this.chart.sort);
  }

  labels = {};
}
