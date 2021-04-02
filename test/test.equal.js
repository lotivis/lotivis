const assert = require('assert');
const lotivis = require('../dist/lotivis');

describe('equals', function () {

  it('returns true comparing the same boolean values', function () {
    assert.strictEqual(lotivis.equals(true, true), true);
  });

  it('returns false comparing the different boolean values', function () {
    assert.strictEqual(lotivis.equals(true, false), false);
  });

  it('returns false comparing a boolean value with null', function () {
    assert.strictEqual(lotivis.equals(true, null), false);
  });

  it('returns true comparing the same string values', function () {
    assert.strictEqual(lotivis.equals("string", "string"), true);
  });

  it('returns false comparing the different string values', function () {
    assert.strictEqual(lotivis.equals("string", ""), false);
  });

  it('returns false comparing a string value with null', function () {
    assert.strictEqual(lotivis.equals("string", null), false);
  });

  it('returns true comparing the same number values', function () {
    assert.strictEqual(lotivis.equals(1, 1), true);
  });

  it('returns false comparing the different number values', function () {
    assert.strictEqual(lotivis.equals(1, 0), false);
  });

  it('returns false comparing a number value with null', function () {
    assert.strictEqual(lotivis.equals(1, null), false);
  });

});

describe('objectEquals', function () {

  it('returns true comparing empty objects', function () {
    assert.strictEqual(lotivis.objectsEqual({}, {}), true);
  });

  it('returns true comparing two same objects', function () {
    assert.strictEqual(lotivis.objectsEqual({a: 1}, {a: 1}), true);
  });

  it('returns false comparing different objects', function () {
    assert.strictEqual(lotivis.objectsEqual({a: 1}, {a: 0}), false);
  });

});
