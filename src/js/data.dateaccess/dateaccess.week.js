/**
 *
 * @param weekday
 * @returns {number}
 * @constructor
 */
export const DateAccessWeek = function (weekday) {
  let lowercase = weekday.toLowerCase();
  switch (lowercase) {
    case 'sunday':
    case 'sun':
      return 0;
    case 'monday':
    case 'mon':
      return 1;
    case 'tuesday':
    case 'tue':
      return 2;
    case 'wednesday':
    case 'wed':
      return 3;
    case 'thursday':
    case 'thr':
      return 4;
    case 'friday':
    case 'fri':
      return 5;
    case 'saturday':
    case 'sat':
      return 6;
    default:
      return -1;
  }
};
