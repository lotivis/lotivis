import { lotivis_log_once } from "../shared/debug";

/**
 *
 * @param date
 * @constructor
 */
export const DefaultDateAccess = (date) => date;

/**
 *
 * @param dateString
 * @returns {number}
 * @constructor
 */
export const FormattedDateAccess = function (dateString) {
  let value = Date.parse(dateString);
  if (isNaN(value)) {
    lotivis_log_once(`Received NaN for date "${dateString}"`);
  }
  return value;
};

/**
 *
 * @param dateString
 *
 * @returns {number}
 *
 * @constructor
 */
export const DateGermanAssessor = function (dateString) {
  let saveDateString = String(dateString);
  let components = saveDateString.split(".");
  let day = components[0];
  let month = components[1];
  let year = components[2];
  let date = new Date(`${year}-${month}-${day}`);
  return Number(date);
};

/**
 *
 * @param weekday
 * @returns {number}
 * @constructor
 */
export const DateWeekAssessor = function (weekday) {
  let lowercase = weekday.toLowerCase();
  switch (lowercase) {
    case "sunday":
    case "sun":
      return 0;
    case "monday":
    case "mon":
      return 1;
    case "tuesday":
    case "tue":
      return 2;
    case "wednesday":
    case "wed":
      return 3;
    case "thursday":
    case "thr":
      return 4;
    case "friday":
    case "fri":
      return 5;
    case "saturday":
    case "sat":
      return 6;
    default:
      return -1;
  }
};
