const assert = require('assert');
const fetch = require("node-fetch");
const lotivis = require('../dist/lotivis');

describe('parse csv', function () {

  it('some', async function () {
    let url = 'https://phpefi.schleswig-holstein.de/corona/data202011/cvd_sh_verlauf.csv';
    let flatData = await lotivis.parseCSV(url, function (components) {
      return {
        date: String(components[0]),
        value: String(components[1])
      };
    })
      .then(function (dataset) {

      });

    assert.strictEqual('a', 'a');
  });

});
