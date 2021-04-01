import {Card} from "../components/card";
import {validateDatasets} from "../data-juggle/dataset.validate";
import {parseCSV2} from "../parse/fetchCSV";
import {DatasetCard} from "./dataset.card";

/**
 *
 * @class DatasetCSVCard
 * @extends Card
 */
export class DatasetCSVCard extends DatasetCard {

  /**
   * Creates a new instance of DatasetCSVCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setHeaderText('Dataset CSV Card');
  }

  updateContent(updateController = true) {
    let csvDataview = this.datasetController.getCSVDataview();
    this.textarea.text(csvDataview.csv);
    this.parseContent(updateController);
  }

  parseContent(update = true) {
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
}
