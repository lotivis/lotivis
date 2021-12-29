import { Component } from "./component";

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
  }

  /**
   * Appends the card element.
   */
  injectCard() {
    this.element = this.parent.append("div").classed("ltv-card", true);
  }

  /**
   * Appends the header of the card.
   */
  injectHeader() {
    this.header = this.element.append("div").attr("class", "ltv-card-header");
    this.headerLeftComponent = this.header
      .append("div")
      .attr("class", "ltv-left");
    this.headerCenterComponent = this.header
      .append("div")
      .attr("class", "ltv-center");
    this.headerRightComponent = this.header
      .append("div")
      .attr("class", "ltv-right ltv-button-group");
    this.titleLabel = this.headerLeftComponent
      .append("div")
      .attr("class", "ltv-title-label");
  }

  /**
   * Appends the body of the card.
   */
  injectBody() {
    this.body = this.element.append("div").attr("class", "ltv-card-body");
    this.content = this.body.append("div").attr("class", "ltv-card-body");
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
    this.footer.style("display", "");
  }

  /**
   * Hides the footer by setting its style display value to `none`.
   */
  hideFooter() {
    this.footer.style("display", "none");
  }
}
