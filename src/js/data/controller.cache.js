import * as d3 from "d3";
import { DataController } from "./controller";

DataController.prototype.cache = function (key, valueFn) {
  var cached = this.getCached(key);
  if (cached) return cached;
  var value = valueFn();
  this.setCached(key, value);
  return value;
};

DataController.prototype.getCached = function (key) {
  var cache = this.stateItem("cache");
  return cache && cache[key] ? cache[key] : null;
};

DataController.prototype.setCached = function (key, value) {
  var { cache } = this.state();
  cache[key] = value;
  return this;
};
