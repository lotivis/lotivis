const assert = require('assert');
const lotivis = require('../dist/lotivis.tests');

describe('dataview.map', function () {

  it('returns true comparing the same boolean values', function () {
    assert.strictEqual(lotivis.equals(true, true), true);
  });

});
