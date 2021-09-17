import {EditableDataviewCard} from "./editable.dataview.card";
import {downloadJSON} from "../shared/download";
import {createDownloadFilename} from "../shared/filename";

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 * @class DatasetsJSONCard
 * @extends EditableDataviewCard
 */
export class DatasetsJSONCard extends EditableDataviewCard {

  /**
   * Creates a new instance of DatasetJSONCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = 'datasets-json-card') {
    if (Object.getPrototypeOf(parent) === Object.prototype) {
      parent.selector = parent.selector || 'datasets-json-card';
    }
    super(parent);
    this.setTitle('Dataset JSON');
  }

  download(content) {
    let filename = this.datasetsController.getFilename();
    let downloadFilename = createDownloadFilename(filename, `datasets`);
    downloadJSON(content, downloadFilename);
  }

  textToDatasets(text) {
    if (text === "") return [];
    return JSON.parse(text.trim());
  }

  datasetsToText(datasetsController) {
    return JSON.stringify(datasetsController.datasets, null, 2) || "";
  }
}
