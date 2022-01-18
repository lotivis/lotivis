import { csvParse as d3csvParse, csvFormat as d3csvFormat } from "d3";
import { DataController } from "../data/controller.js";

export const DEFAULT_COLUMNS = ["label", "location", "date", "value", "stack"];

export function csvParse(text) {
  return new DataController(d3csvParse(text, d3.autoType));
}

export async function csv(path) {
  return fetch(path).then((csv) => csvParse(csv));
}

export function csvRender(data, columns = DEFAULT_COLUMNS) {
  return d3csvFormat(data.data ? data.data : data, columns);
}
