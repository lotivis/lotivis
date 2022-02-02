import * as d3 from "d3";
import { FILENAME_GENERATOR } from "./common/filename.js";
import { DEFAULT_DATE_ORDINATOR } from "./common/date.ordinator";
import { DataColors } from "./common/colors";
import { Data } from "./data";
import { data_preview, ltv_debug } from "./common/debug.js";
import { uniqueId } from "./common/identifiers.js";
import { prefix } from "./common/affix";
import { datatext } from "./datatext";
import { CONFIG } from "./common/config";
import { URLParams } from "./common/url.parameters.js";
import { isEmpty } from "./common/values.js";

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

        let id = uniqueId("dc");

        // create data model
        data = Data(data);

        let disp = d3.dispatch("filter", "data");
        let attr = {
            data: data,
            snapshot: data,
            filters: { labels: [], locations: [], dates: [], stacks: [] },
            filenameGenerator: FILENAME_GENERATOR,
            dataColors: DataColors(data),
            dateAccess: DEFAULT_DATE_ORDINATOR,
        };

        // expose attributes
        Object.keys(attr).forEach((key) => {
            // do not override existing functions
            if (typeof this[key] === "function") return;
            this[key] = function (_) {
                return arguments.length ? ((attr[key] = _), this) : attr[key];
            };
        });

        // private

        function calculateSnapshot() {
            if (CONFIG.debug) console.time("calculateSnapshot");
            let f = attr.filters;
            if (
                isEmpty(f.labels) &&
                isEmpty(f.stacks) &&
                isEmpty(f.locations) &&
                isEmpty(f.dates)
            )
                attr.snapshot = d3.filter(attr.data, (d) => {
                    return !(
                        f.locations.indexOf(d.location) !== -1 ||
                        f.dates.indexOf(d.date) !== -1 ||
                        f.labels.indexOf(d.label) !== -1 ||
                        f.stacks.indexOf(d.stack) !== -1
                    );
                });
            if (CONFIG.debug) console.timeEnd("calculateSnapshot");
            return attr.snapshot;
        }

        function applyURLParameters() {
            let fromURL = URLParams.object(id + "-filters");

            if (fromURL) {
                ltv_debug("found filters in URL", fromURL);
                ["labels", "stacks", "locations", "dates"].forEach((name) =>
                    Array.isArray(fromURL[name])
                        ? (attr.filters[name] = fromURL[name])
                        : null
                );
            }
        }

        // listeners
        this.id = id;

        /**
         * Adds a listener with the passed name for filter changes.
         * @param {*} name The name of the listener
         * @param {*} callback The callback handler
         * @returns {this} The controller iteself
         */
        this.onFilter = function (name, callback) {
            return disp.on(prefix(name, "filter."), callback), this;
        };

        /**
         * Adds a listener with the passed name for data changes.
         * @param {*} name The name of the listener
         * @param {*} callback The callback handler
         * @returns {this} The controller iteself
         */
        this.onChange = function (name, callback) {
            return disp.on(prefix(name, "data."), callback), this;
        };

        /**
         * Removes all callbacks from the dispatcher.
         * @returns {this} The chart itself
         */
        this.removeAllListeners = function () {
            return (disp = d3.dispatch("filter", "change")), this;
        };

        // # FILTERS

        this.filtersDidChange = function (name, action, item, sender) {
            if (!sender) throw new Error("missing sender");

            // do calculations
            calculateSnapshot();

            URLParams.object(
                this.id + "-filters",
                this.hasFilters() ? this.filters() : null
            );

            // call listeners
            disp.call("filter", this, sender, name, action, item);
        };

        this.filters = function (name) {
            if (!arguments.length) return attr.filters;
            if (!attr.filters[name]) throw new Error("invalid name: " + name);
            return attr.filters[name];
        };

        this.hasFilters = function (name) {
            return arguments.length
                ? this.filters(name).length > 0
                : this.hasFilters("labels") ||
                      this.hasFilters("stacks") ||
                      this.hasFilters("locations") ||
                      this.hasFilters("dates");
        };

        this.clear = function (name, sender) {
            if (this.filters(name).length === 0)
                return ltv_debug("filter already empty", name);
            attr.filters[name] = [];
            return this.filtersDidChange(name, "clear", null, sender);
        };

        this.clearAll = function (sender) {
            if (this.hasFilters()) {
                attr.filters = {
                    labels: [],
                    locations: [],
                    dates: [],
                    stacks: [],
                };
                this.filtersDidChange("all", "clear", null, sender);
            }
        };

        /**
         * Returns true if the filters with the passed name contains the passed item.
         * @param {String} name The name of the filter
         * @param {String} item The item to check if it is filtered.
         * @returns {Boolean} Whether the item is filtered
         */
        this.isFilter = function (name, item) {
            return this.filters(name).indexOf(item) !== -1;
        };

        /**
         * Adds the passed item to the collection of filters with the passed name.
         * @param {*} name The name of the filter
         * @param {*} item The item to check if it is filtered
         * @param {*} sender The sender who made this action
         */
        this.addFilter = function (name, item, sender) {
            if (this.filters(name).add(item))
                this.filtersDidChange(name, "add", item, sender);
        };

        /**
         * Removes the passed item from the collection of filters with the passed name.
         * @param {*} name The name of the filter
         * @param {*} item The item to remove
         * @param {*} sender The sender who made this action
         */
        this.removeFilter = function (name, item, sender) {
            if (this.filters(name).remove(item))
                this.filtersDidChange(name, "remove", item, sender);
        };

        /**
         * Toggles the filtered state of the passed item in the collection of filters
         * with the passed name.
         * @param {*} name The name of the filter
         * @param {*} item The item to toggle
         * @param {*} sender The sender who made this action
         */
        this.toggleFilter = function (name, item, sender) {
            this.isFilter(name, item)
                ? this.removeFilter(name, item, sender)
                : this.addFilter(name, item, sender);
        };

        /**
         * Gets or sets the snapshot attribute. When getting and snapshot is null
         * will fallback on data attribute.
         * @param {*} _
         * @returns {snapshot|this}
         */
        this.snapshot = function (_) {
            return arguments.length
                ? ((attr.snapshot = _), this)
                : attr.snapshot ?? attr.data;
        };

        this.labelColor = function (label) {
            return attr.dataColors.label(label);
        };

        this.stackColor = function (stack) {
            return attr.dataColors.stack(stack);
        };

        /**
         * Generates and returns a filename from the data with the passed
         * extension and prefix.
         * @param {string} ext The extension of the filename
         * @param {string} prefix An optional prefix for the filename
         * @returns The generated filename
         */
        this.filename = function (extension, prefix) {
            return this.filenameGenerator()(
                this,
                this.data(),
                extension,
                prefix
            );
        };

        this.datatext = function (id = "ltv-data") {
            if (!document.getElementById(id)) return null;
            return datatext()
                .selector("#" + id)
                .dataController(this)
                .run();
        };

        // initialize
        applyURLParameters();
        calculateSnapshot();

        // debug
        ltv_debug("data controller", this.id, this);
        data_preview(this);

        return this;
    }

    /** Returns entries with valid value. */
    filterValid() {
        return this.data().filter((d) => d.value);
    }

    byLabel() {
        return d3.group(this.data(), (d) => d.label);
    }

    byStack() {
        return d3.group(this.data(), (d) => d.stack || d.label);
    }

    byLocation() {
        return d3.group(this.data(), (d) => d.location);
    }

    byDate() {
        return d3.group(this.data(), (d) => d.date);
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
        return this.data().filter((d) => d.stack === s);
    }

    dataLabel(l) {
        return this.data().filter((d) => d.label === l);
    }

    dataLocation(l) {
        return this.data().filter((d) => d.location === l);
    }

    dataDate(d) {
        return this.data().filter((d) => d.date === d);
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

    // sum() {
    //   return d3.sum(this.data, (d) => d.value);
    // }

    // max() {
    //   return d3.max(this.data, (item) => item.value);
    // }

    // min() {
    //   return d3.min(this.data, (item) => item.value);
    // }
}
