import {Card} from "../components/card";
import {createID} from "../shared/selector";
import {parseCSV2} from "../parse/fetchCSV";
import {validateDatasets} from "../data-juggle/dataset.validate";

/**
 *
 * @class DatasetCard
 * @extends Card
 */
export class DatasetCard extends Card {

  /**
   * Creates a new instance of DatasetCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.updateSensible = true;
    this.body.style('overflow', 'scroll');
    this.footer.style('display', 'block');
    this.render();
    this.setHeaderText('Dataset Card');
  }

  render() {
    this.element.classed('lotivis-data-card', true);

    this.header.text('');
    this.headline = this.header.append('div');

    this.textareaID = createID();
    this.textarea = this.body
      .append('textarea')
      .attr('id', this.textareaID)
      .attr('name', this.textareaID)
      .attr('class', 'lotivis-data-textarea');

    this.statusText = this.header
      .append('div')
      .style(`display`, `none`)
      .classed('lotivis-data-status-text', true)
      .classed('lotivis-data-status-failure', true);

    this.element.on('keyup', this.onKeyup.bind(this));
  }

  getTextareaContent() {
    return document.getElementById(this.textareaID).value;
  }

  setHeaderText(newHeaderText) {
    this.headline.text(newHeaderText);
  }

  setStatusMessage(newStatusMessage, success = true) {
    this.statusText
      .text(newStatusMessage)
      .style(`display`, newStatusMessage === "" ? `none` : `block`);
  }

  setDatasetController(newDatasetController) {
    this.datasetController = newDatasetController;
    this.datasetController.addListener(this);
    this.updateContent(false);
  }

  onKeyup() {
    this.tryParse();
  }

  update(datasetsController, reason) {
    if (!this.updateSensible) return console.log(`Skipping update due to not update sensible (Reason: ${reason}).`);
    this.updateContent(false);
  }

  updateContent(updateController = true) {
    // empty
  }

  tryParse() {
    let content = this.getTextareaContent();
    let numberOfRows = content.split("\n").length;

    this.textarea.style('height', null);
    this.textarea.attr('rows', numberOfRows);
    this.setStatusMessage('', true);

    try {
      let parsedDatasets = parseCSV2(content);
      validateDatasets(parsedDatasets);

      if (!update) return;
      if (!this.datasetController) return;

      this.updateSensible = false;
      this.datasetController.setDatasets(parsedDatasets);
      this.updateSensible = true;

    } catch (error) {
      this.setStatusMessage(error, false);
    }
  }

  setDatasets(datasets) {
    // empty
  }

  /**
   * Returns the
   */
  getParsedDatasets() {
    // empty
  }
}
