import {GlobalConfig} from "./config";

const prefix = '[lotivis]  ';

export const verbose_log = console.log;

// export const debug_log = function (message) {
//   if (!GlobalConfig.debugLog) return;
//   console.log(prefix + message);
// };

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
