import {DataCard} from "./data.card";
import {DatasetJSONCard} from "./data.json.card";

/**
 * A card containing a textarea which contains the JSON text of a dataset collection.
 * @class DataViewCard
 * @extends DataCard
 */
export class DataViewCard extends DatasetJSONCard {

  /**
   * Creates a new instance of DataViewCard.
   * @param parent The parental element or a selector (id).
   */
  constructor(parent = 'dataview-card') {
    super(parent);
    this.setCardTitle(this.getTitle());
  }

  updateDatasetsOfController(notifyController = false) {
    // do nothing
  }

  datasetsToText(datasets) {
    if (!this.datasetController) return "No datasets controller.";
    let dataview = this.getDataView();
    return JSON.stringify(dataview, null, 2);
  }

  getTitle() {
    return 'Dataview';
  }

  getDataView() {
    // empty
  }
}

export class DataViewDateCard extends DataViewCard {
  getTitle() {
    return 'Dataview Date';
  }

  getDataView() {
    return this.datasetController.getDateDataview();
  }
}

export class DataViewPlotCard extends DataViewCard {
  getTitle() {
    return 'Dataview Plot';
  }

  getDataView() {
    return this.datasetController.getPlotDataview();
  }
}

export class DataViewMapCard extends DataViewCard {
  getTitle() {
    return 'Dataview Map';
  }

  getDataView() {
    return this.datasetController.getMapDataview();
  }
}

export class DataViewFlatCard extends DataViewCard {
  getTitle() {
    return 'Flat Data';
  }

  getDataView() {
    return this.datasetController.flatData;
  }
}

export class DataViewDatasetsControllerCard extends DataViewCard {
  getTitle() {
    return 'Datasets Controller';
  }

  getDataView() {
    return this.datasetController.datasets;
  }
}
