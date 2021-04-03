import {Card} from "../components/card";
import {DataCard} from "./data.card";
import {parseCSV} from "../data.parse/parse.csv";
import {renderCSV} from "../data.render/render.csv";
import {downloadCSV} from "../shared/download";
import {createDownloadFilename} from "../shared/filname";

/**
 * Presents the CSV version of datasets.  The presented CSV can be edited.
 * @class DatasetCSVCard
 * @extends Card
 */
export class DatasetCSVCard extends DataCard {

  /**
   * Creates a new instance of DatasetCSVCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setCardTitle('Dataset CSV');
  }

  download(content) {
    let filename = this.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadCSV(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return parseCSV(text);
  }

  datasetsToText(datasets) {
    return renderCSV(datasets);
  }
}
