import {Component} from "./component";

/**
 *
 * @class Slider
 * @extends Component
 */
export class Slider extends Component {

    constructor(parent) {
        super(parent);
        this.element = this.parent
            .append('div')
            .attr('id', this.selector)
            .classed('range-container', true)
        this.renderMinLabel();
        this.render();
        this.renderMaxLabel();
        this.renderValueLabel();
    }

    renderMinLabel() {
        this.minLabel = this.element
            .append('label')
            .attr('id', this.selector + '-min-label')
    }

    render() {
        this.range = this.element
            .append('input')
            .attr('type', 'range')
            .attr('name', 'mySlider')
            .attr('min', '0')
            .attr('max', '100')
            .on('input', function (event) {
                if (!event.target || event.target.value) return;
                this.valueLabel.text(event.target.value);
            }.bind(this))
    }

    renderMaxLabel() {
        this.maxLabel = this.element
            .append('label')
            .attr('id', this.selector + '-max-label')
    }

    renderValueLabel() {
        this.valueLabel = this.element
            .append('label')
            .classed('range-value-label', true);
    }

    get value() {
        return d3.select(this.range).attr('value');
    }

    set value(newValue) {
        this.range.attr('value', newValue);
        this.valueLabel.text(newValue);
    }

    set minimum(newMin) {
        this.range.attr('min', newMin);
        this.minLabel.text(newMin);
    }

    set maximum(newMax) {
        this.range.attr('max', newMax);
        this.maxLabel.text(newMax);
    }
}
