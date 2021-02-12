import {Component} from "./component";

export class Textarea extends Component {
    constructor(parent, title) {
        super(parent);
        this.title = title;
        parent.classed('nopadding', true);
        this.element = parent
            .append('textarea')
            .attr('id', this.selector)
            .attr('name', this.selector)
            .attr('rows', '10')
            .style('float', 'left')
            .style('width', '100%')
            .style('min-height', '75px')
            .style('outline', 'none')
            .style('resize', 'none')
            .style('border', '0px solid grey');
    }
    setText(text) {
        this.element.text(text);
    }
    onClick() {
        // empty
    }
}
