import * as d3 from "d3";

export function filter(controller) {
  let data = controller.data;
  let filters = controller.filters;
  let filtered = d3.filter(data, (d) => {
    return !(
      (d.location && filters.locations.contains(d.location)) ||
      (d.date && filters.dates.contains(d.date)) ||
      (d.label && filters.labels.contains(d.label)) ||
      (d.stack && filters.stacks.contains(d.stack))
    );
  });

  // console.log("filtered", filtered);

  return filtered;
}
