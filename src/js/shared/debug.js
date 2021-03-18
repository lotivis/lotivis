import {Constants} from "./constants";

const prefix = '[lotivis]  ';

export const verbose_log = console.log;

export const debug_log = function (message) {
  if (!Constants.debugLog) return;
  console.log(prefix + message);
};
