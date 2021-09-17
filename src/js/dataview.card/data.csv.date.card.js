import {Card} from "../components/card";
import {EditableDataviewCard} from "./editable.dataview.card";
import {parseCSVDate} from "../data.parse/parse.csv.date";
import {renderCSVDate} from "../data.render/render.csv.date";
import {downloadCSV} from "../shared/download";
import {createDownloadFilename} from "../shared/filename";

/**
 * Presents the CSV version of datasets.  The presented CSV can be edited.
 * @class DatasetCSVDateCard
 * @extends Card
 */
export class DatasetCSVDateCard extends EditableDataviewCard {

  /**
   * Creates a new instance of DatasetCSVCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent) {
    super(parent);
    this.setTitle('Dataset CSV');
  }

  download(content) {
    let filename = this.datasetsController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadCSV(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return parseCSVDate(text);
  }

  datasetsToText(datasetsController) {
    return renderCSVDate(datasetsController.datasets);
  }
}
