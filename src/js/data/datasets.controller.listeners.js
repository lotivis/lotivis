import {DatasetsController} from "./datasets.controller";

DatasetsController.prototype.addListener = function(listener) {
  this.listeners.push(listener);
}

DatasetsController.prototype.removeListener = function (listener) {
  let index = this.listeners.indexOf(listener);
  if (index === -1) return;
  this.listeners = this.listeners.splice(index, 1);
}

DatasetsController.prototype.notifyListeners = function (reason = 'none') {
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) continue;
    listener.update(this, reason);
  }
}
