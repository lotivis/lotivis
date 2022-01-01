import { DatasetsController } from "../datasets.controller/datasets.controller";
import { copy } from "../shared/copy";
import {
  extractDatesFromDatasets,
  extractEarliestDateWithValue,
  extractLabelsFromDatasets,
  extractLatestDateWithValue,
} from "../data.juggle/data.extract";
import { combineByDate } from "../data.juggle/data.combine";
import { sumOfValues } from "../data.juggle/data.sum";
import { flatDataset } from "../data.juggle/data.flat";
import "../datasets.controller/datasets.controller.cache";
import * as d3 from "d3";

/**
 *
 * @param dataset
 * @param dateAccess
 * @returns {{}}
 */
function createPlotDataset(dataset, dateAccess) {
  let newDataset = {};
  let data = copy(dataset.data);
  let firstDate = extractEarliestDateWithValue(data, dateAccess) || 0;
  let lastDate = extractLatestDateWithValue(data, dateAccess) || 0;
  let flatData = flatDataset(dataset);

  newDataset.dataset = dataset.label;
  newDataset.label = dataset.label;
  newDataset.stack = dataset.stack;
  newDataset.firstDate = firstDate;
  newDataset.lastDate = lastDate;
  newDataset.sum = sumOfValues(flatData);
  // newDataset.min = d3.min();

  // dataView.max = d3.max(flatData, function (stack) {
  //   return d3.max(stack, function (series) {
  //     return d3.max(series.map(item => item['1']));
  //   });
  // });

  newDataset.data = combineByDate(data)
    .sort((left, right) => left.dateNumeric - right.dateNumeric)
    .filter((item) => (item.value || 0) > 0);

  return newDataset;
}

/**
 * Returns a new generated date.chart.plot.chart samples view for the current enabled samples of dataset of this controller.
 */
DatasetsController.prototype.getPlotDataview = function () {
  let cachedDataView = this.getCached("plot");
  if (cachedDataView) {
    return cachedDataView;
  }

  let dateAccess = this.dateAccess;
  let enabledDatasets = this.filteredDatasets();
  let dataview = { datasets: [] };

  dataview.dates = extractDatesFromDatasets(enabledDatasets).sort();
  dataview.labels = extractLabelsFromDatasets(enabledDatasets);

  dataview.firstDate = dataview.dates.first();
  dataview.lastDate = dataview.dates.last();

  enabledDatasets.forEach(function (dataset) {
    let newDataset = createPlotDataset(dataset, dateAccess);
    let firstIndex = dataview.dates.indexOf(newDataset.firstDate);
    let lastIndex = dataview.dates.indexOf(newDataset.lastDate);
    newDataset.duration = lastIndex - firstIndex;
    dataview.datasets.push(newDataset);
  });

  dataview.labelsCount = dataview.datasets.length;
  dataview.max = d3.max(dataview.datasets, function (dataset) {
    return d3.max(dataset.data, function (item) {
      return item.value;
    });
  });

  this.setCached(dataview, "plot");

  return dataview;
};
