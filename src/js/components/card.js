import {Component} from "./component";

/**
 * A lotivis card.
 * @class Card
 * @extends Component
 */
export class Card extends Component {

  /**
   * Creates a new instance of Card.
   * @param parent The parental component.
   */
  constructor(parent) {
    super(parent);
    this.injectCard();
    this.injectHeader();
    this.injectBody();
    this.injectFooter();
  }

  /**
   * Appends the card element.
   */
  injectCard() {
    this.element = this.parent
      .append('div')
      .classed('lotivis-card', true);
  }

  /**
   * Appends the header of the card.
   */
  injectHeader() {
    this.header = this.element
      .append('div')
      .attr('class', 'lotivis-card-header');
    this.headerRow = this.header
      .append('div')
      .attr('class', 'lotivis-row');
    this.headerLeftComponent = this.headerRow
      .append('div')
      .attr('class', 'lotivis-card-header-left');
    this.headerCenterComponent = this.headerRow
      .append('div')
      .attr('class', 'lotivis-card-header-center');
    this.headerRightComponent = this.headerRow
      .append('div')
      .attr('class', 'lotivis-card-header-right lotivis-button-group');
    this.titleLabel = this.headerLeftComponent
      .append('div')
      .attr('class', 'lotivis-title-label');
  }

  /**
   * Appends the body of the card.
   */
  injectBody() {
    this.body = this.element
      .append('div')
      .attr('class', 'lotivis-card-body');
    this.content = this.body
      .append('div')
      .attr('class', 'lotivis-card-body-content');
  }

  /**
   * Appends the footer of the card.
   */
  injectFooter() {
    this.footer = this.element
      .append('div')
      .attr('class', 'lotivis-card-footer');
    this.footerRow = this.footer
      .append('div')
      .attr('class', 'lotivis-row');
    this.footerLeftComponent = this.footerRow
      .append('div')
      .attr('class', 'lotivis-col-6');
    this.footerRightComponent = this.footerRow
      .append('div')
      .attr('class', 'lotivis-col-6');
    this.footer.style('display', 'none');
  }

  /**
   * Sets the text of the title label.
   * @param newTitle The text of the title label.
   */
  setTitle(newTitle) {
    this.titleLabel.text(newTitle);
  }

  /**
   * Shows the footer by resetting its style display value.
   */
  showFooter() {
    this.footer.style('display', '');
  }

  /**
   * Hides the footer by setting its style display value to `none`.
   */
  hideFooter() {
    this.footer.style('display', 'none');
  }
}
