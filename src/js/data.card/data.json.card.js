import {DataCard} from "./data.card";
import {downloadJSON} from "../shared/download";
import {createDownloadFilename} from "../shared/filname";

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 * @class DatasetJSONCard
 * @extends DataCard
 */
export class DatasetJSONCard extends DataCard {

  /**
   * Creates a new instance of DatasetJSONCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = 'datasets-json-card') {
    super(parent);
    this.setCardTitle('Dataset JSON Card');
  }

  download(content) {
    let filename = this.datasetController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadJSON(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return JSON.parse(text.trim());
  }

  datasetsToText(datasets) {
    return JSON.stringify(datasets, null, 2);
  }
}
