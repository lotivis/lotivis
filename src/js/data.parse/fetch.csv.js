import {parseCSV} from "./parse.csv";

/**
 *
 * @param url
 * @param extractItemBlock
 * @returns {Promise<[]>}
 */
export function fetchCSV(
  url,
  extractItemBlock = function (components) {
    return {date: components[0], value: components[1]};
  }) {

  return fetch(url)
    .then(response => response.text())
    .then(parseCSV);
}
