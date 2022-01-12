import * as d3 from "d3";
import { DataController } from "./controller";
import { DataUnqualifiedError } from "./data.unqalified.error.js";

export function parseDataset(d) {
  return new DataController(flatDataset(d));
}

export function parseDatasets(d) {
  return new DataController(flatDatasets(d));
}

export function flatDataset(d) {
  return d.data.map(function (i) {
    return {
      label: d.label,
      stack: d.stack,
      location: i.location,
      date: i.date,
      value: i.value,
    };
  });
}

export function flatDatasets(ds) {
  return ds.reduce((memo, d) => memo.concat(flatDataset(d)), []);
}

export function json(path) {
  return d3.json(path).then((json) => {
    if (!Array.isArray(json)) throw new DataUnqualifiedError();
    let flat = flatDatasets(json);
    let controller = new DataController(flat, { original: json });
    return controller;
  });
}
