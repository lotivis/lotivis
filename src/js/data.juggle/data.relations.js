import {
  extractDatesFromDatasets,
  extractLabelsFromDatasets
} from "./data.extract";
import {flatDatasets} from "./data.flat";
import {combineByDate} from "./data.combine";

/**
 *
 * @param datasets
 * @param dateAccess
 * @returns {{time.chart: *}[]}
 */
export function dateToItemsRelation(datasets, dateAccess) {

  let flatData = flatDatasets(datasets);
  flatData = combineByDate(flatData);

  let listOfDates = extractDatesFromDatasets(datasets);
  // verbose_log('listOfDates', listOfDates);
  listOfDates = listOfDates.reverse();
  // verbose_log('listOfDates', listOfDates);
  // listOfDates = listOfDates.sort(function (left, right) {
  //   return dateAccess(left) - dateAccess(right);
  // });

  let listOfLabels = extractLabelsFromDatasets(datasets);

  return listOfDates.map(function (date) {
    let datasetDate = {date: date};
    flatData
      .filter(item => item.date === date)
      .forEach(function (entry) {
        datasetDate[entry.dataset] = entry.value;
        datasetDate.total = entry.dateTotal;
      });

    // addDataset zero values for empty datasets
    for (let index = 0; index < listOfLabels.length; index++) {
      let label = listOfLabels[index];
      if (!datasetDate[label]) {
        datasetDate[label] = 0;
      }
    }

    return datasetDate;
  });
}
