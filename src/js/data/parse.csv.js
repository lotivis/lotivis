import * as d3 from "d3";
import { Data } from "./flat.data";

export function parseCSV(text) {
  let parsed = d3.csvParse(text, d3.autoType);
  let data = Data(parsed);
  return data;
}

export function csv(path) {
  d3.csv;
}
