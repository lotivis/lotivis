import {Card} from "../components/card";
import {DatasetCard} from "./dataset.card";
import {parseCSVDate} from "../data.parse/parse.csv.date";
import {renderCSVDate} from "../data.render/render.csv.date";
import {downloadCSV} from "../shared/download";

/**
 * Presents the CSV version of datasets.  The presented CSV can be edited.
 * @class DatasetCSVDateCard
 * @extends Card
 */
export class DatasetCSVDateCard extends DatasetCard {

  /**
   * Creates a new instance of DatasetCSVCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setHeaderText('Dataset CSV Card');
  }

  download(content) {
    downloadCSV(content, 'dataset.csv');
  }

  textToDatasets(text) {
    if (text === "") return [];
    return parseCSVDate(text);
  }

  datasetsToText(datasets) {
    return renderCSVDate(datasets);
  }
}
