import * as d3 from "d3";

export function snapshot(controller) {
  let f = controller.filters;
  return d3.filter(controller.data, (d) => {
    return !(
      (d.location && f.locations.contains(d.location)) ||
      (d.date && f.dates.contains(d.date)) ||
      (d.label && f.labels.contains(d.label)) ||
      (d.stack && f.stacks.contains(d.stack))
    );
  });
}
