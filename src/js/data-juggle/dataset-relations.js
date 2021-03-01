import {extractDatesFromFlatData, extractLabelsFromDatasets, extractLabelsFromFlatData} from "./dataset-extract";

/**
 *
 * @param flatData The array of item.
 */
export function dateToItemsRelation(datasets, flatData) {
  let listOfDates = extractDatesFromFlatData(flatData);
  let listOfLabels = extractLabelsFromDatasets(datasets);

  return listOfDates.map(function (date) {
    let datasetDate = { date: date };
    flatData
      .filter(item => item.date === date)
      .forEach(function (entry) {
        datasetDate[entry.dataset] = entry.value;
        datasetDate.total = entry.dateTotal;
      });

    // add zero values for empty datasets
    for (let index = 0; index < listOfLabels.length; index++) {
      let label = listOfLabels[index];
      if (!datasetDate[label]) {
        datasetDate[label] = 0;
      }
    }

    return datasetDate;
  });
}
