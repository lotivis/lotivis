import {DatasetsController} from "../data/datasets.controller";
import {copy} from "../shared/copy";
import {
  extractDatesFromDatasets,
  extractEarliestDateWithValue,
  extractLabelsFromDatasets,
  extractLatestDateWithValue
} from "../data.juggle/data.extract";
import {combineByDate} from "../data.juggle/data.combine";
import {sumOfLabel} from "../data.juggle/data.sum";

/**
 *
 * @param dataset
 * @param dateAccess
 * @returns {{}}
 */
function createPlotDataset(dataset, dateAccess) {
  let newDataset = {};
  let data = copy(dataset.data);
  let firstDate = extractEarliestDateWithValue(data) || 0;
  let lastDate = extractLatestDateWithValue(data) || 0;

  newDataset.label = dataset.label;
  newDataset.stack = dataset.stack;
  newDataset.earliestDate = firstDate;
  newDataset.firstDate = firstDate;
  newDataset.latestDate = lastDate;
  newDataset.lastDate = lastDate;
  newDataset.duration = lastDate - firstDate;
  newDataset.data = combineByDate(data);
  newDataset.sum = sumOfLabel(data, dataset.label);
  data = combineByDate(data)
    .sort((left, right) => left.dateNumeric - right.dateNumeric);

  newDataset.data = data;
  newDataset.dataWithValues = data.filter(item => (item.value || 0) > 0);

  return newDataset;
}

/**
 * Returns a new generated plot samples view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getPlotDataview = function () {

  let dateAccess = this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};

  enabledDatasets.forEach(function (dataset) {
    dataview.datasets.push(createPlotDataset(dataset, dateAccess));
  });

  dataview.labelsCount = dataview.datasets.length;
  dataview.dates = extractDatesFromDatasets(dataview.datasets);
  dataview.labels = extractLabelsFromDatasets(dataview.datasets);
  dataview.max = this.getMax();

  return dataview;
};
