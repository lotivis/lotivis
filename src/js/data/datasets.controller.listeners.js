import {DatasetsController} from "./datasets.controller";

/**
 * Appends the given listener to the collection of listeners.
 * @param listener The listener to add.
 */
DatasetsController.prototype.addListener = function (listener) {
  if (!this.listeners) this.listeners = [];
  this.listeners.push(listener);
};

/**
 * Removes the given listern
 * @param listener
 */
DatasetsController.prototype.removeListener = function (listener) {
  if (!this.listeners) return;
  let index = this.listeners.indexOf(listener);
  if (index === -1) return;
  this.listeners = this.listeners.splice(index, 1);
};

/**
 *
 * @param reason
 */
DatasetsController.prototype.notifyListeners = function (reason = 'none') {
  if (!this.listeners) return;
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) continue;
    listener.update(this, reason);
  }
};
