import * as d3 from "d3";
import { DataController } from "../controller";
import { flatDatasets } from "./flat.datasets";
import { DataUnqualifiedError } from "./data.unqalified.error.js";

export function parseDataset(d) {
  return parseDatasets([d]);
}

export function parseDatasets(d) {
  return new DataController(flatDatasets(d));
}

export function json(path) {
  return d3.json(path).then((json) => {
    if (!Array.isArray(json)) throw new DataUnqualifiedError();
    let flat = flatDatasets(json);
    let controller = new DataController(flat, { original: json });
    return controller;
  });
}

export function jsonFlat(path) {
  return d3.json(path).then((json) => {
    if (!Array.isArray(json)) throw new DataUnqualifiedError();
    let controller = new DataController(json, { original: json });
    return controller;
  });
}
