export class FilterArray extends Array {
  constructor(name, listener) {
    super();
    this.name = name;
    this.listener = listener;
  }

  validate(item, sender) {
    if (!item) throw new Error("no item.");
    if (!sender) throw new Error("no sender.");
  }

  notify(reason, item, sender, notify = true) {
    if (notify) this.listener(this.name, reason, item, sender);
  }

  add(item, sender, notify = true) {
    this.validate(item, sender);
    if (this.indexOf(item) === -1)
      this.push(item), this.notify("add", item, sender, notify);
  }

  addAll(source) {
    if (!Array.isArray(source)) throw new Error("no array given");
    this.push(...source), this.notify("add", item, sender, notify);
  }

  remove(item, sender, notify = true) {
    this.validate(item, sender);
    let i = this.indexOf(item);
    if (i !== -1)
      this.splice(i, 1), this.notify("remove", item, sender, notify);
  }

  toggle(item, sender, notify = true) {
    this.validate(item, sender);
    let i = this.indexOf(item);
    i === -1 ? this.push(item) : this.splice(i, 1);
    this.notify("toggle", item, sender, notify);
  }

  contains(item) {
    return this.indexOf(item) !== -1;
  }

  clear(sender, notify = true) {
    this.validate(true, sender);
    if (this.length !== 0) {
      this.splice(0, this.length);
      this.notify("clear", null, sender, notify);
    }
  }
}
