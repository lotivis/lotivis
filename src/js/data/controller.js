import * as d3 from "d3";
import { DEFAULT_DATE_ORDINATOR } from "./date.ordinator";
import { ColorGenerator } from "../common/colors";
import { Listeners } from "./controller.listeners.js";
import { Filters } from "./controller.filter";
import { filter } from "./controller.snapshot";
import { set_data_preview } from "../common/debug";

export class DataController {
  constructor(flat, config) {
    if (!Array.isArray(flat)) {
      throw new Error("Datasets are not an array.");
    }

    this.config = config || {};
    this.data = flat;
    this.original = this.config.original || flat;

    this.dateAccess = this.config.dateAccess || DEFAULT_DATE_ORDINATOR;
    this.colorGenerator = new ColorGenerator(this.data);

    this.filters = new Filters((name, reason) => {
      // console.log("[lotivis]  ", name, reason);
      this.snapshot = filter(this);
      this.notifyListeners(name);
    });

    /** Returns entries with valid value. */
    this.filterValid = function () {
      return this.data.filter((d) => d.value);
    };

    this.byLabel = function () {
      return d3.group(this.data, (d) => d.label);
    };

    this.byStack = function () {
      return d3.group(this.data, (d) => d.stack);
    };

    this.byLocation = function () {
      return d3.group(this.data, (d) => d.location);
    };

    this.byDate = function () {
      return d3.group(this.data, (d) => d.date);
    };

    this.labels = function () {
      return Array.from(this.byLabel().keys());
    };

    this.stacks = function () {
      return Array.from(this.byStack().keys());
    };

    this.locations = function () {
      return Array.from(this.byLocation().keys());
    };

    this.dates = function () {
      return Array.from(this.byDate().keys());
    };

    this.dataStack = function (s) {
      return this.data.filter((d) => d.stack === s);
    };

    this.dataLabel = function (l) {
      return this.data.filter((d) => d.label === l);
    };

    this.dataLocation = function (l) {
      return this.data.filter((d) => d.location === l);
    };

    this.dataDate = function (d) {
      return this.data.filter((d) => d.date === d);
    };

    this.sumOfStack = function (s) {
      return d3.sum(this.dataStack(s), (d) => d.value);
    };

    this.sumOfLabel = function (l) {
      return d3.sum(this.dataLabel(l), (d) => d.value);
    };

    this.sumOfLocation = function (l) {
      return d3.sum(this.dataLocation(l), (d) => d.value);
    };

    this.sumOfDate = function (d) {
      return d3.sum(this.dataDate(s), (d) => d.value);
    };

    this.sum = function () {
      return d3.sum(this.data, (d) => d.value);
    };

    this.max = function () {
      return d3.max(this.data, (item) => item.value);
    };

    this.min = function () {
      return d3.min(this.data, (item) => item.value);
    };

    /** Returns a string that can be used as filename for downloads. */
    this.getFilename = function () {
      if (!this.labels) return "Unknown";
      let labels = this.labels.map((label) => label.split(` `).join(`-`));
      if (labels.length > 10) {
        labels = labels.splice(0, 10);
      }
      return labels.join(",");
    };

    // listeners
    let listeners = new Listeners();

    this.addListener = function (l) {
      listeners.add(l, this);
    };

    this.removeListener = function (l) {
      listeners.remove(l, this);
    };

    this.notifyListeners = function (reason = "none") {
      listeners.notify(reason, this);
    };

    this.register = function (l) {
      Array.isArray(l) ? listeners.addAll(l, this) : listeners.add(l, this);
    };

    console.log("DataController", this);
    if (this.original) set_data_preview(this.original);

    return this;
  }
}
