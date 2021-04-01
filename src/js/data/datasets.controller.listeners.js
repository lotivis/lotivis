import {DatasetsController} from "./datasets.controller";
import {verbose_log} from "../shared/debug";

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
 * Notifies all listeners.
 * @param reason The reason to send to the listener.  Default is 'none'.
 */
DatasetsController.prototype.notifyListeners = function (reason = DatasetsController.NotificationReason.none) {
  if (!this.listeners) return;
  verbose_log(`Notifying listeners (${reason}).`)
  for (let index = 0; index < this.listeners.length; index++) {
    let listener = this.listeners[index];
    if (!listener.update) continue;
    listener.update(this, reason);
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
