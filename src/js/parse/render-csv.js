import {flatDatasets} from "../data-juggle/dataset-flat";

/**
 *
 * @param datasets
 */
export function renderCSV(datasets) {
  let flatData = flatDatasets(datasets);
  let csvContent = 'label,value,date,location\n';
  for (let index = 0; index < flatData.length; index++) {
    let data = flatData[index];
    csvContent += `${data.dataset || 'Unknown'},${data.value || '0'},`;
    csvContent += `${data.date || ''},${data.location || ''}\n`;
  }
  return csvContent;
}
