import {DatasetCard} from "./dataset.card";
import {downloadJSON} from "../shared/download";

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 *
 * @class DatasetsJsonCard
 * @extends DatasetCard
 */
export class DatasetsJsonCard extends DatasetCard {

  /**
   * Creates a new instance of DatasetJsonCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = 'datasets-json-card') {
    super(parent);
    this.setHeaderText('Dataset JSON Card');
  }

  download(content) {
    downloadJSON(content, 'dataset.json');
  }

  textToDatasets(text) {
    if (text === "") return [];
    return JSON.parse(text.trim());
  }

  datasetsToText(datasets) {
    return JSON.stringify(datasets, null, 2);
  }
}
