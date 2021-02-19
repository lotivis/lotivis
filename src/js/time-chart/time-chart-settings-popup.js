import {Popup} from "../components/popup";
import {Checkbox} from "../components/checkbox";
import {RadioGroup} from "../components/radio-group";
import {URLParameters} from "../shared/url-parameters";
import {Application} from "../application";
import {Language} from "../language/language";
import {Option} from "../components/option";

/**
 *
 * @class TimeChartSettingsPopup
 * @extends Popup
 */
export class TimeChartSettingsPopup extends Popup {

  render() {
    this.card
      .headerRow
      .append('h3')
      .text(Language.translate('Settings'));
    // this.card
    //     .header
    //     .style('display', 'none');

    this.row = this.card.body
      .append('div')
      .classed('row', true);

    this.renderShowLabelsCheckbox();
    this.renderCombineStacksCheckbox();
    this.renderRadios();
  }

  renderShowLabelsCheckbox() {
    let container = this.row.append('div').classed('col-12 margin-top', true);
    this.showLabelsCheckbox = new Checkbox(container);
    this.showLabelsCheckbox.setText(Language.translate('Labels'));
    this.showLabelsCheckbox.onClick = function (checked) {
      this.diachronicChart.isShowLabels = checked;
      this.diachronicChart.update();
      URLParameters.getInstance().set(URLParameters.chartShowLabels, checked);
    }.bind(this);
  }

  renderCombineStacksCheckbox() {
    let container = this.row.append('div').classed('col-12', true);
    this.combineStacksCheckbox = new Checkbox(container);
    this.combineStacksCheckbox.setText(Language.translate('Combine Stacks'));
    this.combineStacksCheckbox.onClick = function (checked) {
      this.diachronicChart.isCombineStacks = checked;
      this.diachronicChart.update();
      URLParameters.getInstance().set(URLParameters.chartCombineStacks, checked);
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
      URLParameters.getInstance().set(URLParameters.chartType, value);
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
