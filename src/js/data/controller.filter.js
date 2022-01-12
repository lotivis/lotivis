export function FilterCollection(listener) {
  let c = [];
  let l = listener;

  function _nofify(reason, item, notify = true) {
    if (notify) listener(reason, item);
  }

  c.add = function (item, notify = true) {
    if (c.indexOf(item) === -1) c.push(item), _nofify("add", item, notify);
  };

  c.remove = function (item, notify = true) {
    let i = c.indexOf(item);
    if (i !== -1) c.splice(i, 1), _nofify("remove", item, notify);
  };

  c.toggle = function (item, notify = true) {
    let i = c.indexOf(item);
    i === -1 ? c.push(item) : c.splice(i, 1), _nofify("toggle", item, notify);
  };

  c.contains = function (item) {
    return c.indexOf(item) !== -1;
  };

  c.clear = function (notify = true) {
    if (c.length !== 0) (c = []), _nofify("clear", null, notify);
  };

  c.get = function () {
    return c;
  };

  return c;
}

export class Filters {
  constructor(listener) {
    this.locations = new FilterCollection((r) => listener("location", r));
    this.dates = new FilterCollection((r) => listener("dates", r));
    this.labels = new FilterCollection((r) => listener("labels", r));
    this.stacks = new FilterCollection((r) => listener("stacks", r));
  }
}
