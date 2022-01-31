import * as d3 from "d3";
import { FILENAME_GENERATOR } from "./common/filename.js";
import { DEFAULT_DATE_ORDINATOR } from "./common/date.ordinator";
import { ColorGenerator } from "./common/colors";
import { data_preview } from "./common/config.js";
import { LOTIVIS_CONFIG, append } from "./common/config";
import { isEmpty } from "./common/values";
import { Data } from "./data";

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

export class DataController {
  constructor(data) {
    if (!Array.isArray(data)) throw new Error("data not an array.");

    let _data = Data(data),
      filenameGen = FILENAME_GENERATOR,
      dateAccess = DEFAULT_DATE_ORDINATOR,
      colorGenerator = new ColorGenerator(_data),
      disp = d3.dispatch("filter", "change"),
      debug = true;

    this.data = Data(data);
    this.filters = { labels: [], locations: [], dates: [], stacks: [] };

    // private
    function callFilterChange(name, item, sender) {
      if (!sender) throw new Error("missing sender");
      if (debug) console.log("filter", name, item);
      return disp.call("filter", this, name, item, sender), this;
    }

    // public api

    this.on = function (name, callback) {
      return disp.on(name, callback), this;
    };

    /**
     * Removes all callbacks from the dispatcher.
     * @returns {this} The chart itself
     */
    this.removeAllListeners = function () {
      return (disp = d3.dispatch("filter", "change")), this;
    };

    // # FILTERS

    this.clearFilters = function (sender) {
      this.filters.dates.clear();
      this.filters.locations.clear();
      this.filters.labels.clear();
      this.filters.stacks.clear();
      callFilterChange("all", null, sender);
    };

    this.clearLabelFilters = function (sender) {
      if (!isEmpty(this.filters.labels))
        (this.filters.labels = []), callFilterChange("label", null, sender);
    };

    this.clearStackFilters = function (sender) {
      if (!isEmpty(this.filters.stacks))
        (this.filters.stacks = []), callFilterChange("stack", null, sender);
    };

    this.clearLocationFilters = function (sender) {
      if (!isEmpty(this.filters.locations))
        (this.filters.locations = []),
          callFilterChange("location", null, sender);
    };

    this.clearDateFilters = function (sender) {
      if (!isEmpty(this.filters.dates))
        (this.filters.dates = []), callFilterChange("date", null, sender);
    };

    this.addLocationFilter = function (location, sender) {
      if (this.filters.locations.add(location, sender))
        callFilterChange("location", location, sender);
    };

    this.removeLocationFilter = function (location, sender) {
      if (this.filters.locations.remove(location, sender))
        callFilterChange("location", location, sender);
    };

    this.addDateFilter = function (date, sender) {
      if (this.filters.dates.add(date, sender))
        callFilterChange("date", date, sender);
    };

    this.removeDateFilter = function (date, sender) {
      if (this.filters.dates.remove(date, sender))
        callFilterChange("date", date, sender);
    };

    this.addLabelFilter = function (label, sender) {
      if (this.filters.labels.add(label, sender))
        callFilterChange("label", label, sender);
    };

    this.removeLabelFilter = function (label, sender) {
      if (this.filters.labels.remove(label, sender))
        callFilterChange("label", label, sender);
    };

    this.addStackFilter = function (stack, sender) {
      if (this.filters.stacks.add(stack, sender))
        callFilterChange("stack", stack, sender);
    };

    this.removeStackFilter = function (stack, sender) {
      if (this.filters.stacks.remove(stack, sender))
        callFilterChange("stack", stack, sender);
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

    /**
     * Gets or sets the filename generator.
     *
     * @param {*} _
     * @returns {filenameGen | this}
     */
    this.filenameGenerator = function (_) {
      return arguments.length ? ((filenameGen = _), this) : filenameGen;
    };

    this.dateAccess = function (_) {
      return arguments.length ? ((dateAccess = _), this) : dateAccess;
    };

    this.colorGenerator = function (_) {
      return arguments.length ? ((colorGenerator = _), this) : colorGenerator;
    };

    this.debug = function (_) {
      return arguments.length ? ((debug = _), this) : debug;
    };

    this.labelColor = colorGenerator.label;
    this.stackColor = colorGenerator.stack;

    this.calculateSnapshot.bind(this)();
    // console.timeEnd("DataController");

    if (LOTIVIS_CONFIG.debug && this.debug) console.log("[ltv] ", this);
    data_preview(this);

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

  /**
   *
   * @param {string} ext
   * @param {string} prefix
   * @returns The generated filename
   */
  filename(ext, prefix) {
    let generator = this.filenameGenerator() || FILENAME_GENERATOR;
    let name = generator(this.data, this);
    if (prefix) name = prefix + "-" + name;
    if (ext) name = append(name, ".") + ext;
    return generator(this.data, this, prefix, ext);
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

  // # SNAPSHOT

  calculateSnapshot() {
    // console.time("calculateSnapshot");
    let f = this.filters;
    let snapshot = d3.filter(this.data, (d) => {
      return !(
        f.locations.indexOf(d.location) !== -1 ||
        f.dates.indexOf(d.dateAccess) !== -1 ||
        f.labels.indexOf(d.label) !== -1 ||
        f.stacks.indexOf(d.stack) !== -1
      );
    });
    return (this.snapshotData = snapshot), this;
  }

  snapshot() {
    return this.snapshotData;
  }

  snapshotOrData() {
    return this.snapshotData ?? this.data;
  }
}
