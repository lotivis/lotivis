import {LotivisConfig} from "./config";

/**
 * A collection of messages which already hast been printed.
 * @type {*[]}
 */
let alreadyLogged = [];

export var lotivis_log_once = function (message) {
  if (alreadyLogged.includes(message)) return;
  alreadyLogged.push(message);
  console.warn(`[lotivis]  Warning only once: ${message}`);
};

export var lotivis_log = () => null;

/**
 * Sets whether lotivis prints debug log messages to the console.
 * @param enabled A Boolean value indicating whether to enable debug logging.
 * @param printConfig A Boolean value indicating whether to print the global lotivis configuration.  Default is false.
 */
export function debug(enabled, printConfig = false) {
  lotivis_log = enabled ? console.log : () => null;
  lotivis_log(`[lotivis]  ${enabled ? 'En' : 'Dis'}abled debug mode.`);
  if (!printConfig) return;
  lotivis_log(`LotivisConfig = ${JSON.stringify(LotivisConfig, null, 2)}`);
}
