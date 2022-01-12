export function Collection() {
  let c = [];

  c.add = function (e) {
    return c.indexOf(e) === -1 ? c.push(e) > 0 : false;
  };

  c.remove = function (e) {
    let i = c.indexOf(e);
    return i !== -1 ? c.splice(i, 1) : false;
  };

  c.addAll = function (e) {
    e.forEach(c.add);
  };

  return c;
}

export class Listeners {
  constructor() {
    let listeners = Collection();

    function notify(listener, reason, controller) {
      if (!listener.update) throw Error("missing update function of listener");
      listener.update(controller, reason);
    }

    this.add = function (l, controller) {
      if (!l.update) throw Error("missing update function of listener");
      if (!listeners.add(l)) return;
      notify(l, "registration", controller);
    };

    this.remove = function (l) {
      listeners.remove(l);
    };

    this.addAll = function (all, controller) {
      if (!Array.isArray(all)) throw Error("expecting array");
      all.forEach((l) => this.add(l, controller));
    };

    this.notify = function (reason = "none", controller) {
      listeners.forEach((l) => notify(l, reason, controller));
    };

    this.size = function () {
      return listeners.length;
    };
  }
}
