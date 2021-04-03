import {extractLabelsFromDatasets} from "../data.juggle/data.extract";
import {dateToItemsRelation} from "../data.juggle/data.relations";

/**
 *
 * @param datasets
 */
export function renderCSVDate(datasets) {
  let dateRelation = dateToItemsRelation(datasets, (date) => date);
  let labels = extractLabelsFromDatasets(datasets);
  let headlines = ['date'];

  for (let labelIndex = 0; labelIndex < labels.length; labelIndex++) {
    headlines.push(labels[labelIndex]);
  }

  let csvContent = `${headlines.join(',')}\n`;

  for (let index = 0; index < dateRelation.length; index++) {
    let dateRow = dateRelation[index];
    let csvRow = `${dateRow.date}`;

    for (let labelIndex = 0; labelIndex < labels.length; labelIndex++) {
      let label = labels[labelIndex];
      csvRow += `,${dateRow[label]}`;
    }

    csvContent += `${csvRow}\n`;
  }

  return csvContent;
}
