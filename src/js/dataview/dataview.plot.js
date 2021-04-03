import {DatasetsController} from "../data/datasets.controller";
import {copy} from "../shared/copy";
import {
  extractDatesFromDatasets,
  extractEarliestDateWithValue,
  extractLabelsFromDatasets,
  extractLatestDateWithValue
} from "../data.juggle/data.extract";
import {combineByDate} from "../data.juggle/data.combine";
import {sumOfDataset, sumOfLabel, sumOfValues} from "../data.juggle/data.sum";
import {flatDataset} from "../data.juggle/data.flat";

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
  let flatData = flatDataset(dataset);

  newDataset.label = dataset.label;
  newDataset.stack = dataset.stack;
  newDataset.firstDate = firstDate;
  newDataset.lastDate = lastDate;
  newDataset.sum = sumOfValues(flatData);
  newDataset.data = combineByDate(data)
    .sort((left, right) => left.dateNumeric - right.dateNumeric)
    .filter(item => (item.value || 0) > 0);

  return newDataset;
}

/**
 * Returns a new generated plot samples view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getPlotDataview = function () {

  let dateAccess = this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};
  dataview.dates = extractDatesFromDatasets(enabledDatasets);
  dataview.labels = extractLabelsFromDatasets(enabledDatasets);
  dataview.max = this.getMax();

  enabledDatasets.forEach(function (dataset) {
    let newDataset = createPlotDataset(dataset, dateAccess);
    let firstIndex = dataview.dates.indexOf(newDataset.firstDate);
    let lastIndex = dataview.dates.indexOf(newDataset.lastDate);
    newDataset.duration = lastIndex - firstIndex;
    dataview.datasets.push(newDataset);
  });

  dataview.labelsCount = dataview.datasets.length;

  return dataview;
};
