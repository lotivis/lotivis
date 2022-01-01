import { Component } from "./component";
import { createID } from "../shared/selector";

/**
 *
 * @class Dropdown
 * @extends Component
 */
export class Dropdown extends Component {
  /**
   * Creates a new instance of Dropdown.
   * @param parent The parent or selector.
   */
  constructor(parent) {
    super(parent);
    this.inputElements = [];
    this.selector = createID();
    this.element = parent
      .append("div")
      .classed("lotivis-dropdown-container", true);
    this.selectId = createID();
    this.renderLabel();
    this.renderSelect();
    this.hide();
  }

  renderLabel() {
    this.label = this.element
      .append("label")
      .classed("lotivis-dropdown-label", true)
      .attr("for", this.selectId);
  }

  renderSelect() {
    let thisReference = this;
    this.select = this.element
      .append("select")
      .attr("id", this.selectId)
      .on("change", function (event) {
        thisReference.onClick(event);
      });
  }

  addOption(optionId, optionName) {
    return this.select
      .append("option")
      .attr("id", optionId)
      .attr("value", optionId)
      .text(optionName);
  }

  setOptions(options) {
    this.removeAllInputs();
    for (let i = 0; i < options.length; i++) {
      let id, name;

      if (Array.isArray(options[i])) {
        id = options[i][0] || options[i].id;
        name = options[i][1] || options[i].translatedTitle;
      } else if (typeof options[i] === "string") {
        id = options[i];
        name = options[i];
      } else {
        id = options[i].id;
        name = options[i].title;
      }

      let inputElement = this.addOption(name, name);
      this.inputElements.push(inputElement);
    }

    if (options.length === 0) {
      this.hide();
    } else {
      this.show();
    }

    return this;
  }

  removeAllInputs() {
    this.element.selectAll("input").remove();
    return this;
  }

  onClick(event) {
    let element = event.target;
    if (!element) {
      return;
    }
    let value = element.value;
    if (!this.onChange) {
      return;
    }
    this.onChange(value);
    return this;
  }

  onChange(argument) {
    console.log("argument: " + argument);
    if (typeof argument !== "string") {
      this.onChange = argument;
    } else {
    }
    return this;
  }

  // MARK: - Chaining Setter

  setLabelText(text) {
    this.label.text(text);
    return this;
  }

  setOnChange(callback) {
    this.onChange = callback;
    return this;
  }

  setSelectedOption(optionID) {
    if (
      this.inputElements.find(function (item) {
        return item.attr("value") === optionID;
      }) !== undefined
    ) {
      this.value = optionID;
    }
    return this;
  }

  set value(optionID) {
    document.getElementById(this.selectId).value = optionID;
  }

  get value() {
    return document.getElementById(this.selectId).value;
  }
}

Dropdown.create = function (selector, options, selectedOption, onChange) {
  let div = d3.select(`#${selector}`);
  let dropdown = new Dropdown(div);
  dropdown.setLabelText("Group Size");
  dropdown.setOptions(options);
  dropdown.setSelectedOption(selectedOption);
  dropdown.setOnChange(onChange);
  return dropdown;
};
