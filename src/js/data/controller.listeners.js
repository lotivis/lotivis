export class Listeners {
  constructor() {
    let ls = [];

    function notify(listener, reason, controller) {
      if (!listener.update) throw Error("missing update function of listener");
      listener.update(controller, reason);
    }

    this.add = function (l, controller) {
      if (!l.update) throw Error("missing update function of listener");
      if (!(ls.indexOf(l) === -1 ? ls.push(l) > 0 : false)) return;
      notify(l, "registration", controller);
    };

    this.remove = function (l) {
      let i = ls.indexOf(l);
      return i !== -1 ? ls.splice(i, 1) : false;
    };

    this.addAll = function (all, controller) {
      if (!Array.isArray(all)) throw Error("expecting array");
      all.forEach((l) => this.add(l, controller));
    };

    this.notify = function (reason = "none", controller) {
      ls.forEach((l) => notify(l, reason, controller));
    };

    this.size = function () {
      return ls.length;
    };

    return this;
  }
}
