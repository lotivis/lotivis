import * as d3 from "d3";
import { DataController } from "./controller";

DataController.prototype.clearFilters = function (sender) {
  this.filters.dates.clear(sender, false);
  this.filters.locations.clear(sender, false);
  this.filters.labels.clear(sender, false);
  this.filters.stacks.clear(sender, false);
  this.filtersDidChange("all", "clear", null, sender);
};

DataController.prototype.addLocationFilter = function (location, sender) {
  return this.filters.locations.add(location, sender);
};

DataController.prototype.removeLocationFilter = function (location, sender) {
  return this.filters.locations.remove(location, sender);
};

DataController.prototype.addDateFilter = function (location, sender) {
  return this.filters.dates.add(location, sender);
};

DataController.prototype.removeDateFilter = function (location, sender) {
  return this.filters.dates.remove(location, sender);
};

DataController.prototype.addLabelFilter = function (location, sender) {
  return this.filters.labels.add(location, sender);
};

DataController.prototype.removeLabelFilter = function (location, sender) {
  return this.filters.labels.remove(location, sender);
};

DataController.prototype.addStackFilter = function (location, sender) {
  return this.filters.stacks.add(location, sender);
};

DataController.prototype.removeStackFilter = function (location, sender) {
  return this.filters.stacks.remove(location, sender);
};

DataController.prototype.locationFilters = function () {
  return this.filters.locations;
};

DataController.prototype.dateFilters = function () {
  return this.filters.dates;
};

DataController.prototype.labelFilters = function () {
  return this.filters.labels;
};

DataController.prototype.stackFilters = function () {
  return this.filters.stacks;
};

DataController.prototype.isFilterLocation = function (loc) {
  return this.filters.locations.contains(loc);
};

DataController.prototype.isFilterDate = function (date) {
  return this.filters.dates.contains(date);
};

DataController.prototype.isFilterLabel = function (label) {
  return this.filters.labels.contains(label);
};

DataController.prototype.isFilterStack = function (stack) {
  return this.filters.stacks.contains(stack);
};
