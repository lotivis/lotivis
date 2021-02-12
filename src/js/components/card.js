import {Component} from "./component";

export class Card extends Component {
    constructor(parent) {
        super(parent);
        this.element = this.parent
            .append('div')
            .classed('card', true);
        this.createHeader();
        this.createBody();
        this.createFooter();
    }

    createHeader() {
        this.header = this.element
            .append('div')
            .classed('card-header', true);
        this.headerRow = this.header
            .append('div')
            .classed('row', true);
        this.headerLeftComponent = this.headerRow
            .append('div')
            // .classed('col-lg-2', true)
            .classed('col-3', true);
        this.headerCenterComponent = this.headerRow
            .append('div')
            // .classed('col-lg-2', true)
            .classed('col-6', true);
        this.headerRightComponent = this.headerRow
            .append('div')
            // .classed('col-lg-10', true)
            .classed('col-3 button-group', true)
            .classed('text-end', true);
        this.titleLabel = this.headerLeftComponent
            .append('span')
            .text(this.name);
    }

    createBody() {
        this.body = this.element
            .append('div')
            .classed('card-body', true);
        this.content = this.body
            .append('div')
            .attr('id', 'content');
    }

    createFooter() {
        this.footer = this.element
            .append('div')
            .classed('card-footer', true);
        this.footerRow = this.footer
            .append('div')
            .classed('row', true);
        this.footerLeftComponent = this.footerRow
            .append('div')
            .classed('col-6', true);
        this.footerRightComponent = this.footerRow
            .append('div')
            .classed('col-6', true)
            .classed('text-end', true);
        this.footer.style('display', 'none');
    }
}
