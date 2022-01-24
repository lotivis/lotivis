/*!
 * lotivis.js 1.0.94 <https://github.com/lukasdanckwerth/lotivis#readme>
 * Copyright (c) 2022 Lukas Danckwerth
 * Released under MIT License
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(
        exports,
        require("d3"),
        require("topojson-server"),
        require("topojson-client")
      )
    : typeof define === "function" && define.amd
    ? define(["exports", "d3", "topojson-server", "topojson-client"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory(
        (global.lotivis = {}),
        global.d3$1,
        global.topojsonServer,
        global.topojsonClient
      ));
})(this, function (exports, d3$1, topojsonServer, topojsonClient) {
  "use strict";

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(
            n,
            k,
            d.get
              ? d
              : {
                  enumerable: true,
                  get: function () {
                    return e[k];
                  },
                }
          );
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var d3__namespace = /*#__PURE__*/ _interopNamespace(d3$1);
  var topojsonServer__namespace =
    /*#__PURE__*/ _interopNamespace(topojsonServer);
  var topojsonClient__namespace =
    /*#__PURE__*/ _interopNamespace(topojsonClient);

  const formatGerman = "%d.%m.%Y";
  const formatIso = "%Y-%m-%d";

  function DEFAULT_DATE_ORDINATOR(value) {
    return value;
  }

  function DATE_TO_NUMBER_ORDINATOR(date) {
    return Number(date);
  }

  function GERMAN_DATE_ORDINATOR(string) {
    return Number(d3__namespace.timeParse(formatGerman)(string));
  }

  function ISO_DATE_ORDINATOR(string) {
    return Number(d3__namespace.timeParse(formatIso)(string));
  }

  function WEEKDAY_ORDINATOR(weekday) {
    let lowercase = weekday.toLowerCase();
    switch (lowercase) {
      case "sunday":
      case "sun":
        return 0;
      case "monday":
      case "mon":
        return 1;
      case "tuesday":
      case "tue":
        return 2;
      case "wednesday":
      case "wed":
        return 3;
      case "thursday":
      case "thr":
        return 4;
      case "friday":
      case "fri":
        return 5;
      case "saturday":
      case "sat":
        return 6;
      default:
        return -1;
    }
  }

  var date_ordinator = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    DEFAULT_DATE_ORDINATOR: DEFAULT_DATE_ORDINATOR,
    DATE_TO_NUMBER_ORDINATOR: DATE_TO_NUMBER_ORDINATOR,
    GERMAN_DATE_ORDINATOR: GERMAN_DATE_ORDINATOR,
    ISO_DATE_ORDINATOR: ISO_DATE_ORDINATOR,
    WEEKDAY_ORDINATOR: WEEKDAY_ORDINATOR,
  });

  const colorScheme = d3__namespace.schemeCategory10;
  const tintColor = d3__namespace.color();

  class ColorGenerator {
    constructor(data) {
      let stacksToLabels = d3__namespace.group(
        data,
        (d) => d.stack || d.label,
        (d) => d.label
      );

      let stacks = Array.from(stacksToLabels.keys());

      function stackLabels(stack) {
        return Array.from(stacksToLabels.get(stack).keys() || []);
      }

      function stackColor(stack) {
        return colorScheme[stacks.indexOf(stack) % colorScheme.length];
      }

      // let colorScheme = d3.schemeCategory10;

      let stackToColor = new Map();
      let labelToColor = new Map();
      for (let i = 0; i < stacks.length; i++) {
        let stack = stacks[i];
        let labels = stackLabels(stack);
        let c1 = d3__namespace.color(stackColor(stack));
        let c2 = c1.darker().darker();
        let generator = d3__namespace
          .scaleLinear()
          .domain([0, labels.length])
          .range([c1, c2]);

        stackToColor.set(stack, c1);

        for (let j = 0; j < labels.length; j++) {
          let label = labels[j];
          let color = generator(j);
          labelToColor.set(label, color);
        }
      }

      this.stack = function (stack) {
        return stackToColor.get(stack) || tintColor;
      };

      this.label = function (label) {
        return labelToColor.get(label) || tintColor;
      };

      this.stackColors = function (stack) {
        let c1 = d3__namespace.color(this.stack(stack));
        let c2 = c1.darker().darker();
        let size = stacksToLabels.get(stack).size;
        let generator = d3__namespace
          .scaleLinear()
          .domain([0, size])
          .range([c1, c2]);
        let colors = d3__namespace.range(0, size).map(generator);
        return colors;
      };
    }
  }

  function MapColors(till) {
    return d3__namespace
      .scaleLinear()
      .domain([0, (1 / 3) * till, (2 / 3) * till, till])
      .range(["yellow", "orange", "red", "purple"]);
  }

  function PlotColors(till) {
    return d3__namespace
      .scaleLinear()
      .domain([0, (1 / 3) * till, (2 / 3) * till, till])
      .range(["yellow", "orange", "red", "purple"]);
  }

  class FilterArray extends Array {
    constructor(listener) {
      super();
      this.listener = listener;
    }

    notify(reason, item, notify = true) {
      if (notify) this.listener(reason, item);
    }

    add(item, notify = true) {
      if (this.indexOf(item) === -1)
        this.push(item), this.notify("add", item, notify);
    }

    addAll(source) {
      if (!Array.isArray(source)) throw new Error("no array given");
      this.push(...source), this.notify("add", item, notify);
    }

    remove(item, notify = true) {
      let i = this.indexOf(item);
      if (i !== -1) this.splice(i, 1), this.notify("remove", item, notify);
    }

    toggle(item, notify = true) {
      let i = this.indexOf(item);
      i === -1 ? this.push(item) : this.splice(i, 1);
      this.notify("toggle", item, notify);
    }

    contains(item) {
      return this.indexOf(item) !== -1;
    }

    clear(notify = true) {
      if (this.length !== 0) {
        this.splice(0, this.length);
        this.notify("clear", null, notify);
      }
    }
  }

  const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat("en-EN", {
    maximumFractionDigits: 3,
  }).format;

  const GERMAN_NUMBER_FORMAT = new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 3,
  }).format;

  var LOTIVIS_CONFIG$1 = {
    // The default margin to use for charts.
    defaultMargin: 60,
    // The default offset for the space between an object an the toolbar.
    tooltipOffset: 7,
    // The default radius to use for bars drawn on a chart.
    barRadius: 5,
    // A Boolean value indicating whether the debug logging is enabled.
    debugLog: false,
    // A Boolean value indicating whether the debug logging is enabled.
    debug: true,
    // A string which is used as prefix for download.
    downloadFilePrefix: "lotivis",
    // A string which is used as separator between components when creating a file name.
    filenameSeparator: "_",
    // A string which is used for unknown values.
    unknown: "LOTIVIS_UNKNOWN",
    // The default number formatter used by all charts.
    numberFormat: GERMAN_NUMBER_FORMAT,
  };

  const DEFAULT_MARGIN = {
    top: LOTIVIS_CONFIG$1.defaultMargin,
    right: LOTIVIS_CONFIG$1.defaultMargin,
    bottom: LOTIVIS_CONFIG$1.defaultMargin,
    left: LOTIVIS_CONFIG$1.defaultMargin,
  };

  var lotivis_log = () => null;

  /**
   * Sets whether lotivis prints debug log messages to the console.
   * @param enabled A Boolean value indicating whether to enable debug logging.
   * @param printConfig A Boolean value indicating whether to print the global lotivis configuration.  Default is false.
   */
  function debug(enabled, printConfig = false) {
    lotivis_log = enabled ? console.log : () => null;
    lotivis_log(`[ltv]  ${enabled ? "En" : "Dis"}abled debug mode.`);
    if (!printConfig) return;
    lotivis_log(
      `LOTIVIS_CONFIG = ${JSON.stringify(LOTIVIS_CONFIG$1, null, 2)}`
    );
  }

  function isString(v) {
    return typeof v === "string" || v instanceof String;
  }

  function set_data_preview(v) {
    if (!v || !LOTIVIS_CONFIG$1.debug) return;
    if (typeof document === "undefined") return;
    let s = isString(v) ? v : JSON.stringify(v, null, 2);
    let e = document.getElementById("ltv-data-preview");
    if (e) e.textContent = s;
  }

  function snapshot(controller) {
    let f = controller.filters;
    return d3__namespace.filter(controller.data, (d) => {
      return !(
        (d.location && f.locations.contains(d.location)) ||
        (d.date && f.dates.contains(d.date)) ||
        (d.label && f.labels.contains(d.label)) ||
        (d.stack && f.stacks.contains(d.stack))
      );
    });
  }

  // Code from:
  // https://www.freecodecamp.org/news/how-to-code-your-own-event-emitter-in-node-js-a-step-by-step-guide-e13b7e7908e1/

  class EventEmitter {
    listeners = {};

    addListener(eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
      return this;
    }

    on(eventName, fn) {
      return this.addListener(eventName, fn);
    }

    once(eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      const onceWrapper = () => {
        fn();
        this.off(eventName, onceWrapper);
      };
      this.listeners[eventName].push(onceWrapper);
      return this;
    }

    off(eventName, fn) {
      return this.removeListener(eventName, fn);
    }

    removeListener(eventName, fn) {
      let lis = this.listeners[eventName];
      if (!lis) return this;
      for (let i = lis.length; i > 0; i--) {
        if (lis[i] === fn) {
          lis.splice(i, 1);
          break;
        }
      }
      return this;
    }

    emit(eventName, ...args) {
      let fns = this.listeners[eventName];
      if (!fns) return false;
      fns.forEach((f) => {
        f(...args);
      });
      return true;
    }

    listenerCount(eventName) {
      let fns = this.listeners[eventName] || [];
      return fns.length;
    }

    rawListeners(eventName) {
      return this.listeners[eventName];
    }

    removeAllListeners() {
      this.listeners = {};
    }
  }

  class DataController extends EventEmitter {
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
      return d3__namespace.group(this.data, (d) => d.label);
    }

    byStack() {
      return d3__namespace.group(this.data, (d) => d.stack || d.label);
    }

    byLocation() {
      return d3__namespace.group(this.data, (d) => d.location);
    }

    byDate() {
      return d3__namespace.group(this.data, (d) => d.date);
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
      return d3__namespace.sum(this.dataStack(s), (d) => d.value);
    }

    sumOfLabel(l) {
      return d3__namespace.sum(this.dataLabel(l), (d) => d.value);
    }

    sumOfLocation(l) {
      return d3__namespace.sum(this.dataLocation(l), (d) => d.value);
    }

    sumOfDate(d) {
      return d3__namespace.sum(this.dataDate(s), (d) => d.value);
    }

    sum() {
      return d3__namespace.sum(this.data, (d) => d.value);
    }

    max() {
      return d3__namespace.max(this.data, (item) => item.value);
    }

    min() {
      return d3__namespace.min(this.data, (item) => item.value);
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

  const DEFAULT_COLUMNS = ["label", "location", "date", "value", "stack"];

  function csvParse(text) {
    return new DataController(d3$1.csvParse(text, d3.autoType));
  }

  async function csv(path) {
    return fetch(path).then((csv) => csvParse(csv));
  }

  function csvRender(data, columns = DEFAULT_COLUMNS) {
    return d3$1.csvFormat(data.data ? data.data : data, columns);
  }

  class DataUnqualifiedError extends Error {
    constructor(message) {
      super(message);
      this.name = "DataUnqualifiedError";
    }
  }

  function parseDataset(d) {
    return new DataController(flatDataset(d));
  }

  function parseDatasets(d) {
    return new DataController(flatDatasets(d));
  }

  function flatDataset(d) {
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

  function flatDatasets(ds) {
    return ds.reduce((memo, d) => memo.concat(flatDataset(d)), []);
  }

  function json(path) {
    return d3$1.json(path).then((json) => {
      if (!Array.isArray(json)) throw new DataUnqualifiedError();
      let flat = flatDatasets(json);
      let controller = new DataController(flat, { original: json });
      return controller;
    });
  }

  /**
   * Returns `true` if the given value not evaluates to false and is not 0. false else.
   * @param value The value to check.
   * @returns {boolean} A Boolean value indicating whether the given value is valid.
   */
  function isValue(value) {
    return Boolean(value || value === 0);
  }

  function DataItem(item) {
    return { date: item.date, location: item.location, value: item.value };
  }

  function Dataset(item) {
    let set = { label: item.label, data: [DataItem(item)] };
    if (isValue(item.stack)) set.stack = item.stack;
    return set;
  }

  function toDataset(data) {
    let datasets = [],
      item,
      set,
      datum;
    for (let i = 0; i < data.length; i++) {
      item = data[i];
      set = datasets.find((d) => d.label === item.label);

      if (set) {
        datum = set.data.find(
          (d) => d.date === item.date && d.location === item.location
        );
        if (datum) {
          datum.value += item.value;
        } else {
          set.data.push(DataItem(item));
        }
      } else {
        datasets.push(Dataset(item));
      }
    }

    return datasets;
  }

  class Component extends EventEmitter {
    constructor(selector) {
      if (!selector) throw new Error("no selector specified");
      super();
      this.selector = selector;
      this.element = d3__namespace.select("#" + selector);
      if (this.element.empty())
        throw new Error('invalid selector "' + selector + '"');
      this.element.attr("id", this.selector);
    }

    // MARK: - Functions

    show() {
      if (this.element) this.element.style("display", "");
    }

    hide() {
      if (this.element) this.element.style("display", "none");
    }

    get isVisible() {
      return !this.element ? this.element.style("display") !== "none" : false;
    }

    getElementEffectiveSize() {
      if (!this.element) return [0, 0];
      let width = this.element.style("width").replace("px", "");
      let height = this.element.style("height").replace("px", "");
      return [Number(width), Number(height)];
    }

    getElementPosition() {
      let element = document.getElementById(this.selector);
      if (!element) return [0, 0];
      let rect = element.getBoundingClientRect();
      let xPosition = rect.x + window.scrollX;
      let yPosition = rect.y + window.scrollY;
      return [xPosition, yPosition];
    }

    toString() {
      return "[" + getClassname() + ", id: " + this.selector + "]";
    }

    getClassname() {
      return !this.constructor || !this.constructor.name
        ? typeof this
        : this.constructor.name;
    }
  }

  let unique = 0;

  function next() {
    return "ltv-id-" + unique++;
  }

  function create_id() {
    return next();
  }

  class Chart extends Component {
    constructor(selector, config) {
      super(selector);

      this.svgSelector = (this.selector || create_id()) + "-svg";
      this.config = config || {};
      this.renderers = [];
      this.updateSensible = true;

      this.createSVG();
      this.initialize();
      this.addRenderers();

      // check for data controller in config
      if (this.config.dataController instanceof DataController) {
        this.setController(this.config.dataController);
        delete this.config.dataController;
      }
    }

    initialize() {}

    addRenderers() {}

    dataView() {}

    createSVG() {
      this.svg = this.element
        .append("svg")
        .attr("id", this.svgSelector)
        .attr("class", "ltv-chart-svg");
    }

    remove(c) {
      this.removeAllListeners();
      this.svg.selectAll("*").remove();
    }

    prepare(c) {
      // empty
    }

    draw() {
      this.renderers.forEach((r) =>
        r.render(this, this.controller, this.dataView)
      );
    }

    redraw() {
      if (this.controller) this.update(this.controller, "redraw");
    }

    makeUpdateInsensible() {
      this.updateSensible = false;
    }

    makeUpdateSensible() {
      this.updateSensible = true;
    }

    update(controller, filter, reason) {
      if (!this.updateSensible) return;
      if (!this.controller) return;
      this.dataView = this.createDataView();
      this.remove();
      this.prepare();
      this.draw();
    }

    setController(dc) {
      this.controller = dc;
      this.controller.on("change", (d, f, r) => this.update(d, r, f));
      this.update(dc, "registration");
    }
  }

  const BAR_CHART_TYPE = {
    stacks: "stacks",
    combine: "combine",
  };

  const DATE_ACCESS = function (d) {
    return d;
  };

  const BAR_CHART_CONFIG = {
    width: 1000,
    height: 600,
    margin: DEFAULT_MARGIN,
    type: "stacks",
    labels: false,
    selectable: true,
    dateAccess: DATE_ACCESS,
  };

  class Renderer {
    render() {}
  }

  class BarAxisRender extends Renderer {
    render(chart, controller) {
      let height = chart.config.height;
      let margin = chart.config.margin;

      // left axis
      chart.svg
        .append("g")
        .call(d3$1.axisLeft(chart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom axis
      chart.svg
        .append("g")
        .call(d3$1.axisBottom(chart.xChartScale))
        .attr("transform", () => `translate(0,${height - margin.bottom})`);
    }
  }

  class BarLabelsRenderer extends Renderer {
    render(chart, controller) {
      if (!chart.config.labels) return;

      function translate(x, y) {
        return `translate(${x},${y})rotate(-60)`;
      }

      let dates = chart.dataView.dates;
      let byDateStack = chart.dataView.byDateStack;

      let xChartScale = chart.xChartScale;
      let yChart = chart.yChart;
      let xStack = chart.xStack;
      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG$1.numberFormat;
      let width = chart.xStack.bandwidth() / 2;

      let labels = chart.svg.append("g").selectAll("g").data(dates).enter();

      labels
        .append("g")
        .attr("transform", (date) => `translate(${xChartScale(date)},0)`)
        .selectAll(".text")
        .data((date) => byDateStack.get(date))
        .enter()
        .append("text")
        .attr("class", "ltv-bar-chart-label")
        .attr("transform", (d) => {
          let stack = d[0];
          let value = d[1];
          return translate((xStack(stack) || 0) + width, yChart(value) - 5);
        })
        .text((d) => (d[1] === 0 ? "" : numberFormat(d[1])))
        .raise();
    }
  }

  class BarLegendRenderer extends Renderer {
    render(chart, controller, dataView) {
      return;
    }
  }

  class BarBarsRenderer extends Renderer {
    render(chart, controller) {
      let radius = chart.config.barRadius || LOTIVIS_CONFIG$1.barRadius;
      let colors = controller.colorGenerator;
      let barWidth = chart.xStack.bandwidth();
      let yChart = chart.yChart;
      let height = chart.yChart(0);
      let selectionOpacity = 0.3;

      function opacity(date) {
        return controller.filters.dates.contains(date) ? selectionOpacity : 1;
      }

      function redraw() {
        chart.svg
          .selectAll(`.ltv-bar-chart-dates-area`)
          .attr(`opacity`, (d) => opacity(d[0]))
          .raise();
      }

      chart.on("click-date", redraw);

      function combined() {
        chart.svg
          .append("g")
          .selectAll("g")
          .data(chart.dataView.byDateStack)
          .enter()
          .append("g")
          .attr("transform", (d) => `translate(${chart.xChartScale(d[0])},0)`)
          .attr("opacity", (d) => opacity(d[0]))
          .attr("class", "ltv-bar-chart-dates-area")
          .selectAll("rect")
          .data((d) => d[1]) // map to by stack
          .enter()
          .append("rect")
          .attr("class", "ltv-bar-chart-bar")
          .attr("fill", (d) => colors.stack(d[0]))
          .attr("x", (d) => chart.xStack(d[0]))
          .attr("y", (d) => chart.yChart(d[1]))
          .attr("width", barWidth)
          .attr("height", (d) => height - chart.yChart(d[1]))
          .attr("rx", radius)
          .attr("ry", radius)
          .raise();
      }

      function stacked() {
        chart.svg
          .append("g")
          .selectAll("g")
          .data(chart.dataView.byDatesStackSeries)
          .enter()
          .append("g")
          .attr("transform", (d) => `translate(${chart.xChartScale(d[0])},0)`)
          .attr("opacity", (d) => opacity(d[0]))
          .attr("class", "ltv-bar-chart-dates-area")
          .selectAll("rect")
          .data((d) => d[1]) // map to by stack
          .enter()
          .append("g")
          .attr("transform", (d) => `translate(${chart.xStack(d[0])},0)`)
          .selectAll("rect")
          .data((d) => d[1]) // map to series
          .enter()
          .append("rect")
          .attr("y", (d) => yChart(d[1]))
          .attr("width", barWidth)
          .attr("height", (d) => (!d[1] ? 0 : yChart(d[0]) - yChart(d[1])))
          .attr("class", "ltv-bar-chart-bar")
          .attr("fill", (d) => colors.label(d[2]))
          .attr("rx", radius)
          .attr("ry", radius)
          .raise();
      }

      if (chart.config.type === BAR_CHART_TYPE.combine) {
        combined();
      } else {
        stacked();
      }
    }
  }

  class BarTooltipRenderer extends Renderer {
    render(chart, controller, dataView) {
      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG$1.numberFormat;

      chart.element.select(".ltv-tooltip").remove();
      const tooltip = chart.element
        .append("div")
        .attr("class", "ltv-tooltip")
        .attr("rx", 5) // corner radius
        .attr("ry", 5)
        .style("opacity", 0);

      function getTooltipSize() {
        let tooltipWidth = Number(tooltip.style("width").replace("px", ""));
        let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
        return [tooltipWidth, tooltipHeight];
      }

      function getTop(factor, offset, tooltipSize) {
        let top = chart.config.margin.top * factor;
        top += (chart.graphHeight * factor - tooltipSize[1]) / 2;
        top += offset[1] - 10;
        return top;
      }

      function getXLeft(date, factor, offset, tooltipSize) {
        let x = chart.xChartScalePadding(date) * factor;
        return (
          x + offset[0] - tooltipSize[0] - 22 - LOTIVIS_CONFIG$1.tooltipOffset
        );
      }

      function getXRight(date, factor, offset) {
        let x =
          chart.xChartScalePadding(date) + chart.xChartScalePadding.bandwidth();
        x *= factor;
        x += offset[0] + LOTIVIS_CONFIG$1.tooltipOffset;
        return x;
      }

      function getHTMLForDate(date) {
        let byDateLabel = dataView.byDateLabel;
        let filtered = byDateLabel.get(date);
        if (!filtered) return "No Data";

        let title = `${date}`;
        let sum = 0;
        let dataHTML = Array.from(filtered.keys())
          .map(function (label) {
            let value = filtered.get(label);
            if (!value) return undefined;
            let colorGenerator = chart.controller.colorGenerator;
            let color = colorGenerator.label(label);
            let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
            let valueFormatted = numberFormat(value);
            sum += value;
            return `${divHTML} ${label}: <b>${valueFormatted}</b>`;
          })
          .filter((d) => d)
          .join("<br>");

        let sumFormatted = numberFormat(sum);
        return `<b>${title}</b><br>${dataHTML}<br><br>Sum: <b>${sumFormatted}</b>`;
      }

      function showTooltip(event, date) {
        // set examples content before positioning the tooltip cause the size is
        // calculated based on the size
        const html = getHTMLForDate(date);
        tooltip.html(html);

        // position tooltip
        let tooltipSize = getTooltipSize();
        let factor = chart.getElementEffectiveSize()[0] / chart.config.width;
        let offset = chart.getElementPosition();
        let top = getTop(factor, offset, tooltipSize);
        let left = chart.xChartScalePadding(date);

        // differ tooltip position on bar position
        if (left > chart.config.width / 2) {
          left = getXLeft(date, factor, offset, tooltipSize);
        } else {
          left = getXRight(date, factor, offset);
        }

        // update position and opacity of tooltip
        tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`)
          .style("opacity", 1);
      }

      function hideTooltip() {
        if (+tooltip.style("opacity") === 0) return;
        tooltip.style("opacity", 0);
      }

      chart.on("mouseenter", showTooltip);
      chart.on("mouseout", hideTooltip);
    }
  }

  // https://stackoverflow.com/questions/70579/what-are-valid-values-for-the-id-attribute-in-html
  // ids must not contain whitespaces
  // ids should avoid ".", ":" and "/"

  function safeId(id) {
    return id
      .split(` `)
      .join(`-`)
      .split(`/`)
      .join(`-`)
      .split(`.`)
      .join(`-`)
      .split(`:`)
      .join(`-`);
  }

  class BarSelectionRenderer extends Renderer {
    render(chart, controller) {
      let selectionOpacity = 0.1;

      function opacity(date) {
        return controller.filters.dates.contains(date) ? selectionOpacity : 0;
      }

      function createID(date) {
        return `ltv-bar-chart-selection-rect-id-${safeId(String(date))}`;
      }

      function redraw() {
        chart.svg
          .selectAll(`.ltv-bar-chart-selection-rect`)
          .attr(`opacity`, (date) => opacity(date))
          .raise();
      }

      chart.on("click-date", redraw);

      let margin = chart.config.margin;
      let dates = chart.config.dates || chart.dataView.dates;
      chart.svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-selection-rect")
        .attr("id", (date) => createID(date))
        .attr("x", (date) => chart.xChartScale(date))
        .attr("y", margin.top)
        .attr("opacity", (date) => opacity(date))
        .attr("width", chart.xChartScale.bandwidth())
        .attr("height", chart.config.height - margin.bottom - margin.top)
        .raise();
    }
  }

  class BarHoverRenderer extends Renderer {
    render(chart, controller) {
      let selectionOpacity = 0.3;

      function createID(date) {
        return `ltv-bar-chart-hover-bar-id-${safeId(String(date))}`;
      }

      function hideAll() {
        chart.svg
          .selectAll(`.ltv-bar-chart-hover-bar`)
          .attr("opacity", 0)
          .raise();
      }

      function onMouseEnter(event, date) {
        hideAll();
        chart.svg
          .select(`#${createID(date)}`)
          .attr("opacity", selectionOpacity);
        chart.emit("mouseenter", event, date);
      }

      function onMouserOut(event, date) {
        hideAll();
        chart.emit("mouseout", event, date);

        // check for mouse down
        if (event.buttons === 1) {
          onMouseClick(event, date);
        }
      }

      function onMouseClick(event, date) {
        if (chart.config.selectable) {
          chart.makeUpdateInsensible();
          controller.filters.dates.toggle(date);
          chart.makeUpdateSensible();
        }
        chart.emit("click-date", event, date);
      }

      let config = chart.config;
      let margin = config.margin;
      let dates = chart.config.dates || chart.dataView.dates;

      chart.svg
        .append("g")
        .selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
        .attr("class", "ltv-bar-chart-hover-bar")
        .attr("id", (date) => createID(date))
        .attr("opacity", 0)
        .attr("x", (d) => chart.xChartScale(d))
        .attr("y", margin.top)
        .attr("width", chart.xChartScale.bandwidth())
        .attr("height", config.height - margin.bottom - margin.top)
        .on("mouseenter", onMouseEnter)
        .on("mouseout", onMouserOut)
        .on("mousedrag", onMouserOut)
        .on("click", onMouseClick)
        .raise();
    }
  }

  class BarGridRenderer extends Renderer {
    render(chart, controller) {
      let xAxisGrid = d3__namespace
        .axisBottom(chart.xChartScale)
        .tickSize(-chart.graphHeight)
        .tickFormat("");

      let yAxisGrid = d3__namespace
        .axisLeft(chart.yChart)
        .tickSize(-chart.graphWidth)
        .tickFormat("")
        .ticks(20);

      let config = chart.config;
      let marginBottom = config.height - config.margin.bottom;

      chart.svg
        .append("g")
        .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-x")
        .attr("transform", "translate(0," + marginBottom + ")")
        .call(xAxisGrid);

      chart.svg
        .append("g")
        .attr("class", "ltv-bar-chart-grid ltv-bar-chart-grid-y")
        .attr("transform", `translate(${config.margin.left},0)`)
        .call(yAxisGrid);
    }
  }

  class BarBackgroundRenderer extends Renderer {
    render(chart, controller) {
      function click(e, b) {
        if (controller) controller.filters.dates.clear();
      }

      chart.on("click-background", click);

      chart.svg
        .append("g")
        .append("rect")
        .attr("width", chart.config.width)
        .attr("height", chart.config.height)
        .attr("fill", "white")
        .attr("opacity", 0)
        .attr("cursor", "pointer")
        .on("click", (e, b) => chart.emit("click-background", e, b));
    }
  }

  function dataViewBar(dataController) {
    let snapshot = dataController.snapshot;
    let data = snapshot || dataController.data;
    console.log("data", data);
    console.log("snapshot", snapshot);

    let dates = dataController.dates();
    let stacks = dataController.stacks();
    let labels = dataController.labels();
    let enabledStacks = dataController.stacks();

    let byDateLabel = d3__namespace.rollup(
      data,
      (v) => d3__namespace.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.label
    );

    let byDateStack = d3__namespace.rollup(
      data,
      (v) => d3__namespace.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.stack || d.label
    );

    let byDateStackLabel = d3__namespace.rollup(
      data,
      (v) => d3__namespace.sum(v, (d) => d.value),
      (d) => d.date,
      (d) => d.stack || d.label,
      (d) => d.label
    );

    let byDatesStackSeries = new d3__namespace.InternMap();
    dates.forEach((date) => {
      let byStackLabel = byDateStackLabel.get(date);
      if (!byStackLabel) return;
      byDatesStackSeries.set(date, new d3__namespace.InternMap());

      stacks.forEach((stack) => {
        let byLabel = byStackLabel.get(stack);
        if (!byLabel) return;
        let value = 0;
        let series = Array.from(byLabel)
          .reverse()
          .map((item) => [value, (value += item[1]), item[0]]);
        byDatesStackSeries.get(date).set(stack, series);
      });
    });

    let max = d3__namespace.max(byDateStack, (d) =>
      d3__namespace.max(d[1], (d) => d[1])
    );

    return {
      dates,
      stacks,
      enabledStacks,
      byDateLabel,
      byDateStack,
      byDatesStackSeries,
      labels,
      max,
    };
  }

  class BarChart extends Chart {
    static Type = BAR_CHART_TYPE;

    initialize() {
      let margin, config;
      margin = Object.assign({}, BAR_CHART_CONFIG.margin);
      margin = Object.assign(margin, this.config.margin);
      config = Object.assign({}, BAR_CHART_CONFIG);
      this.config = Object.assign(config, this.config);
      this.config.margin = margin;
    }

    addRenderers() {
      this.renderers.push(new BarBackgroundRenderer());
      this.renderers.push(new BarAxisRender());
      this.renderers.push(new BarGridRenderer());
      this.renderers.push(new BarSelectionRenderer());
      this.renderers.push(new BarHoverRenderer());
      this.renderers.push(new BarBarsRenderer());
      this.renderers.push(new BarLabelsRenderer());
      this.renderers.push(new BarTooltipRenderer());
      this.renderers.push(new BarLegendRenderer());
    }

    createDataView() {
      return dataViewBar(this.controller);
    }

    prepare() {
      this.svg
        .attr("class", "ltv-bar-chart-svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);

      let config = this.config;
      let margin = config.margin;
      this.graphWidth = config.width - margin.left - margin.right;
      this.graphHeight = config.height - margin.top - margin.bottom;

      this.dataView = this.createDataView();
      this.createScales();
    }

    draw() {
      this.graph = this.svg
        .append("g")
        .attr("width", this.graphWidth)
        .attr("height", this.graphHeight)
        .attr(
          "transform",
          `translate(${this.config.margin.left},${this.config.margin.top})`
        );
      this.renderers.forEach((r) =>
        r.render(this, this.controller, this.dataView)
      );
    }

    createScales() {
      if (!this.dataView) return;

      let config = this.config;
      let margin = config.margin;

      /*
       * Prefer dates specified by configuration. Fallback to dates of datasets.
       */
      let dates = config.dates || this.dataView.dates;
      let stacks = this.dataView.enabledStacks;

      let dateAccess = config.dateAccess;
      dates = dates.sort((a, b) => dateAccess(a) - dateAccess(b));

      this.xChartScale = d3__namespace
        .scaleBand()
        .domain(dates)
        .rangeRound([margin.left, config.width - margin.right]);

      this.xChartScalePadding = d3__namespace
        .scaleBand()
        .domain(dates)
        .rangeRound([margin.left, config.width - margin.right])
        .paddingInner(0.2);

      this.xStack = d3__namespace
        .scaleBand()
        .domain(stacks)
        .rangeRound([0, this.xChartScale.bandwidth()])
        .padding(0.05);

      this.yChart = d3__namespace
        .scaleLinear()
        .domain([0, this.dataView.max])
        .nice()
        .rangeRound([config.height - margin.bottom, margin.top]);
    }
  }

  /**
   * Returns the hash of the given string.
   * @param aString The string to create the hash of.
   * @returns {number} The hash of the given string.
   */
  function hash_str(s) {
    let hash = 0,
      i,
      chr;
    for (i = 0; i < s.length; i++) {
      chr = s.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  function hash_obj(o) {
    return hash_str(JSON.stringify(o));
  }

  const FEATURE_ID_ACCESSOR = function (f) {
    if (f.id || f.id === 0) return f.id;
    if (f.properties && isValue(f.properties.id)) return f.properties.id;
    if (f.properties && isValue(f.properties.code)) return f.properties.code;
    return f.properties ? hash_obj(f.properties) : hash_obj(f);
  };

  const FEATURE_NAME_ACCESSOR = function (f) {
    if (isValue(f.name)) return f.name;
    if (f.properties && isValue(f.properties.name)) return f.properties.name;
    if (f.properties && isValue(f.properties.nom)) return f.properties.nom;
    return FEATURE_ID_ACCESSOR(f);
  };

  const MAP_CHART_CONFIG = {
    width: 1000,
    height: 1000,
    margin: DEFAULT_MARGIN,
    isShowLabels: true,
    geoJSON: null,
    departementsData: [],
    exclude: [],
    drawRectangleAroundSelection: true,
    selectable: true,
    featureIDAccessor: FEATURE_ID_ACCESSOR,
    featureNameAccessor: FEATURE_NAME_ACCESSOR,
  };

  /**
   * Returns a copy of the passed object.  The copy is created by using the
   * JSON's `parse` and `stringify` functions.
   * @param object The java script object to copy.
   * @returns {any} The copy of the object.
   */
  function copy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  /* returns a new generated GeoJSON without the feature specified */
  function removeFeatures(json, ids, idValue = FEATURE_ID_ACCESSOR) {
    if (!Array.isArray(ids)) throw new Error("invalid ids. not an array");
    if (!Array.isArray(json.features))
      throw new Error("invalid geojson. no features");
    let _json = copy(json);
    _json.features = _json.features.filter((f) => !ids.includes(idValue(f)));
    return _json;
  }

  /* returns a GeoJSON FeatureCollection object */
  function FeatureCollection(features) {
    return { type: "FeatureCollection", features };
  }

  /* returns a GeoJSON Feature object */
  function Feature(geometry, properties = {}) {
    return { type: "Feature", geometry, properties };
  }

  /* returns a GeoJSON Geometry object */
  function Geometry(type, coordinates) {
    return { type, coordinates };
  }

  /* returns a GeoJSON object */
  function GeoJSON(source) {
    let geoJSON = copy(source);
    geoJSON.getCenter = function () {
      let allCoordinates = this.extractAllCoordinates();
      console.log("allCoordinates.length: " + allCoordinates.length);
      let latitudeSum = 0;
      let longitudeSum = 0;

      allCoordinates.forEach(function (coordinates) {
        latitudeSum += coordinates[1];
        longitudeSum += coordinates[0];
      });

      return [
        latitudeSum / allCoordinates.length,
        longitudeSum / allCoordinates.length,
      ];
    };

    geoJSON.extractGeometryCollection = function () {
      let geometryCollection = [];
      if (this.type === "Feature") {
        geometryCollection.push(this.geometry);
      } else if (this.type === "FeatureCollection") {
        this.features.forEach((feature) =>
          geometryCollection.push(feature.geometry)
        );
      } else if (this.type === "GeometryCollection") {
        this.geometries.forEach((geometry) =>
          geometryCollection.push(geometry)
        );
      } else {
        throw new Error("The geoJSON is not valid.");
      }
      return geometryCollection;
    };

    geoJSON.extractAllCoordinates = function () {
      let geometryCollection = this.extractGeometryCollection();
      let coordinatesCollection = [];

      geometryCollection.forEach((item) => {
        let coordinates = item.coordinates;
        let type = item.type;

        if (type === "Point") {
          console.log("Point: " + coordinates.length);
          coordinatesCollection.push(coordinates);
        } else if (type === "MultiPoint") {
          console.log("MultiPoint: " + coordinates.length);
          coordinates.forEach((coordinate) =>
            coordinatesCollection.push(coordinate)
          );
        } else if (type === "LineString") {
          console.log("LineString: " + coordinates.length);
          coordinates.forEach((coordinate) =>
            coordinatesCollection.push(coordinate)
          );
        } else if (type === "Polygon") {
          coordinates.forEach(function (polygonCoordinates) {
            polygonCoordinates.forEach(function (coordinate) {
              coordinatesCollection.push(coordinate);
            });
          });
        } else if (type === "MultiLineString") {
          coordinates.forEach(function (featureCoordinates) {
            featureCoordinates.forEach(function (polygonCoordinates) {
              polygonCoordinates.forEach(function (coordinate) {
                coordinatesCollection.push(coordinate);
              });
            });
          });
        } else if (type === "MultiPolygon") {
          coordinates.forEach(function (featureCoordinates) {
            featureCoordinates.forEach(function (polygonCoordinates) {
              polygonCoordinates.forEach(function (coordinate) {
                coordinatesCollection.push(coordinate);
              });
            });
          });
        } else {
          throw new Error("The geoJSON is not valid.");
        }
      });

      return coordinatesCollection;
    };

    return geoJSON;
  }

  function createGeoJSON(locations) {
    let columns = 5;
    let rows = Math.ceil(locations.length / columns);
    let span = 0.1;
    let features = [];

    loop1: for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (locations.length === 0) break loop1;

        let location = locations.shift();
        let lat = (column + 1) * span;
        let lng = (row + 1) * -span;

        // start down left, counterclockwise
        let coord = [
          [lat + span, lng + span],
          [lat + span, lng],
          [lat, lng],
          [lat, lng + span],
          [lat + span, lng + span],
        ];

        let geometry = Geometry("Polygon", [coord]);
        let feature = Feature(geometry, { id: location, name: location });
        feature.id = location;
        features.push(feature);
      }
    }

    return GeoJSON(FeatureCollection(features));
  }

  class MapBackgroundRenderer extends Renderer {
    render(chart, controller) {
      chart.svg
        .append("rect")
        .attr("class", "ltv-map-chart-background")
        .attr("width", chart.config.width)
        .attr("height", chart.config.height)
        .attr("fill", "white")
        .on("click", (e) => {
          chart.makeUpdateInsensible();
          controller.filters.locations.clear();
          chart.makeUpdateSensible();
          chart.emit("click", event, null);
        });
    }
  }

  class MapGeojsonRenderer extends Renderer {
    render(chart, controller) {
      let geoJSON = chart.presentedGeoJSON;
      if (!geoJSON) return;

      function mouseEnter(event, feature) {
        chart.emit("mouseenter", event, feature);
      }

      function mouseOut(event, feature) {
        chart.emit("mouseout", event, feature);
        // dragged
        if (event.buttons === 1) mouseClick(event, feature);
      }

      function mouseClick(event, feature) {
        if (!feature || !feature.properties) return;
        if (!chart.controller) return;

        if (chart.config.selectable) {
          let locationID = feature.lotivisId;
          chart.makeUpdateInsensible();
          controller.filters.locations.toggle(locationID);
          chart.makeUpdateSensible();
        }
        chart.emit("click", event, feature);
      }

      chart.areas = chart.svg
        .selectAll(".ltv-map-chart-area")
        .append("path")
        .data(geoJSON.features)
        .enter()
        .append("path")
        .attr("d", chart.path)
        .classed("ltv-map-chart-area", true)
        .attr("id", (f) => `ltv-map-chart-area-id-${f.lotivisId}`)
        .style("stroke-dasharray", "1,4")
        .style("fill", "white")
        .style("fill-opacity", 1)
        .on("click", mouseClick)
        .on("mouseenter", mouseEnter)
        .on("mouseout", mouseOut)
        .raise();
    }
  }

  function joinFeatures(features) {
    let topology = topojsonServer__namespace.topology(features);
    let objects = extractObjects(topology);
    let geometry = topojsonClient__namespace.merge(topology, objects);
    return FeatureCollection([Feature(geometry)]);
  }

  function extractObjects(topology) {
    let objects = [];
    for (const topologyKey in topology.objects) {
      if (topology.objects.hasOwnProperty(topologyKey)) {
        objects.push(topology.objects[topologyKey]);
      }
    }
    return objects;
  }

  class MapExteriorBorderRenderer extends Renderer {
    render(chart, controller) {
      let geoJSON = chart.presentedGeoJSON;
      if (!geoJSON) return lotivis_log("[ltv]  No GeoJSON to render.");

      let bordersGeoJSON = joinFeatures(geoJSON.features);
      if (!bordersGeoJSON) return lotivis_log("[ltv]  No borders to render.");

      chart.svg
        .selectAll(".ltv-map-chart-exterior-borders")
        .append("path")
        .data(bordersGeoJSON.features)
        .enter()
        .append("path")
        .attr("d", chart.path)
        .attr("class", "ltv-map-chart-exterior-borders");
    }
  }

  class MapLegendRenderer extends Renderer {
    render(chart, controller, dataView) {
      if (!dataView) return;

      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG$1.numberFormat;
      let stackNames = chart.dataView.stacks;
      let label = chart.config.label || stackNames[0];
      let locationToSum = dataView.locationToSum;
      let max = d3$1.max(locationToSum, (item) => item[1]);

      let offset = 0 * 80;
      let labelColor = chart.controller.colorGenerator.stack(label);

      let steps = 4;
      let data = [0, (1 / 4) * max, (1 / 2) * max, (3 / 4) * max, max];
      let generator = MapColors(max);

      let legend = chart.svg
        .append("svg")
        .attr("class", "ltv-map-chart-legend")
        .attr("width", chart.config.width)
        .attr("height", 200)
        .attr("x", 0)
        .attr("y", 0);

      chart.on("mouseenter", () => legend.raise());
      chart.on("mouseout", () => legend.raise());

      legend
        .append("text")
        .attr("class", "ltv-map-chart-legend-title")
        .attr("x", offset + 10)
        .attr("y", "20")
        .style("fill", labelColor)
        .text(label);

      legend
        .append("g")
        .selectAll("text")
        .data(["No Data"])
        .enter()
        .append("text")
        .attr("class", "ltv-map-chart-legend-text")
        .attr("x", offset + 35)
        .attr("y", 44)
        .text((d) => d);

      legend
        .append("g")
        .selectAll("rect")
        .data([0])
        .enter()
        .append("rect")
        .attr("class", "ltv-map-chart-legend-rect")
        .style("fill", "white")
        .attr("x", offset + 10)
        .attr("y", 30)
        .attr("width", 18)
        .attr("height", 18)
        .style("stroke-dasharray", "1,3")
        .style("stroke", "black")
        .style("stroke-width", 1);

      legend
        .append("g")
        .selectAll("text")
        .data([0])
        .enter()
        .append("text")
        .attr("class", "lotivis-location-chart-legend-text")
        .attr("x", offset + 35)
        .attr("y", 64)
        .text((d) => d);

      legend
        .append("g")
        .selectAll("rect")
        .data([0])
        .enter()
        .append("rect")
        .attr("class", "ltv-map-chart-legend-rect")
        .style("fill", "WhiteSmoke")
        .attr("x", offset + 10)
        .attr("y", 50)
        .attr("width", 18)
        .attr("height", 18)
        .style("stroke", "black")
        .style("stroke-width", 1);

      legend
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "ltv-map-chart-legend-rect")
        .style("fill", generator)
        .attr("x", offset + 10)
        .attr("y", (d, i) => i * 20 + 70)
        .attr("width", 18)
        .attr("height", 18)
        .style("stroke", "black")
        .style("stroke-width", 1);

      legend
        .append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "ltv-map-chart-legend-text")
        .attr("x", offset + 35)
        .attr("y", (d, i) => i * 20 + 84)
        .text(function (d, i) {
          if (d === 0) {
            return "> 0";
          } else {
            return numberFormat((i / steps) * max);
          }
        });

      for (let index = 0; index < stackNames.length; index++) {
        return;
      }
    }
  }

  class MapDatasetRenderer extends Renderer {
    render(chart, controller, dataView) {
      let generator = MapColors(1);
      let selectionOpacity = 0.1;

      function opacity(location) {
        return controller.filters.locations.contains(location)
          ? selectionOpacity
          : 1;
      }

      function resetAreas() {
        chart.svg
          .selectAll(".ltv-map-chart-area")
          .classed("ltv-map-chart-area-hover", false)
          .attr("opacity", (item) => opacity(item.lotivisId));
      }

      function featureMapID(feature) {
        return `ltv-map-chart-area-id-${feature.lotivisId}`;
      }

      function mouseEnter(event, feature) {
        resetAreas();
        if (!feature) return;

        let mapID = featureMapID(feature);

        chart.svg
          .selectAll(`#${mapID}`)
          .raise()
          .classed("ltv-map-chart-area-hover", true);

        chart.svg.selectAll(".ltv-location-chart-label").raise();
      }

      chart.on("mouseenter", mouseEnter);
      chart.on("mouseout", resetAreas);
      chart.on("click", mouseEnter);

      if (!chart.geoJSON) return lotivis_log("[ltv]  No GeoJSON to render.");
      if (!chart.dataView) return;

      resetAreas();

      let stackNames = chart.dataView.stacks;
      let locationToSum = dataView.locationToSum;
      let locations = Array.from(locationToSum.keys());
      let max = d3$1.max(locationToSum, (item) => item[1]);

      for (let i = 0; i < locations.length; i++) {
        let location = locations[i];
        let value = locationToSum.get(location);
        let opacity = Number(value / max);
        let color = opacity === 0 ? "WhiteSmoke" : generator(opacity);

        chart.svg
          .selectAll(".ltv-map-chart-area")
          .filter((item) => item.lotivisId === location)
          .style("fill", () => color)
          .raise();
      }

      for (let index = 0; index < stackNames.length; index++) {
        return;
      }
    }
  }

  class MapLabelsRenderer extends Renderer {
    render(chart, controller, dataView) {
      if (!chart.geoJSON) return lotivis_log(`[ltv]  No GeoJSON to render.`);
      if (!dataView) return;
      if (!chart.config.labels) return;

      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG$1.numberFormat;

      function raise() {
        chart.svg.selectAll(".ltv-map-chart-label").raise();
      }

      chart.on("mouseenter", raise);
      chart.on("click", raise);

      chart.svg.selectAll(".ltv-map-chart-label").remove();
      chart.svg
        .selectAll("text")
        .data(chart.geoJSON.features)
        .enter()
        .append("text")
        .attr("class", "ltv-map-chart-label")
        .text((f) => {
          let featureID = chart.config.featureIDAccessor(f);
          let data = dataView.byLocationLabel.get(featureID);
          if (!data) return "";
          let labels = Array.from(data.keys());
          let values = labels.map((label) => data.get(label));
          let sum = d3$1.sum(values);
          return sum === 0 ? "" : numberFormat(sum);
        })
        .attr("x", (f) => chart.projection(f.center)[0])
        .attr("y", (f) => chart.projection(f.center)[1]);
    }
  }

  class MapTooltipRenderer extends Renderer {
    render(chart, controller, dataView) {
      chart.element.select(".ltv-tooltip").remove();
      let tooltip = chart.element
        .append("div")
        .attr("class", "ltv-tooltip")
        .style("opacity", 0);

      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG$1.numberFormat;

      function htmlTitle(features) {
        if (features.length > 3) {
          let featuresSlice = features.slice(0, 3);
          let ids = featuresSlice
            .map((feature) => `${feature.lotivisId}`)
            .join(", ");
          let names = featuresSlice
            .map(chart.config.featureNameAccessor)
            .join(", ");
          let moreCount = features.length - 3;
          return `IDs: ${ids} (+${moreCount})<br>Names: ${names} (+${moreCount})`;
        } else {
          let ids = features
            .map((feature) => `${feature.lotivisId}`)
            .join(", ");
          let names = features.map(chart.config.featureNameAccessor).join(", ");
          return `IDs: ${ids}<br>Names: ${names}`;
        }
      }

      function htmlValues(features) {
        if (!chart.controller) return "";

        let combinedByLabel = {};
        for (let i = 0; i < features.length; i++) {
          let feature = features[i];
          let data = dataView.byLocationLabel.get(feature.lotivisId);
          if (!data) continue;
          let keys = Array.from(data.keys());

          for (let j = 0; j < keys.length; j++) {
            let label = keys[j];
            if (combinedByLabel[label]) {
              combinedByLabel[label] += data.get(label);
            } else {
              combinedByLabel[label] = data.get(label);
            }
          }
        }

        let components = [""];
        let sum = 0;
        for (const label in combinedByLabel) {
          let color = controller.colorGenerator.label(label);
          let divHTML = `<div style="background: ${color};color: ${color}; display: inline;">__</div>`;
          sum += combinedByLabel[label];
          let value = numberFormat(combinedByLabel[label]);
          components.push(`${divHTML} ${label}: <b>${value}</b>`);
        }

        components.push("");
        components.push(`Sum: <b>${numberFormat(sum)}</b>`);

        return components.length === 0 ? "No Data" : components.join("<br>");
      }

      function getTooltipSize() {
        let tooltipWidth = Number(
          tooltip.style("width").replace("px", "") || 200
        );
        let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
        return [tooltipWidth + 20, tooltipHeight + 20];
      }

      function positionTooltip(event, feature) {
        // position tooltip
        let tooltipSize = getTooltipSize();
        let projection = chart.projection;
        let featureBounds = d3$1.geoBounds(feature);
        let featureLowerLeft = projection(featureBounds[0]);
        let featureUpperRight = projection(featureBounds[1]);
        let featureBoundsWidth = featureUpperRight[0] - featureLowerLeft[0];

        // svg is presented in dynamic sized view box so we need to get the actual size
        // of the element in order to calculate a scale for the position of the tooltip.
        let effectiveSize = chart.getElementEffectiveSize();
        let factor = effectiveSize[0] / chart.config.width;
        let positionOffset = chart.getElementPosition();

        function getTooltipLeft() {
          let left = featureLowerLeft[0];
          left += featureBoundsWidth / 2;
          left *= factor;
          left -= tooltipSize[0] / 2;
          left += positionOffset[0];
          return left;
        }

        function getTooltipLocationAbove() {
          let top = featureUpperRight[1] * factor;
          top -= tooltipSize[1];
          top += positionOffset[1];
          top -= LOTIVIS_CONFIG$1.tooltipOffset;
          return top;
        }

        function getTooltipLocationUnder() {
          let top = featureLowerLeft[1] * factor;
          top += positionOffset[1];
          top += LOTIVIS_CONFIG$1.tooltipOffset;
          return top;
        }

        let top = 0;
        if (featureLowerLeft[1] > chart.config.height / 2) {
          top = getTooltipLocationAbove();
        } else {
          top = getTooltipLocationUnder();
        }

        let left = getTooltipLeft();
        tooltip
          .style("left", left + "px")
          .style("top", top + "px")
          .style("opacity", 1)
          .raise();
      }

      function mouseEnter(event, feature) {
        if (!feature) return;
        if (
          chart.controller &&
          chart.controller.filters.locations.includes(feature.lotivisId)
        ) {
          tooltip.html(
            [
              htmlTitle(chart.selectedFeatures),
              htmlValues(chart.selectedFeatures),
            ].join("<br>")
          );
          positionTooltip(event, chart.selectionBorderGeoJSON.features[0]);
        } else {
          tooltip.html(
            [htmlTitle([feature]), htmlValues([feature])].join("<br>")
          );
          positionTooltip(event, feature);
        }
      }

      function mouseOut(event, feature) {
        tooltip.style("opacity", 0);
      }

      chart.on("mouseenter", mouseEnter);
      chart.on("mouseout", mouseOut);
      chart.on("click", mouseEnter);
    }
  }

  class MapSelectionRenderer extends Renderer {
    render(chart, controller, dataView) {
      function getSelectedFeatures() {
        if (!chart.presentedGeoJSON) return null;

        let allFeatures = chart.presentedGeoJSON.features;
        if (!chart.controller) return null;

        let filteredLocations = chart.controller.filters.locations;
        if (filteredLocations.length === 0) return [];
        // return chart.presentedGeoJSON.features;
        let selectedFeatures = [];

        for (let index = 0; index < allFeatures.length; index++) {
          let feature = allFeatures[index];
          let featureID = feature.lotivisId;

          if (filteredLocations.contains(featureID)) {
            selectedFeatures.push(feature);
          }
        }

        return selectedFeatures;
      }

      function raise() {
        chart.svg.selectAll(".ltv-map-chart-selection-border").raise();
      }

      function _render() {
        chart.selectedFeatures = getSelectedFeatures();
        chart.selectionBorderGeoJSON = joinFeatures(chart.selectedFeatures);
        if (!chart.selectionBorderGeoJSON) {
          return lotivis_log("[ltv]  No selected features to render.");
        }
        chart.svg.selectAll(".ltv-map-chart-selection-border").remove();
        chart.svg
          .selectAll(".ltv-map-chart-selection-border")
          .append("path")
          .attr("class", "ltv-map-chart-selection-border")
          .data(chart.selectionBorderGeoJSON.features)
          .enter()
          .append("path")
          .attr("d", chart.path)
          .attr("class", "ltv-map-chart-selection-border")
          .raise();
      }

      chart.on("mouseout", raise);
      chart.on("click", _render);

      _render();
    }
  }

  /**
   * Returns a new generated location data view for the current selected datasets.controller of datasets of this controller.
   *
   * A location dataView has the following form:
   * ```
   * {
   *   stacks: [String],
   *   items: [
   *     {
   *       dataset: String,
   *       stack: String,
   *       location: Any,
   *       value: Number
   *     }
   *   ]
   * }
   * ```
   */
  function dataViewMap(dataController) {
    let data = dataController.snapshot || dataController.data;
    // console.log("data", data);

    let byLocationLabel = d3$1.rollup(
      data,
      (v) => d3$1.sum(v, (d) => d.value),
      (d) => d.location,
      (d) => d.label
    );

    let byLocationStack = d3$1.rollup(
      data,
      (v) => d3$1.sum(v, (d) => d.value),
      (d) => d.location,
      (d) => d.stack
    );

    let locationToSum = d3$1.rollup(
      data,
      (v) => d3$1.sum(v, (d) => d.value),
      (d) => d.location
    );

    let maxLocation = d3$1.max(locationToSum, (item) => item[1]);
    let maxLabel = d3$1.max(byLocationLabel, (i) =>
      d3$1.max(i[1], (d) => d[1])
    );
    let maxStack = d3$1.max(byLocationStack, (i) =>
      d3$1.max(i[1], (d) => d[1])
    );

    return {
      labels: dataController.labels(),
      stacks: dataController.stacks(),
      locations: dataController.locations(),
      max: maxLocation,
      maxLabel,
      maxStack,
      byLocationLabel,
      byLocationStack,
      locationToSum,
    };
  }

  class MapChart extends Chart {
    initialize() {
      let theConfig = this.config;
      let margin;
      margin = Object.assign({}, MAP_CHART_CONFIG.margin);
      margin = Object.assign(margin, theConfig.margin || {});

      let config = Object.assign({}, MAP_CHART_CONFIG);
      this.config = Object.assign(config, this.config);
      this.config.margin = margin;

      this.projection = d3$1.geoMercator();
      this.path = d3$1.geoPath().projection(this.projection);
    }

    addRenderers() {
      this.renderers.push(new MapBackgroundRenderer());
      this.renderers.push(new MapExteriorBorderRenderer());
      this.renderers.push(new MapGeojsonRenderer());
      this.renderers.push(new MapDatasetRenderer());
      this.renderers.push(new MapLegendRenderer());
      this.renderers.push(new MapLabelsRenderer());
      this.renderers.push(new MapTooltipRenderer());
      this.renderers.push(new MapSelectionRenderer());
    }

    prepare() {
      this.svg
        .classed("ltv-map-chart-svg", true)
        .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);

      if (this.geoJSON) return;
      let geoJSON = createGeoJSON(this.controller.locations());
      this.setGeoJSON(geoJSON);
    }

    createDataView() {
      return dataViewMap(this.controller);
    }

    zoomTo(geoJSON) {
      this.projection.fitSize(
        [this.config.width - 20, this.config.height - 20],
        geoJSON
      );
    }

    setGeoJSON(newGeoJSON) {
      if (
        typeof newGeoJSON === "object" &&
        newGeoJSON.prototype === "GeoJSON"
      ) {
        this.geoJSON = newGeoJSON;
      } else {
        this.geoJSON = new GeoJSON(newGeoJSON);
      }
      this.presentedGeoJSON = this.geoJSON;
      this.geoJSONDidChange();
    }

    geoJSONDidChange() {
      if (!this.geoJSON) return;
      // precalculate the center of each feature
      this.geoJSON.features.forEach((f) => (f.center = d3$1.geoCentroid(f)));

      if (this.config.exclude) {
        this.presentedGeoJSON = removeFeatures(
          this.geoJSON,
          this.config.exclude
        );
      }

      // precalculate lotivis feature ids
      let feature, id;
      for (let i = 0; i < this.presentedGeoJSON.features.length; i++) {
        feature = this.presentedGeoJSON.features[i];
        id = this.config.featureIDAccessor(feature);
        this.presentedGeoJSON.features[i].lotivisId = id;
      }

      this.zoomTo(this.presentedGeoJSON);
      this.update(this.controller, "geojson");
    }
  }

  /**
   * Enumeration of available style types of a plot chart.
   */
  const PLOT_CHART_TYPE = {
    gradient: "gradient",
    fraction: "fraction",
  };

  /**
   * Enumeration of sorts available in the bar.chart.plot.chart chart.
   */
  const PLOT_CHART_SORT = {
    none: "none",
    alphabetically: "alphabetically",
    duration: "duration",
    intensity: "intensity",
    firstDate: "firstDate",
  };

  const PLOT_CHART_CONFIG = {
    width: 1000,
    height: 600,
    margin: DEFAULT_MARGIN,
    lineHeight: 28,
    barHeight: 30,
    radius: 23,
    labels: true,
    drawGrid: true,
    showTooltip: true,
    selectable: true,
    sort: PLOT_CHART_SORT.none,
    type: PLOT_CHART_TYPE.gradient,
    numberFormat: DEFAULT_NUMBER_FORMAT,
  };

  class PlotAxisRenderer extends Renderer {
    render(chart, conttroller) {
      let margin = chart.config.margin;

      // top
      chart.svg
        .append("g")
        .call(d3$1.axisTop(chart.xChart))
        .attr("transform", () => `translate(0,${margin.top})`);

      // left
      chart.svg
        .append("g")
        .call(d3$1.axisLeft(chart.yChart))
        .attr("transform", () => `translate(${margin.left},0)`);

      // bottom
      chart.svg
        .append("g")
        .call(d3$1.axisBottom(chart.xChart))
        .attr(
          "transform",
          () => `translate(0,${chart.height - margin.bottom})`
        );
    }
  }

  class PlotTooltipRenderer extends Renderer {
    render(chart, controller) {
      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG$1.numberFormat;
      chart.element.select(".ltv-tooltip").remove();
      const tooltip = chart.element
        .append("div")
        .attr("class", "ltv-tooltip")
        .attr("rx", 5) // corner radius
        .attr("ry", 5)
        .style("opacity", 0);

      function getHTMLContentForDataset(dataset) {
        // console.log("dataset", dataset);

        let components = [];

        let sum = dataset.data
          .map((item) => item.value)
          .reduce((acc, next) => +acc + +next, 0);
        let formatted = numberFormat(sum);

        components.push("Label: " + dataset.label);
        components.push("");
        components.push("Start: " + dataset.firstDate);
        components.push("End: " + dataset.lastDate);
        components.push("");
        components.push("Items: " + formatted);
        components.push("");

        let filtered = dataset.data.filter((item) => item.value !== 0);
        for (let index = 0; index < filtered.length; index++) {
          let entry = filtered[index];
          let formatted = numberFormat(entry.value);
          components.push(`${entry.date}: ${formatted}`);
        }

        return components.join("<br/>");
      }

      function getTooltipLeftForDataset(dataset, factor, offset) {
        let left = chart.xChart(dataset.firstDate);
        left *= factor;
        left += offset[0];
        return left;
      }

      function showTooltip(event, dataset) {
        if (!chart.config.showTooltip) return;
        tooltip.html(getHTMLContentForDataset(dataset));

        // position tooltip
        let tooltipHeight = Number(tooltip.style("height").replace("px", ""));
        let factor = chart.getElementEffectiveSize()[0] / chart.config.width;
        let offset = chart.getElementPosition();

        let top = chart.yChart(dataset.label) * factor;
        top += offset[1];

        if (
          chart.yChart(dataset.label) - chart.config.margin.top <=
          chart.graphHeight / 2
        ) {
          top +=
            chart.config.lineHeight * factor + LOTIVIS_CONFIG$1.tooltipOffset;
        } else {
          top -= tooltipHeight + 20; // subtract padding
          top -= LOTIVIS_CONFIG$1.tooltipOffset;
        }

        let left = getTooltipLeftForDataset(dataset, factor, offset);

        tooltip
          .style("left", left + "px")
          .style("top", top + "px")
          .style("opacity", 1);
      }

      function hideTooltip() {
        let controller = chart.controller;
        let filters = controller.datasetFilters;

        if (filters && filters.length !== 0) {
          controller.resetFilters();
        }

        if (+tooltip.style("opacity") === 0) return;
        tooltip.style("opacity", 0);
      }

      chart.on("mouseenter", showTooltip);
      chart.on("mouseout", hideTooltip);
    }
  }

  class PlotLabelRenderer extends Renderer {
    render(chart, controller) {
      if (chart.config.type !== PLOT_CHART_TYPE.gradient) return;
      if (!chart.config.labels) return;

      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
      let xBandwidth = chart.yChart.bandwidth();
      let xChart = chart.xChart;

      chart.labels = chart.barsData
        .append("text")
        .attr("transform", `translate(0,${xBandwidth / 2 + 4})`)
        .attr("class", "ltv-plot-label")
        .attr("id", (d) => "rect-" + hash_str(d.label))
        .attr("x", (d) => xChart(d.firstDate) + xBandwidth / 2)
        .attr("y", (d) => chart.yChart(d.label))
        .attr("height", chart.yChartPadding.bandwidth())
        .attr(
          "width",
          (d) => xChart(d.lastDate) - xChart(d.firstDate) + xBandwidth
        )
        .text(function (dataset) {
          if (dataset.sum === 0) return;
          return `${numberFormat(dataset.sum)} (${dataset.duration + 1} years)`;
        });
    }
  }

  class PlotGridRenderer extends Renderer {
    render(chart, controller) {
      if (!chart) return;
      if (!chart.config.drawGrid) return;

      chart.svg
        .append("g")
        .attr("class", "ltv-plot-grid ltv-plot-grid-x")
        .attr(
          "transform",
          "translate(0," +
            (chart.preferredHeight - chart.config.margin.bottom) +
            ")"
        )
        .call(chart.xAxisGrid);

      chart.svg
        .append("g")
        .attr("class", "ltv-plot-grid ltv-plot-grid-y")
        .attr("transform", `translate(${chart.config.margin.left},0)`)
        .call(chart.yAxisGrid);
    }
  }

  class PlotBackgroundRenderer extends Renderer {
    render(chart, controller) {
      chart.svg
        .append("rect")
        .attr("width", chart.width || chart.config.width)
        .attr("height", chart.height)
        .attr("class", `ltv-plot-chart-background`)
        .on("click", (e, b) => {
          chart.controller.filters.labels.clear();
          chart.emit("click", e, null);
        });
    }
  }

  class PlotHoverBarsRenderer extends Renderer {
    render(chart, controller) {
      function createID(dataset) {
        return `ltv-plot-chart-hover-bar-id-${hash_str(dataset.label)}`;
      }

      function hideAll() {
        chart.svg.selectAll(".ltv-plot-chart-hover-bar").attr("opacity", 0);
      }

      function mouseEnter(event, dataset) {
        hideAll();

        let id = createID(dataset);
        chart.svg.select(`#${id}`).attr("opacity", 0.3);

        chart.emit("mouseenter", event, dataset);
      }

      function mouseOut(event, dataset) {
        hideAll();

        if (event.buttons === 1) {
          mouseClick(event, dataset);
        }
        chart.emit("mouseout", event, dataset);
      }

      function mouseClick(event, dataset) {
        if (chart.config.selectable) {
          chart.makeUpdateInsensible();
          chart.controller.filters.labels.toggle(dataset.label);
          chart.makeUpdateSensible();
        }
        chart.emit("click", event, dataset);
      }

      let datasets = chart.dataView.datasets;
      let graphWidth = chart.graphWidth;

      chart.backgrounBarsData = chart.svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      chart.backgrounBars = chart.backgrounBarsData
        .append("rect")
        .attr("id", (d) => createID(d))
        .attr("class", "ltv-plot-chart-hover-bar")
        .attr(`opacity`, 0)
        .attr("x", chart.config.margin.left)
        .attr("y", (d) => chart.yChart(d.label))
        .attr("height", chart.yChart.bandwidth())
        .attr("width", graphWidth)
        .on("mouseenter", mouseEnter)
        .on("mouseout", mouseOut)
        .on("click", mouseClick);
    }
  }

  class PlotBarsFractionsRenderer extends Renderer {
    render(chart, controller) {
      if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;

      let radius = LOTIVIS_CONFIG$1.barRadius;
      let max = chart.dataView.max;
      let brush = max / 2;
      let data = chart.dataView.byLabelDate;
      MapColors(max);
      let colorGenerator = controller.colorGenerator;

      console.log("max", max);

      chart.barsData = chart.svg.append("g").selectAll("g").data(data).enter();

      chart.bars = chart.barsData
        .append("g")
        .attr("transform", (d) => `translate(0,${chart.yChartPadding(d[0])})`)
        .attr("id", (d) => "ltv-plot-rect-" + hash_str(d[0]))
        .attr(`fill`, (d) => colorGenerator.label(d[0]))
        .selectAll(".rect")
        .data((d) => d[1]) // map to dates data
        .enter()
        .filter((d) => d[1] > 0)
        .append("rect")
        .attr("class", "ltv-plot-bar")
        .attr(`fill`, (d) => null)
        .attr("opacity", (d) => (d[1] + brush) / (max + brush))
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) => chart.xChart(d[0]))
        .attr("width", chart.xChart.bandwidth())
        .attr("height", chart.yChartPadding.bandwidth());
    }
  }

  class PlotBarsGradientCreator {
    constructor(chart) {
      this.chart = chart;
      this.colorGenerator = PlotColors(1);
    }

    createGradient(dataset) {
      let max = this.chart.dataView.max;
      let gradient = this.chart.definitions
        .append("linearGradient")
        .attr("id", "ltv-plot-gradient-" + hash_str(dataset.label))
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      let data = dataset.data;
      let count = data.length;
      let latestDate = dataset.lastDate;
      let duration = dataset.duration;

      if (!data || data.length === 0) return;

      if (duration === 0) {
        let item = data[0];
        let value = item.value;
        let opacity = value / max;

        gradient
          .append("stop")
          .attr("offset", `100%`)
          .attr("stop-color", this.colorGenerator(opacity));
      } else {
        for (let index = 0; index < count; index++) {
          let item = data[index];
          let date = item.date;
          let opacity = item.value / max;

          let dateDifference = latestDate - date;
          let value = dateDifference / duration;
          let datePercentage = (1 - value) * 100;

          gradient
            .append("stop")
            .attr("offset", `${datePercentage}%`)
            .attr("stop-color", this.colorGenerator(opacity));
        }
      }
    }
  }

  class PlotBarsGradientRenderer extends Renderer {
    render(chart, controller, dataView) {
      if (chart.config.type !== PLOT_CHART_TYPE.gradient) return;

      // constant for the radius of the drawn bars.
      let radius = LOTIVIS_CONFIG$1.barRadius;

      this.gradientCreator = new PlotBarsGradientCreator(chart);
      chart.definitions = chart.svg.append("defs");

      let datasets = chart.dataView.datasets;
      chart.definitions = chart.svg.append("defs");

      for (let index = 0; index < datasets.length; index++) {
        this.gradientCreator.createGradient(datasets[index]);
      }

      chart.barsData = chart.svg
        .append("g")
        .selectAll("g")
        .data(datasets)
        .enter();

      chart.bars = chart.barsData
        .append("rect")
        .attr(
          "transform",
          (d) => `translate(0,${chart.yChartPadding(d.label)})`
        )
        .attr("fill", (d) => `url(#ltv-plot-gradient-${hash_str(d.label)})`)
        .attr("class", "ltv-plot-bar")
        .attr("rx", radius)
        .attr("ry", radius)
        .attr("x", (d) =>
          chart.xChart(d.duration < 0 ? d.lastDate : d.firstDate || 0)
        )
        // .attr("y", (d) => chart.yChartPadding(d.label))
        .attr("height", chart.yChartPadding.bandwidth())
        .attr("id", (d) => "ltv-plot-rect-" + hash_str(d.label))
        .attr("width", (d) => {
          if (!d.firstDate || !d.lastDate) return 0;
          return (
            chart.xChart(d.lastDate) -
            chart.xChart(d.firstDate) +
            chart.xChart.bandwidth()
          );
        });
    }
  }

  class PlotLabelsFractionsRenderer extends Renderer {
    render(chart, controller) {
      if (chart.config.type !== PLOT_CHART_TYPE.fraction) return;
      if (!chart.config.labels) return;

      let numberFormat =
        chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
      let yBandwidth = chart.yChart.bandwidth() / 2;

      chart.labels = chart.barsData
        .append("g")
        .attr("transform", (d) => `translate(0,${chart.yChartPadding(d[0])})`)
        .attr("id", (d) => "rect-" + hash_str(d[0]))
        .selectAll(".text")
        .data((d) => d[1]) // map to dates data
        .enter()
        .filter((d) => d[1] > 0)
        .append("text")
        .attr("class", "ltv-plot-label")
        .attr("y", (d) => yBandwidth)
        .attr("x", (d) => chart.xChart(d[0]) + 4)
        .text((d) => (d.sum === 0 ? null : numberFormat(d[1])));
    }
  }

  class PlotChartSelectionRenderer extends Renderer {
    render(chart, controller) {
      function createID(dataset) {
        return `ltv-plot-chart-selection-rect-id-${hash_str(dataset.label)}`;
      }

      function update() {
        let filter = chart.controller.filters.labels || [];
        chart.svg
          .selectAll(`.ltv-plot-chart-selection-rect`)
          .attr(`opacity`, (d) => (filter.includes(d.label) ? 0.3 : 0));
      }

      function _render() {
        let datasets = chart.dataView.datasets;
        let graphWidth = chart.graphWidth;

        chart.selectionBarsData = chart.svg
          .append("g")
          .selectAll("g")
          .data(datasets)
          .enter();

        chart.selectionBars = chart.selectionBarsData
          .append("rect")
          .attr("id", (d) => createID(d))
          .attr("class", "ltv-plot-chart-selection-rect")
          .attr(`opacity`, 0)
          .attr("x", chart.config.margin.left)
          .attr("y", (d) => chart.yChart(d.label))
          .attr("height", chart.yChart.bandwidth())
          .attr("width", graphWidth);

        update();
      }

      chart.on("click", update);

      _render();
    }
  }

  function dataViewPlot(dataController) {
    let dates = dataController.dates().sort();
    let data = dataController.snapshot || dataController.data;

    console.log("data", data);

    let byLabelDate = d3$1.rollups(
      data,
      (v) => sum(v, (d) => d.value),
      (d) => d.label,
      (d) => d.date
    );

    let datasets = byLabelDate.map((d) => {
      let label = d[0];
      let data = d[1]
        .filter((d) => d[1] > 0)
        .map((d) => {
          return { date: d[0], value: d[1] };
        })
        .sort((a, b) => a.date - b.date);

      let sum = d3$1.sum(data, (d) => d.value);
      let firstDate = data[0]?.date;
      let lastDate = data[data.length - 1]?.date;
      let duration = dates.indexOf(lastDate) - dates.indexOf(firstDate);

      return { label, data, sum, firstDate, lastDate, duration };
    });

    return {
      datasets,
      dates,
      byLabelDate,
      firstDate: dates[0],
      lastDate: dates[dates.length - 1],
      labels: dataController.labels(),
      max: d3$1.max(datasets, (d) => d3$1.max(d.data, (i) => i.value)),
    };
  }

  class PlotChart extends Chart {
    static Type = PLOT_CHART_TYPE;
    static Sort = PLOT_CHART_SORT;

    initialize() {
      this.config;
      let margin;
      margin = Object.assign({}, PLOT_CHART_CONFIG.margin);
      margin = Object.assign(margin, this.config.margin);

      let config = Object.assign({}, PLOT_CHART_CONFIG);
      this.config = Object.assign(config, this.config);
      this.config.margin = margin;
    }

    addRenderers() {
      this.renderers.push(new PlotBackgroundRenderer());
      this.renderers.push(new PlotAxisRenderer());
      this.renderers.push(new PlotGridRenderer());
      this.renderers.push(new PlotChartSelectionRenderer());
      this.renderers.push(new PlotHoverBarsRenderer());
      this.renderers.push(new PlotBarsFractionsRenderer());
      this.renderers.push(new PlotBarsGradientRenderer());
      this.renderers.push(new PlotLabelRenderer());
      this.renderers.push(new PlotLabelsFractionsRenderer());
      this.renderers.push(new PlotTooltipRenderer());
    }

    createDataView() {
      return dataViewPlot(this.controller);
    }

    prepare() {
      this.svg
        .classed("ltv-plot-chart-svg", true)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${this.config.width} ${this.config.height}`);

      let margin = this.config.margin;
      let barsCount = this.dataView.labels.length || 0;

      this.graphWidth = this.config.width - margin.left - margin.right;
      this.graphHeight = barsCount * this.config.lineHeight;
      this.height = this.graphHeight + margin.top + margin.bottom;
      this.preferredHeight = this.height;

      this.svg.attr(
        "viewBox",
        `0 0 ${this.config.width} ${this.preferredHeight}`
      );

      this.sortDatasets();
      this.createScales();
    }

    createScales() {
      let dates = this.config.dates || this.config.dates || this.dataView.dates;
      dates = dates.sort();
      let labels = this.dataView.labels || [];

      this.xChart = d3$1
        .scaleBand()
        .domain(dates)
        .rangeRound([
          this.config.margin.left,
          this.config.width - this.config.margin.right,
        ])
        .paddingInner(0.1);

      this.yChartPadding = d3$1
        .scaleBand()
        .domain(labels)
        .rangeRound([
          this.height - this.config.margin.bottom,
          this.config.margin.top,
        ])
        .paddingInner(0.1);

      this.yChart = d3$1
        .scaleBand()
        .domain(labels)
        .rangeRound([
          this.height - this.config.margin.bottom,
          this.config.margin.top,
        ]);

      this.xAxisGrid = d3$1
        .axisBottom(this.xChart)
        .tickSize(-this.graphHeight)
        .tickFormat("");

      this.yAxisGrid = d3$1
        .axisLeft(this.yChart)
        .tickSize(-this.graphWidth)
        .tickFormat("");
    }

    sortDatasets() {
      // console.log("this.dataView", this.dataView);
      let datasets = this.dataView.datasets;
      let sortedDatasets = [];
      switch (this.config.sort) {
        case PLOT_CHART_SORT.alphabetically:
          sortedDatasets = datasets.sort(
            (set1, set2) => set1.label > set2.label
          );
          break;
        case PLOT_CHART_SORT.duration:
          sortedDatasets = datasets.sort(
            (set1, set2) => set1.duration < set2.duration
          );
          break;
        case PLOT_CHART_SORT.intensity:
          sortedDatasets = datasets.sort((set1, set2) => set1.sum < set2.sum);
          break;
        case PLOT_CHART_SORT.firstDate:
          sortedDatasets = datasets.sort(
            (set1, set2) => set1.firstDate > set2.firstDate
          );
          break;
        default:
          sortedDatasets = datasets;
          break;
      }

      this.dataView.labels = sortedDatasets
        .map((dataset) => String(dataset.label))
        .reverse();
      this.dataView.datasetsSorted = this.dataView.labels;
    }
  }

  class LabelsLabelsRenderer extends Renderer {
    render(chart, controller, dataView) {
      // let numberFormat = chart.config.numberFormat || LOTIVIS_CONFIG.numberFormat;
      let stacks = dataView.stacks;
      let colors = controller.colorGenerator;

      function stackId(stack) {
        return `ltv-legend-stack-id-${safeId(stack)}`;
      }

      function labelId(label) {
        return `ltv-legend-stack-id-${safeId(label)}`;
      }

      function toggle(label) {
        chart.makeUpdateInsensible();
        controller.filters.labels.toggle(label);
        chart.makeUpdateSensible();
      }

      function filter(label) {
        return controller.filters.labels.contains(label);
      }

      let stackDivs = chart.div
        .selectAll(".div")
        .data(stacks)
        .enter()
        .append("div")
        .attr("id", (s) => stackId(s))
        .attr("class", "ltv-stack-labels-container")
        .style("color", (s) => colors.stack(s))
        .html((d, i) => "Stack " + (i + 1) + "<br/>");

      let divs = stackDivs
        .selectAll(".label")
        .data((d) => dataView.byStackLabel.get(d))
        .enter()
        .append("label")
        .attr("class", "ltv-pill-checkbox");

      divs
        .append("input")
        .attr("type", "checkbox")
        .attr("checked", (d) => (filter(d[0]) ? null : true))
        .attr("id", (d) => labelId(d[0]))
        .on("change", (e, d) => toggle(d[0]));

      divs
        .append("span")
        .attr("class", "ltv-pill-checkbox-span")
        .style("background-color", (d) => colors.label(d[0]))
        .text((d) => "" + d[0] + " (" + dataView.byLabel.get(d[0]) + ")");

      // let labelsOfCheckboxes = divs
      //   .append("label")
      //   .style("margin-left", "5px")
      //   .attr("for", (d) => labelId(d[0]))
      //   .text((d) => "" + d[0]);
    }
  }

  function DataViewLabels(dataController) {
    return {
      labels: dataController.labels(),
      stacks: dataController.stacks(),
      locations: dataController.locations(),
      byLabel: d3$1.rollup(
        dataController.data,
        (v) => d3$1.sum(v, (d) => d.value),
        (d) => d.label
      ),
      byStackLabel: d3$1.rollup(
        dataController.data,
        (v) => d3$1.sum(v, (d) => d.value),
        (d) => d.stack || d.label,
        (d) => d.label
      ),
    };
  }

  class LabelsChart extends Chart {
    initialize() {}

    addRenderers() {
      this.renderers.push(new LabelsLabelsRenderer());
    }

    createDataView() {
      return DataViewLabels(this.controller);
    }

    createSVG() {
      this.div = this.element
        .append("div")
        .attr("id", this.svgSelector)
        .attr("class", "ltv-chart-div");
    }

    remove() {
      this.listeners = {};
      this.div.selectAll("*").remove();
    }
  }

  class UrlParameters {
    static getInstance() {
      if (!UrlParameters.instance) {
        UrlParameters.instance = new UrlParameters();
      }
      return UrlParameters.instance;
    }

    getURL() {
      return new URL(window.location.href);
    }

    getBoolean(parameter, defaultValue = false) {
      let value = this.getURL().searchParams.get(parameter);
      return value ? value === "true" : defaultValue;
    }

    getString(parameter, defaultValue = "") {
      return this.getURL().searchParams.get(parameter) || defaultValue;
    }

    set(parameter, newValue) {
      const url = this.getURL();

      if (newValue === false) {
        url.searchParams.delete(parameter);
      } else {
        url.searchParams.set(parameter, newValue);
      }

      window.history.replaceState(null, null, url);
      this.updateCurrentPageFooter();
    }

    setWithoutDeleting(parameter, newValue) {
      const url = this.getURL();
      url.searchParams.set(parameter, newValue);
      window.history.replaceState(null, null, url);
      this.updateCurrentPageFooter();
    }

    clear() {
      const url = this.getURL();
      const newPath = url.protocol + url.host;
      const newURL = new URL(newPath);
      window.history.replaceState(null, null, newURL);
      this.updateCurrentPageFooter();
    }

    updateCurrentPageFooter() {
      if (typeof document === "undefined") return;
      let urlContainer = document.getElementById("lotivis-url-container");
      if (urlContainer) urlContainer.innerText = this.getURL();
    }
  }

  UrlParameters.language = "language";
  UrlParameters.page = "page";
  UrlParameters.query = "query";
  UrlParameters.searchViewMode = "search-view-mode";
  UrlParameters.chartType = "chart-type";
  UrlParameters.chartShowLabels = "chart-show-labels";
  UrlParameters.chartCombineStacks = "combine-stacks";
  UrlParameters.contentType = "content-type";
  UrlParameters.valueType = "value-type";
  UrlParameters.searchSensitivity = "search-sensitivity";
  UrlParameters.startYear = "start-year";
  UrlParameters.endYear = "end-year";
  UrlParameters.showTestData = "show-samples";

  exports.d3 = d3__namespace;
  exports.BarChart = BarChart;
  exports.DataController = DataController;
  exports.DataItem = DataItem;
  exports.Dataset = Dataset;
  exports.DateOrdinator = date_ordinator;
  exports.LabelsChart = LabelsChart;
  exports.MapChart = MapChart;
  exports.PlotChart = PlotChart;
  exports.UrlParameters = UrlParameters;
  exports.config = LOTIVIS_CONFIG$1;
  exports.csv = csv;
  exports.csvParse = csvParse;
  exports.csvRender = csvRender;
  exports.debug = debug;
  exports.flatDataset = flatDataset;
  exports.flatDatasets = flatDatasets;
  exports.json = json;
  exports.parseDataset = parseDataset;
  exports.parseDatasets = parseDatasets;
  exports.toDataset = toDataset;

  Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=lotivis.no-deps.js.map
