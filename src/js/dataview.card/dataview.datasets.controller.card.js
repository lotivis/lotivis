import {DataviewCard} from "./dataview.card";

/**
 * @class DataviewDatasetsControllerCard
 * @extends DataviewCard
 */
export class DataviewDatasetsControllerCard extends DataviewCard {

  /**
   * Creates a new instance of DataviewDatasetsControllerCard.
   */
  constructor(parent) {
    super(parent);
  }

  datasetsToText(datasets) {
    return JSON.stringify({
      labels: this.datasetsController.labels,
      stacks: this.datasetsController.stacks,
      dates: this.datasetsController.dates,
      locations: this.datasetsController.locations,
      filters: {
        locations: this.datasetsController.locationFilters,
        dates: this.datasetsController.dateFilters,
        datasets: this.datasetsController.datasetFilters,
      },
      selection: {},
      workingDatasets: this.datasetsController.workingDatasets,
      flatData: this.datasetsController.flatData,
      originalDatasets: this.datasetsController.originalDatasets
    }, null, 2);
  }
}
