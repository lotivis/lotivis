const assert = require('assert');
const samples = require('./sample.data');
const lotivis = require('../dist/lotivis.tests');

describe('DateAccessWeek', function () {

  it('returns the correct numeric values', function () {
    let access = lotivis.DateAccessWeek;
    assert.strictEqual(access('SUNDAY'), 0);
    assert.strictEqual(access('Monday'), 1);
    assert.strictEqual(access('TUE'), 2);
    assert.strictEqual(access('wed'), 3);
  });

});
