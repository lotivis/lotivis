import {extractDatesFromFlatData} from "./dataset-extract";

/**
 *
 * @param flatData The array of item.
 */
export function dateToItemsRelation(flatData) {
  let listOfDates = extractDatesFromFlatData(flatData);
  return listOfDates.map(function (date) {
    let datesetDate = { date: date };
    flatData
      .filter(item => item.date === date)
      .forEach(function (entry) {
        datesetDate[entry.dataset] = entry.value;
        datesetDate.total = entry.dateTotal;
      });
    return datesetDate;
  });
}
