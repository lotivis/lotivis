import * as d3 from "d3";
import { DEFAULT_DATE_ORDINATOR } from "./common/date.ordinator";
import { ColorGenerator } from "./common/colors";
import { set_data_preview } from "./common/debug";
import { LOTIVIS_CONFIG } from "./common/config";
import { State } from "./common/statefull.js";

/**
 * Adds the item if it not already exists in the array.
 *
 * @param {*} item The item to add
 * @returns Whether the item was added
 */
Array.prototype.add = function (item) {
  return this.indexOf(item) === -1 ? this.push(item) : false;
};

/**
 * Removes the item.
 *
 * @param {*} item The item to remove
 * @returns Whether the given item was removed
 */
Array.prototype.remove = function (item) {
  let i = this.indexOf(item);
  return i !== -1 ? this.splice(i, 1) : false;
};

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
    var _disp = d3.dispatch("filter", "change");

    this.data = data;

    // private sate
    this.state({ calc: {}, cache: {} });

    // filters
    var change = this.filtersDidChange.bind(this);
    this.filters = { labels: [], locations: [], dates: [], stacks: [] };

    this.on = function (name, callback) {
      return _disp.on(name, callback), this;
    };

    this.call = function (name, that, type, sender) {
      return _disp.call(name, that, type, sender), this;
    };

    this.removeAllListeners = function () {
      return (_disp = d3.dispatch("filter", "change")), this;
    };

    if (LOTIVIS_CONFIG.debug) console.log("[ltv] ", this);
    if (this.original && this.original()) set_data_preview(this.original());

    // # FILTERS

    this.clearFilters = function (sender) {
      this.filters.dates.clear();
      this.filters.locations.clear();
      this.filters.labels.clear();
      this.filters.stacks.clear();
      this.call("filter", this, null, sender);
    };

    this.addLocationFilter = function (location, sender) {
      if (this.filters.locations.add(location, sender))
        this.call("filter", this, location, sender);
    };

    this.removeLocationFilter = function (location, sender) {
      if (this.filters.locations.remove(location, sender))
        this.call("filter", this, location, sender);
    };

    this.addDateFilter = function (date, sender) {
      if (this.filters.dates.add(date, sender))
        this.call("filter", this, date, sender);
    };

    this.removeDateFilter = function (date, sender) {
      if (this.filters.dates.remove(date, sender))
        this.call("filter", this, date, sender);
    };

    this.addLabelFilter = function (label, sender) {
      if (this.filters.labels.add(label, sender))
        this.call("filter", this, label, sender);
    };

    this.removeLabelFilter = function (label, sender) {
      if (this.filters.labels.remove(label, sender))
        this.call("filter", this, label, sender);
    };

    this.addStackFilter = function (stack, sender) {
      if (this.filters.stacks.add(stack, sender))
        this.call("filter", this, stack, sender);
    };

    this.removeStackFilter = function (stack, sender) {
      if (this.filters.stacks.remove(stack, sender))
        this.call("filter", this, stack, sender);
    };

    this.locationFilters = function () {
      return this.filters.locations;
    };

    this.dateFilters = function () {
      return this.filters.dates;
    };

    this.labelFilters = function () {
      return this.filters.labels;
    };

    this.stackFilters = function () {
      return this.filters.stacks;
    };

    this.isFilterLocation = function (loc) {
      return this.filters.locations.indexOf(loc) !== -1;
    };

    this.isFilterDate = function (date) {
      return this.filters.dates.indexOf(date) !== -1;
    };

    this.isFilterLabel = function (label) {
      return this.filters.labels.indexOf(label) !== -1;
    };

    this.isFilterStack = function (stack) {
      return this.filters.stacks.indexOf(stack) !== -1;
    };

    this.toggleLocation = function (loc, sender) {
      this.isFilterLocation(loc)
        ? this.removeLocationFilter(loc, sender)
        : this.addLocationFilter(loc, sender);
    };

    this.toggleDate = function (date, sender) {
      this.isFilterDate(date)
        ? this.removeDateFilter(date, sender)
        : this.addDateFilter(date, sender);
    };

    this.toggleLabel = function (label, sender) {
      this.isFilterLabel(label)
        ? this.removeLabelFilter(label, sender)
        : this.addLabelFilter(label, sender);
    };

    this.toggleStack = function (stack, sender) {
      this.isFilterStack(stack)
        ? this.removeStackFilter(stack, sender)
        : this.addStackFilter(stack, sender);
    };

    return this;
  }

  filtersDidChange(name, reason, item, sender) {
    // console.log("filtersDidChange", name, reason, item, sender);
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

  /** Returns a string _this can be used as filename for downloads. */
  getFilename() {
    if (!this.labels) return "Unknown";
    let labels = this.labels.map((label) => label.split(` `).join(`-`));
    if (labels.length > 10) {
      labels = labels.splice(0, 10);
    }
    return labels.join(",");
  }

  // # SNAPSHOT

  calculateSnapshot() {
    let f = this.filters;
    let snapshot = d3.filter(this.data, (d) => {
      return !(
        (d.location && f.locations.contains(d.location)) ||
        (d.date && f.dates.contains(d.date)) ||
        (d.label && f.labels.contains(d.label)) ||
        (d.stack && f.stacks.contains(d.stack))
      );
    });
    return this.state({ snapshot });
  }

  snapshot() {
    return this.stateItem("snapshot", null);
  }

  snapshotOrData() {
    return this.stateItem("snapshot", this.stateItem("data", null));
  }
}
