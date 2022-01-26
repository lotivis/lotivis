function isFunction(value) {
  return value && typeof value === "function";
}

export class State {
  constructor(state, config) {
    if (!state) throw new Error("no state passed");

    // private
    // Declare initial chart state attributes
    const _state = state;

    Object.keys(_state).forEach((key) => {
      // do not override (custom) existing functions
      if (isFunction(this[key])) return;
      this[key] = function (_) {
        return arguments.length ? ((_state[key] = _), this) : _state[key];
      };
    });

    // if exists overwrite state from passed config
    Object.keys(_state).forEach((key) => {
      if (config && config[key]) _state[key] = config[key];
    });

    // public

    // Define state getter and setter function
    this.state = function (_) {
      return arguments.length ? (Object.assign(_state, _), this) : _state;
    };

    this.stateItem = function (name, fb) {
      return _state.hasOwnProperty(name) ? _state[name] || fb : fb;
    };

    if (isFunction(this.didConstruct)) this.didConstruct();
  }
}
