import * as d3 from "d3";
import { DEFAULT_DATE_ORDINATOR } from "./date.ordinator";
import { ColorGenerator } from "../common/colors";
import { FilterArray } from "./filter.array";
import { set_data_preview } from "../common/debug";
import { EventEmitter } from "../common/event.emitter";
import { LOTIVIS_CONFIG } from "../common/config";
import { State } from "../common/statefull.js";

export class DataController extends State {
  constructor(data, config) {
    if (!Array.isArray(data)) throw new Error("data not an array.");

    super(
      // public state
      {
        data: data,
        original: data,
        dateAccess: DEFAULT_DATE_ORDINATOR,
        colorGenerator: new ColorGenerator(data),
      },
      config
    );

    // private properties
    var _events = new EventEmitter();
    var _cache = {};

    this.data = data;

    // private sate
    this.state({ calc: {}, cache: {} });

    // filters
    var change = this.filtersDidChange.bind(this);
    this.filters = {
      labels: new FilterArray("labels", change),
      locations: new FilterArray("locations", change),
      dates: new FilterArray("dates", change),
      stacks: new FilterArray("stacks", change),
    };

    // events
    this.on = function (eventName, fn) {
      return _events.on(eventName, fn), this;
    };

    this.off = function (eventName, fn) {
      return _events.off(eventName, fn), this;
    };

    this.emit = function (eventName, ...args) {
      return _events.emit(eventName, args), this;
    };

    this.removeAllListeners = function () {
      return _events.removeAllListeners(), this;
    };

    if (LOTIVIS_CONFIG.debug) console.log("[ltv] ", this);
    if (this.original && this.original()) set_data_preview(this.original());

    return this;
  }

  filtersDidChange(name, reason, item, sender) {
    this.calculateSnapshot();
    this.emit("change", this, name, reason, sender, item);
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
    return this.cache("labels", () => Array.from(this.byLabel().keys()));
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

  /** Returns a string _this can be used as filename for downloads. */
  getFilename() {
    if (!this.labels) return "Unknown";
    let labels = this.labels.map((label) => label.split(` `).join(`-`));
    if (labels.length > 10) {
      labels = labels.splice(0, 10);
    }
    return labels.join(",");
  }
}
