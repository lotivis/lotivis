import {lotivis_log} from "../shared/debug";

let alreadyLogged = [];

export function LogOnlyOnce(id, message) {
  if (alreadyLogged.includes(id)) return;
  alreadyLogged.push(id);
  lotivis_log(`[lotivis]  Warning only once! ${message}`);
}

export const DefaultDateAccess = (date) => date;

let warned = false;
export const FormattedDateAccess = function (dateString) {
  let value = Date.parse(dateString);
  if (isNaN(value)) {
    if (!warned) {
      warned = true;
      lotivis_log(`[lotivis]  Warning only once! Received NaN for date "${dateString}"`);
    }
  } else {

  }

  return value;
};

export const GermanDateAccess = function (dateString) {
  let saveDateString = String(dateString);
  let components = saveDateString.split('.');
  let day = components[0];
  let month = components[1];
  let year = components[2];
  let date = new Date(`${year}-${month}-${day}`);
  return Number(date);
};
