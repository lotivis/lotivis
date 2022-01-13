import * as d3 from "d3";

class Sub extends Array {
  constructor() {
    super();
  }
}

export function Data(flat) {
  let data = Array.from(flat);
  data = data.sort((a, b) => a.date - b.date);

  data.filterValid = function () {
    return data.filter((d) => d.value);
  };

  data.byLabel = function () {
    return d3.group(data, (d) => d.label);
  };

  data.byStack = function () {
    return d3.group(data, (d) => d.stack);
  };

  data.byLocation = function () {
    return d3.group(data, (d) => d.location);
  };

  data.byDate = function () {
    return d3.group(data, (d) => d.date);
  };

  data.labels = function () {
    return Array.from(data.byLabel().keys());
  };

  data.stacks = function () {
    return Array.from(data.byStack().keys());
  };

  data.locations = function () {
    return Array.from(data.byLocation().keys());
  };

  data.dates = function () {
    return Array.from(data.byDate().keys());
  };

  data.earliestDate = function () {
    return d3.least(data, (a, b) => a.date - b.date).date;
  };

  data.latestDate = function () {
    return d3.least(data, (a, b) => b.date - a.date).date;
  };

  data.earliestValidDate = function () {
    return d3.least(data.filterValid(), (a, b) => a.date - b.date).date;
  };

  data.latestValidDate = function () {
    return d3.least(data.filterValid(), (a, b) => b.date - a.date).date;
  };

  data.max = function () {
    return d3.max(data, (i) => i.value);
  };

  data.min = function () {
    return d3.min(data, (i) => i.value);
  };

  data.sum = function () {
    return data.reduce((p, c) => p.value + c.value);
  };

  return data;
}
