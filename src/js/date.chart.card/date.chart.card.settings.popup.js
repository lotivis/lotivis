import {Checkbox} from "../shared.components/checkbox";
import {UrlParameters} from "../shared/url.parameters";
import {SettingsPopup} from "../shared.components/settings.popup";

/**
 *
 * @class DateChartCardSettingsPopup
 * @extends SettingsPopup
 */
export class DateChartCardSettingsPopup extends SettingsPopup {

  inject() {
    super.inject();
    this.injectShowLabelsCheckbox();
    this.injectCombineStacksCheckbox();
  }

  injectShowLabelsCheckbox() {
    let container = this.row.append('div');
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.config.showLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(`showLabels-${this.chart.selector}`, checked);
    }.bind(this);
  }

  injectCombineStacksCheckbox() {
    let container = this.row.append('div');
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText('Combine Stacks');
    this.combineStacksCheckbox.onClick = function (checked) {
      this.chart.config.combineStacks = checked;
      this.chart.update();
      UrlParameters.getInstance().set(`combineStacks-${this.chart.selector}`, checked);
    }.bind(this);
  }

  willShow() {
    this.showLabelsCheckbox.setChecked(this.chart.config.showLabels);
    this.combineStacksCheckbox.setChecked(this.chart.config.combineStacks);
  }
}
