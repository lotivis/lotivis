import {Component} from "./component";

/**
 * A lotivis card.
 *
 * @class Card
 * @extends Component
 */
export class Card extends Component {

  /**
   * Creates a new instance of Card.
   *
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.element = this.parent
      .append('div')
      .classed('lotivis-card', true);
    this.createHeader();
    this.createBody();
    this.createFooter();
  }

  createHeader() {
    this.header = this.element
      .append('div')
      .classed('lotivis-card-header', true);
    this.headerRow = this.header
      .append('div')
      .classed('lotivis-row', true);
    this.headerLeftComponent = this.headerRow
      .append('div')
      // .classed('col-lg-2', true)
      .classed('lotivis-col-3', true)
      .classed('lotivis-card-header-left-component', true);
    this.headerCenterComponent = this.headerRow
      .append('div')
      // .classed('col-lg-2', true)
      .classed('lotivis-col-6', true)
      .classed('lotivis-card-header-center-component', true);
    this.headerRightComponent = this.headerRow
      .append('div')
      // .classed('col-lg-10', true)
      .classed('lotivis-col-3', true)
      .classed('lotivis-card-header-right-component', true)
      .classed('lotivis-button-group', true)
      .classed('text-end', true);
    // this.titleLabel = this.headerLeftComponent
    //   .append('span')
    //   .text(this.name);

  }

  createBody() {
    this.body = this.element
      .append('div')
      .classed('lotivis-card-body', true);
    this.content = this.body
      .append('div')
      .attr('id', 'content');
  }

  createFooter() {
    this.footer = this.element
      .append('div')
      .classed('lotivis-card-footer', true);
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
