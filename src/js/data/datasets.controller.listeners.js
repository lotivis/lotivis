import {DatasetsController} from "./datasets.controller";
import {lotivis_log} from "../shared/debug";

/**
 * Appends the given listener to the collection of listeners.
 * @param listener The listener to add.
 */
DatasetsController.prototype.addListener = function (listener) {
  if (!this.listeners) this.listeners = [];
  if (this.listeners.includes(listener)) return lotivis_log(`[lotivis]  Attempt to add listener twice (${listener}).`);
  this.listeners.push(listener);
};

/**
 * Removes the given listener from the collection of listeners.
 * @param listener The listener to remove.
 */
DatasetsController.prototype.removeListener = function (listener) {
  if (!this.listeners) return;
  let index = this.listeners.indexOf(listener);
  if (index === -1) return;
  this.listeners = this.listeners.splice(index, 1);
};

/**
 * Notifies all listeners.
 * @param reason The reason to send to the listener.  Default is 'none'.
 */
DatasetsController.prototype.notifyListeners = function (reason = DatasetsController.NotificationReason.none) {
  if (!this.listeners) return lotivis_log(`[lotivis]  No listeners to notify.`);
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) continue;
    listener.update(this, reason);
  }
};

/**
 * Sets this controller to all of the given listeners via the `setDatasetsController` function.
 * @param listeners A collection of listeners.
 */
DatasetsController.prototype.register = function (listeners) {
  if (!Array.isArray(listeners)) return;
  for (let index = 0; index < listeners.length; index++) {
    let listener = listeners[index];
    if (!listener.setDatasetController) continue;
    listener.setDatasetController(this);
  }
};

DatasetsController.NotificationReason = {
  none: 'none',
  datasetsUpdate: 'datasets-update',
  filterDataset: 'dataset-filter',
  filterDates: 'dates-filter',
  filterLocations: 'location-filter',
  resetFilters: 'reset-filters'
};
