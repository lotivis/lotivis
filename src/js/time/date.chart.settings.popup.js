import {Checkbox} from "../components/checkbox";
import {RadioGroup} from "../components/radio.group";
import {UrlParameters} from "../shared/url.parameters";
import {Option} from "../components/option";
import {SettingsPopup} from "../components/settings.popup";

/**
 *
 * @class DateChartSettingsPopup
 * @extends SettingsPopup
 */
export class DateChartSettingsPopup extends SettingsPopup {

  inject() {
    super.inject();
    this.injectShowLabelsCheckbox();
    this.injectCombineStacksCheckbox();
    this.injectRadios();
  }

  injectShowLabelsCheckbox() {
    let container = this.row.append('div');
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.chart.config.showLabels = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels + this.selector, checked);
    }.bind(this);
  }

  injectCombineStacksCheckbox() {
    let container = this.row.append('div');
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText('Combine Stacks');
    this.combineStacksCheckbox.onClick = function (checked) {
      this.chart.config.combineStacks = checked;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartCombineStacks + this.selector, checked);
    }.bind(this);
  }

  injectRadios() {
    let container = this.row.append('div');
    this.typeRadioGroup = new RadioGroup(container);
    this.typeRadioGroup.setOptions([
      new Option('bar', 'Bar'),
      new Option('line', 'Line')
    ]);

    this.typeRadioGroup.onChange = function (value) {
      this.chart.type = value;
      this.chart.update();
      UrlParameters.getInstance().set(UrlParameters.chartType + this.selector, value);
    }.bind(this);
  }

  willShow() {
    this.showLabelsCheckbox.setChecked(this.chart.config.showLabels);
    // console.log('this.diachronicChart.showLabels: ' + this.diachronicChart.isShowLabels);
    this.combineStacksCheckbox.setChecked(this.chart.config.combineStacks);
    // console.log('this.diachronicChart.combineGroups: ' + this.diachronicChart.isCombineStacks);
    this.typeRadioGroup.setSelectedOption(this.chart.type);
  }
}
