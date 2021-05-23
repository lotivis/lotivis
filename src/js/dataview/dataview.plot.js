import {DatasetsController} from "../datasets.controller/datasets.controller";
import {copy} from "../shared/copy";
import {
  extractDatesFromDatasets,
  extractEarliestDateWithValue,
  extractLabelsFromDatasets,
  extractLatestDateWithValue
} from "../data.juggle/data.extract";
import {combineByDate} from "../data.juggle/data.combine";
import {sumOfValues} from "../data.juggle/data.sum";
import {flatDataset} from "../data.juggle/data.flat";
import {d3LibraryAccess} from "../shared/d3libaccess";
import {lotivis_log} from "../shared/debug";

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

  newDataset.dataset = dataset.label;
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

  let cachedDataView = this.getCached('plot');
  if (cachedDataView) {
    return cachedDataView;
  }

  let dateAccess = this.dateAccess;
  let enabledDatasets = this.enabledDatasets();
  let dataview = {datasets: []};

  dataview.dates = extractDatesFromDatasets(enabledDatasets).sort();
  dataview.labels = extractLabelsFromDatasets(enabledDatasets);

  enabledDatasets.forEach(function (dataset) {
    let newDataset = createPlotDataset(dataset, dateAccess);
    let firstIndex = dataview.dates.indexOf(newDataset.firstDate);
    let lastIndex = dataview.dates.indexOf(newDataset.lastDate);
    newDataset.duration = lastIndex - firstIndex;
    dataview.datasets.push(newDataset);
  });

  dataview.labelsCount = dataview.datasets.length;
  dataview.max = d3LibraryAccess.max(dataview.datasets, function (dataset) {
    return d3LibraryAccess.max(dataset.data, function (item) {
      return item.value;
    });
  });

  this.setCached(dataview, 'plot');

  return dataview;
};
