import {DatasetsController} from "./datasets.controller";
import {copy} from "../shared/copy";
import {
  extractDatesFromDatasets,
  extractEarliestDateWithValue, extractLabelsFromDatasets,
  extractLatestDateWithValue
} from "../data-juggle/dataset.extract";
import {combineByDate} from "../data-juggle/dataset.combine";
import {sumOfLabel} from "../data-juggle/dataset.sum";
import {verbose_log} from "../shared/debug";

/**
 * Returns a new generated plot data view for the current enabled data of dataset of this controller.
 */
DatasetsController.prototype.getPlotDataview = function () {
  let dateAccess = this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};

  enabledDatasets.forEach(function (dataset) {
    let newDataset = {};
    let data = copy(dataset.data);
    data.forEach(item => item.label = dataset.label);

    let firstDate = extractEarliestDateWithValue(data) || 0;
    let lastDate = extractLatestDateWithValue(data) || 0;

    newDataset.label = dataset.label;
    newDataset.stack = dataset.stack;
    newDataset.earliestDate = firstDate;
    newDataset.latestDate = lastDate;
    newDataset.duration = lastDate - firstDate;
    newDataset.data = combineByDate(data);
    newDataset.sum = sumOfLabel(data, dataset.label);
    newDataset.data = data
      .sort((left, right) => dateAccess(left.date) - dateAccess(right.date));
    newDataset.dataWithValues = data.filter(item => (item.value || 0) > 0);

    dataview.datasets.push(newDataset);
  });

  dataview.labelsCount = dataview.datasets.length;
  dataview.dates = extractDatesFromDatasets(dataview.datasets);
  dataview.labels = extractLabelsFromDatasets(dataview.datasets);
  dataview.max = this.getMax();

  return dataview;
};
