import {Popup} from "../components/popup";
import {Checkbox} from "../components/checkbox";
import {RadioGroup} from "../components/radio.group";
import {UrlParameters} from "../shared/url.parameters";
import {Option} from "../components/option";

/**
 *
 * @class DateChartSettingsPopup
 * @extends Popup
 */
export class DateChartSettingsPopup extends Popup {

  render() {
    this.card.setHeaderText('Settings');
    this.row = this.card.content
      .append('div')
      .classed('row', true);

    this.renderShowLabelsCheckbox();
    this.renderCombineStacksCheckbox();
    this.renderRadios();
  }

  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText('Labels');
    this.showLabelsCheckbox.onClick = function (checked) {
      this.diachronicChart.config.showLabels = checked;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartShowLabels + this.selector, checked);
    }.bind(this);
  }

  renderCombineStacksCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText('Combine Stacks');
    this.combineStacksCheckbox.onClick = function (checked) {
      this.diachronicChart.config.combineStacks = checked;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartCombineStacks + this.selector, checked);
    }.bind(this);
  }

  renderRadios() {
    let container = this.row.append('div').classed('col-12', true);
    this.typeRadioGroup = new RadioGroup(container);
    this.typeRadioGroup.setOptions([
      new Option('bar', 'Bar'),
      new Option('line', 'Line')
    ]);

    this.typeRadioGroup.onChange = function (value) {
      this.diachronicChart.type = value;
      this.diachronicChart.update();
      UrlParameters.getInstance().set(UrlParameters.chartType + this.selector, value);
    }.bind(this);
  }

  preferredSize() {
    return {
      width: 240,
      height: 600
    };
  }

  willShow() {
    this.loadValues();
  }

  loadValues() {
    this.showLabelsCheckbox.setChecked(this.diachronicChart.isShowLabels);
    console.log('this.diachronicChart.showLabels: ' + this.diachronicChart.isShowLabels);
    this.combineStacksCheckbox.setChecked(this.diachronicChart.isCombineStacks);
    console.log('this.diachronicChart.combineGroups: ' + this.diachronicChart.isCombineStacks);
    this.typeRadioGroup.setSelectedOption(this.diachronicChart.type);
  }
}
