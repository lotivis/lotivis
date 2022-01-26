import * as d3 from "d3";
import { DataController } from "./controller";

DataController.prototype.calculateSnapshot = function () {
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
};

DataController.prototype.snapshot = function () {
  return this.stateItem("snapshot", null);
};

DataController.prototype.snapshotOrData = function () {
  return this.stateItem("snapshot", this.stateItem("data", null));
};
