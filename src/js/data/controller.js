import * as d3 from "d3";
import { EventEmitter } from "events";
import { DEFAULT_DATE_ORDINATOR } from "./date.ordinator";
import { ColorGenerator } from "../common/colors";
import { FilterArray } from "./filter.array";
import { set_data_preview } from "../common/debug";
import { snapshot } from "./controller.snapshot.js";

export class DataController extends EventEmitter {
  constructor(flat, config) {
    super();

    if (!Array.isArray(flat)) {
      throw new Error("Datasets are not an array.");
    }

    this.config = config || {};
    this.data = flat;
    this.original = this.config.original || flat;

    this.dateAccess = this.config.dateAccess || DEFAULT_DATE_ORDINATOR;
    this.colorGenerator = new ColorGenerator(this.data);

    this.filters = {
      labels: new FilterArray((r) => this.filterChange("labels", r)),
      locations: new FilterArray((r) => this.filterChange("locations", r)),
      dates: new FilterArray((r) => this.filterChange("dates", r)),
      stacks: new FilterArray((r) => this.filterChange("stacks", r)),
    };

    // this.filters.locations.push(...this.locations());

    console.log("DataController", this);
    if (this.original) set_data_preview(this.original);

    return this;
  }

  /** Returns entries with valid value. */
  filterValid() {
    return this.data.filter((d) => d.value);
  }

  byLabel() {
    return d3.group(this.data, (d) => d.label);
  }

  byStack() {
    return d3.group(this.data, (d) => d.stack || d.label);
  }

  byLocation() {
    return d3.group(this.data, (d) => d.location);
  }

  byDate() {
    return d3.group(this.data, (d) => d.date);
  }

  labels() {
    return Array.from(this.byLabel().keys());
  }

  stacks() {
    return Array.from(this.byStack().keys());
  }

  locations() {
    return Array.from(this.byLocation().keys());
  }

  dates() {
    return Array.from(this.byDate().keys());
  }

  dataStack(s) {
    return this.data.filter((d) => d.stack === s);
  }

  dataLabel(l) {
    return this.data.filter((d) => d.label === l);
  }

  dataLocation(l) {
    return this.data.filter((d) => d.location === l);
  }

  dataDate(d) {
    return this.data.filter((d) => d.date === d);
  }

  sumOfStack(s) {
    return d3.sum(this.dataStack(s), (d) => d.value);
  }

  sumOfLabel(l) {
    return d3.sum(this.dataLabel(l), (d) => d.value);
  }

  sumOfLocation(l) {
    return d3.sum(this.dataLocation(l), (d) => d.value);
  }

  sumOfDate(d) {
    return d3.sum(this.dataDate(s), (d) => d.value);
  }

  sum() {
    return d3.sum(this.data, (d) => d.value);
  }

  max() {
    return d3.max(this.data, (item) => item.value);
  }

  min() {
    return d3.min(this.data, (item) => item.value);
  }

  /** Returns a string that can be used as filename for downloads. */
  getFilename() {
    if (!this.labels) return "Unknown";
    let labels = this.labels.map((label) => label.split(` `).join(`-`));
    if (labels.length > 10) {
      labels = labels.splice(0, 10);
    }
    return labels.join(",");
  }

  // filters

  filterChange(name, reason) {
    this.snapshot = snapshot(this);
    this.emit("change", this, name, reason);
  }
}
