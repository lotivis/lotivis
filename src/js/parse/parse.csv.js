import * as d3 from "d3";
import { DataController } from "../controller.js";

export const DEFAULT_COLUMNS = ["label", "location", "date", "value", "stack"];

export function csvParse(text) {
  return new DataController(d3.csvParse(text, d3.autoType));
}

export async function csv(path) {
  return fetch(path).then((csv) => csvParse(csv));
}

export function csvRender(data, columns = DEFAULT_COLUMNS) {
  return d3.csvFormat(data.data ? data.data() : data, columns);
}
