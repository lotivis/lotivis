export class ObservableArray extends Array {
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

  remove(item, notify = true) {
    let i = this.indexOf(item);
    if (i !== -1) this.splice(i, 1), this.notify("remove", item, notify);
  }

  toggle(item, notify = true) {
    let i = this.indexOf(item);
    i === -1 ? this.push(item) : this.splice(i, 1),
      this.notify("toggle", item, notify);
  }

  contains(item) {
    return this.indexOf(item) !== -1;
  }

  clear(notify = true) {
    if (this.length !== 0) (c = []), this.notify("clear", null, notify);
  }
}

export class Filters {
  constructor(listener) {
    this.locations = new ObservableArray((r) => listener("location", r));
    this.dates = new ObservableArray((r) => listener("dates", r));
    this.labels = new ObservableArray((r) => listener("labels", r));
    this.stacks = new ObservableArray((r) => listener("stacks", r));
  }
}
