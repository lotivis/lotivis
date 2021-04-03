import {combineByDate, combineByLocation, combineByStacks} from "../data.juggle/dataset.combine";
import {sumOfDataset, sumOfLabel, sumOfStack} from "../data.juggle/dataset.sum";

/**
 * Controls a collection of datasets.
 * @class DatasetsController
 */
export class DatasetsController {

  /**
   * Creates a new instance of DatasetsController
   * @param datasets The datasets to control.
   */
  constructor(datasets) {
    this.setDatasets(datasets);
  }

  get flatDataCombinedStacks() {
    return combineByStacks(this.flatData);
  }

  get flatDataCombinedDates() {
    return combineByDate(this.flatData);
  }

  get flatDataCombinedLocations() {
    return combineByLocation(this.flatData);
  }

  getSumOfLabel(label) {
    return sumOfLabel(this.flatData, label);
  }

  getSumOfDataset(dataset) {
    return sumOfDataset(this.flatData, dataset);
  }

  getSumOfStack(stack) {
    return sumOfStack(this.flatData, stack);
  }

  getMax() {
    return d3.max(this.workingDatasets, function (dataset) {
      return d3.max(dataset.data, function (item) {
        return item.value;
      });
    });
  }

  // MARK: - Colors

  getColorForDataset(label) {
    return this.datasetsColorsController.colorForDataset(label);
  }

  getColorForStack(stack) {
    return this.datasetsColorsController.colorForStack(stack);
  }

  getColorsForStack(stack) {
    return this.datasetsColorsController.colorsForStack(stack);
  }

  /**
   * Returns a string that can be used as filename for downloads.
   */
  getFilename() {
    return this.labels.join(',');
  }
}
