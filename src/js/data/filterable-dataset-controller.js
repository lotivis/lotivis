import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets,
  extractStacksFromDatasets
} from "../data-juggle/dataset-extract";
import {DatasetController} from "./dataset-controller";
import {flatDatasets} from "../data-juggle/dataset-flat";
import {copy} from "../shared/copy";

/**
 *
 */
export class FilterableDatasetController extends DatasetController {

  constructor(datasets) {
    super(datasets);
    this.listeners = [];
    this.locationFilters = [];
    this.dateFilters = [];
    this.datasetFilters = [];
  }

  setLocationsFilter(locations) {
    this.locationFilters = locations.map(location => String(location));
    this.notifyListeners('location-filter');
  }

  setDatesFilter(dates) {
    this.dateFilters = dates.map(date => String(date));
    this.notifyListeners('dates-filter');
  }

  setDatasetsFilter(datasets) {
    this.datasetFilters = datasets.map(dataset => String(dataset));
    this.notifyListeners('dataset-filter');
  }

  toggleDataset(label) {
    this.workingDatasets.forEach(function (dataset) {
      if (dataset.label === label) {
        dataset.isEnabled = !dataset.isEnabled;
      }
    })
    this.notifyListeners('dataset-toggle');
  }

  enableAllDatasets() {
    this.workingDatasets.forEach(function (dataset) {
      dataset.isEnabled = true;
    })
    this.notifyListeners('dataset-enable-all');
  }

  get enabledDatasets() {

    let aCopy = copy(this.workingDatasets);

    let enabled = aCopy
      .filter(dataset => dataset.isEnabled === true)

    if (this.datasetFilters && this.datasetFilters.length > 0) {
      enabled = enabled.filter(dataset => this.datasetFilters.includes(dataset.label));
    }

    if (this.locationFilters && this.locationFilters.length > 0) {
      let locationFilters = this.locationFilters;
      enabled = enabled.map(function (dataset) {
        dataset.data = dataset.data
          .filter(data => locationFilters.includes(String(data.location))) || [];
        return dataset;
      })
    }

    if (this.dateFilters && this.dateFilters.length > 0) {
      let dateFilters = this.dateFilters;
      enabled = enabled.map(function (dataset) {
        dataset.data = dataset.data
          .filter(data => dateFilters.includes(String(data.date))) || [];
        return dataset;
      })
    }

    return enabled;
  }

  get enabledFlatData() {
    return flatDatasets(this.enabledDatasets);
  }

  get enabledLabels() {
    return extractLabelsFromDatasets(this.enabledDatasets);
  }

  get enabledStacks() {
    return extractStacksFromDatasets(this.enabledDatasets);
  }

  get enabledDates() {
    return extractDatesFromDatasets(this.enabledDatasets);
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    let index = this.listeners.indexOf(listener);
    if (index === -1) return;
    this.listeners = this.listeners.splice(index, 1);
  }

  notifyListeners(reason = 'none') {
    for (let index = 0; index < this.listeners.length; index++) {
      let listener = this.listeners[index];
      if (!listener.update) continue;
      listener.update(this, reason);
    }
  }
}
