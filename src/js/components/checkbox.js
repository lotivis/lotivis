import {Component} from "./component";

export class Checkbox extends Component {
    constructor(parent) {
        super(parent);
        this.renderInput();
        this.renderLabel();
    }

    // MARK: - Life Cycle
    renderInput() {
        let thisReference = this;
        this.element = this.parent
            .classed('radio-group', true)
            .append('input')
            .attr('type', 'checkbox')
            .attr('id', this.selector)
            .on('click', function (event) {
                if (!event.target) {
                    return;
                }
                let checkbox = event.target;
                if (thisReference.onClick) {
                    thisReference.onClick(checkbox.checked);
                }
            });
    }

    renderLabel() {
        this.label = this.parent
            .append('label')
            .attr('for', this.selector)
            .text('Unknown');
    }

    // MARK: - Functions
    setText(text) {
        this.label.text(text);
        return this;
    }

    setChecked(checked) {
        this.element.attr('checked', checked === true ? checked : null);
        return this;
    }

    onClick(checked) {
        // empty
        console.log('onClick: ' + checked);
    }

    enable() {
        this.element.attr('disabled', null);
        this.label.style('color', 'black');
    }

    disable() {
        this.element.attr('disabled', true);
        this.label.style('color', 'gray');
    }
}
