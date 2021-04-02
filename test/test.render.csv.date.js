const assert = require('assert');
const samples = require("./sample.data");
const lotivis = require('../dist/lotivis.tests');

describe('renderCSVDate', function () {

  it('returns true comparing empty objects', function () {
    const dataset1 = samples.readJSON('sample.dataset.1.json');
    const csv = lotivis.renderCSVDate([dataset1]);
    const lines = csv.split('\n');
    assert.strictEqual(lines[0], 'date,dataset_1');
    assert.strictEqual(lines.length, 7);
  });

});
