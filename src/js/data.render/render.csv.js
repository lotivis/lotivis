import {flatDatasets} from "../data.juggle/data.flat";

/**
 * Returns the given string with a quotation mark in the left and right.
 *
 * @param aString The string to surround by quotation marks.
 * @returns {string} The string surrounded by quotation marks.
 */
function surroundWithQuotationMarks(aString) {
  return `"${aString}"`;
}

/**
 * Returns the CSV string of the given datasets.
 *
 * @param datasets The datasets to create the CSV of.
 */
export function renderCSV(datasets) {
  let flatData = flatDatasets(datasets);
  let headlines = ['label', 'stack', 'value', 'date', 'location'];
  let csvContent = `${headlines.join(',')}\n`;
  for (let index = 0; index < flatData.length; index++) {
    let data = flatData[index];
    let components = [];
    components.push(surroundWithQuotationMarks(data.dataset || 'Unknown'));
    components.push(surroundWithQuotationMarks(data.stack || ''));
    components.push(data.value || '0');
    components.push(surroundWithQuotationMarks(data.date || ''));
    components.push(surroundWithQuotationMarks(data.location || ''));
    csvContent += `${components.join(`,`)}\n`;
  }
  return csvContent;
}
