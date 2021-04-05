import {Card} from "./card";
import {createID} from "../shared/selector";
import {Button} from "./button";
import {LotivisError, LotivisUnimplementedMethodError} from "../data.juggle/data.validate.error";

/**
 * A lotivis card containing a textarea.
 * @class TextareaCard
 * @extends Card
 */
export class TextareaCard extends Card {

  /**
   * Creates a new instance of TextareaCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.render();
    this.updateSensible = true;

    if (this.config) {
      this.textarea.attr('rows', this.config.lines || 25);
      this.setTitle(this.config.title || 'TextareaCard');
    } else {
      this.textarea.attr('rows', 25);
      this.setTitle('TextareaCard');
    }
  }

  /**
   * Appends the component to this card.
   */
  render() {
    this.textareaID = createID();
    this.textarea = this.body
      .append('textarea')
      .attr('id', this.textareaID)
      .attr('name', this.textareaID)
      .attr('class', 'lotivis-data-textarea')
      .on('keyup', this.onKeyup.bind(this));
    this.downloadButton = new Button(this.headerRightComponent);
    this.downloadButton.setText('Download');
    this.downloadButton.onClick = function (event) {
      let content = this.getTextareaContent();
      this.download(content);
    }.bind(this);
  }

  /**
   * Returns the text of the textarea.
   * @returns {*} The text of the textarea.
   */
  getTextareaContent() {
    return document.getElementById(this.textareaID).value || "";
  }

  /**
   * Sets the text of the textarea.
   * @param newContent The text for the textarea.
   */
  setTextareaContent(newContent) {
    let textarea = document.getElementById(this.textareaID);
    if (!textarea) return;
    textarea.value = newContent;

    if (this.config.updatesHeight !== true) return;
    if (typeof newContent !== 'string') return;
    let numberOfRows = newContent.split(`\n`).length;
    this.textarea.attr('rows', numberOfRows);
  }

  /**
   * Enable the textarea.
   */
  enableTextarea() {
    this.textarea.attr('disabled', null);
    [this.textarea, this.titleLabel].forEach(item => item.classed('lotivis-disabled', false));
  }

  /**
   * Disables the textarea.
   */
  disableTextarea() {
    this.textarea.attr('disabled', '');
    [this.textarea, this.titleLabel].forEach(item => item.classed('lotivis-disabled', true));
  }

  /**
   * Tells this dataset card that a 'keyup'-event occurred in the textarea.
   * @param event The key event.
   */
  onKeyup(event) {
    throw new LotivisUnimplementedMethodError(`onKeyup(event)`);
  }

  /**
   * Initiates a download of the content of the textarea.
   * @param content The new content of the textarea.
   */
  download(content) {
    throw new LotivisUnimplementedMethodError(`download(content)`);
  }
}
