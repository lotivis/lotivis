import {Component} from "./component";

/**
 *
 * @class RadioGroup
 * @extends Component
 */
export class RadioGroup extends Component {

    /**
     *
     * @param parent The parental component.
     */
    constructor(parent) {
        super(parent);

        this.inputElements = [];
        this.element = this.parent.append('form');
        this.element.classed('radio-group', true);
    }

    /**
     *
     * @param optionId
     * @param optionName
     * @returns {*}
     */
    addOption(optionId, optionName) {
        let inputElement = this.element
            .append('input')
            .attr('type', 'radio')
            .attr('name', this.selector)
            .attr('value', optionId)
            .attr('id', optionId);

        this.element
            .append('label')
            .attr('for', optionId)
            .text(optionName || optionId);

        let thisReference = this;
        inputElement.on("click", function (event) {
            thisReference.onClick(event);
        });

        return inputElement;
    }

    /**
     *
     * @param options
     * @returns {RadioGroup}
     */
    setOptions(options) {
        this.removeOptions();
        this.inputElements = [];
        for (let i = 0; i < options.length; i++) {
            let id = options[i][0] || options[i].id;
            let name = options[i][1] || options[i].translatedTitle;
            let inputElement = this.addOption(id, name);
            if (i === 0) {
                inputElement.attr('checked', 'true');
            }
            this.inputElements.push(inputElement);
        }
        return this;
    }

    /**
     *
     * @param selectedOption
     * @returns {RadioGroup}
     */
    setSelectedOption(selectedOption) {
        for (let i = 0; i < this.inputElements.length; i++) {
            let inputElement = this.inputElements[i];
            let value = inputElement.attr('value');
            if (value === selectedOption) {
                inputElement.attr('checked', 'true');
            }
        }
        return this;
    }

    /**
     *
     * @returns {RadioGroup}
     */
    removeOptions() {
        this.element.selectAll('input').remove();
        this.element.selectAll('label').remove();
        this.inputElements = [];
        return this;
    }

    /**
     *
     * @param event
     */
    onClick(event) {
        let element = event.target;
        if (!element) return;

        let value = element.value;
        if (!this.onChange) return;

        this.onChange(value);

        return this;
    }

    // onChange(newFunction) {
    //     this.onChange = newFunction;
    //     return this;
    // }
    onChange(value) {
    }
}
