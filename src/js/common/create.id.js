export const genId = (function () {
  var prefix = "ltv";
  var unique = 0;

  function random() {
    return Math.random().toString(36).substring(2, 8);
  }

  return function (type = "id") {
    return [prefix, type, "" + unique++, random()].join("-");
  };
})();

export const create_id = genId;

export const uniqueId = genId;
