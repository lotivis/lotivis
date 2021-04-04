import {GlobalConfig} from "./config";

const prefix = '[lotivis]  ';

let alreadyLogged = [];

export function LogOnlyOnce(id, message) {
  if (alreadyLogged.includes(id)) return;
  alreadyLogged.push(id);
  lotivis_log(`[lotivis]  Warning only once! ${message}`);
}

export function clearAlreadyLogged() {
  alreadyLogged = [];
}

export var lotivis_log_once = function (message) {

};

export var lotivis_log = () => null;

/**
 * Sets whether lotivis prints debug log messages to the console.
 * @param enabled A Boolean value indicating whether to enable debug logging.
 */
export function debug(enabled) {
  GlobalConfig.debugLog = enabled;
  GlobalConfig.debug = enabled;
  lotivis_log = enabled ? console.log : () => null;
  lotivis_log(`[lotivis]  debug ${enabled ? 'en' : 'dis'}abled`);
}
