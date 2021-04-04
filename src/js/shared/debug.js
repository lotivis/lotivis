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
 */
export function debug(enabled) {
  lotivis_log = enabled ? console.log : () => null;
  lotivis_log(`[lotivis]  debug ${enabled ? 'en' : 'dis'}abled`);
}
