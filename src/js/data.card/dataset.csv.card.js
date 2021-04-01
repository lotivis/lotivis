import {Card} from "../components/card";
import {parseCSV2} from "../parse/fetchCSV";
import {DatasetCard} from "./dataset.card";

/**
 * Presents the CSV version of datasets.  The presented CSV can be edited.
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

  textToDatasets(text) {
    if (text === "") return [];
    return parseCSV2(text);
  }

  datasetsToText(datasets) {
    return this.datasetController.getCSVDataview().csv;
  }
}
