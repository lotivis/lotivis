import { csvStringToArray } from "../shared/csv.to.array";
import { trimByChar } from "../shared/trim";

/**
 * Returns a collection of datasets parsed from the given CSV content.
 * @param text The CSV content.
 * @returns {[]} The parsed datasets.
 */
export function parseCSVDate(text) {
  let arrays = csvStringToArray(text);
  let datasetLabels = arrays.shift();
  let dateTitle = datasetLabels.shift();
  let datasets = [];
  let minLineLength = datasetLabels.length;

  for (let index = 0; index < datasetLabels.length; index++) {
    datasets.push({
      label: datasetLabels[index],
      data: [],
    });
  }

  for (let lineIndex = 0; lineIndex < arrays.length; lineIndex++) {
    let lineArray = arrays[lineIndex].map((element) =>
      trimByChar(element, `"`)
    );
    if (lineArray.length < minLineLength) continue;

    let date = lineArray.shift();

    for (let columnIndex = 0; columnIndex < lineArray.length; columnIndex++) {
      let value = lineArray[columnIndex];
      datasets[columnIndex].data.push({
        date: date,
        value: value,
      });
    }
  }

  datasets.csv = {
    content: text,
    headlines: datasetLabels.push(),
    lines: arrays,
  };

  return datasets;
}
