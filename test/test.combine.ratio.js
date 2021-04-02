const assert = require('assert');
const samples = require("./sample.data");
const lotivis = require('../dist/lotivis.tests');

describe('dataset', function () {

  describe('#dataset combine samples by ratio', function () {
    let dataset = samples.readJSON('sample.dataset.1.json');
    let data = dataset.data;

    it('if ratio is 2 the samples has a length of 3', function () {
      let groupSize = 2;
      let combinedByRatio = lotivis.combineDataByGroupsize(data, groupSize);
      assert.strictEqual(combinedByRatio.length, 3);
    });

    it('if ratio is 3 the samples has a length of 2', function () {
      let groupSize = 3;
      let combinedByRatio = lotivis.combineDataByGroupsize(data, groupSize);
      assert.strictEqual(combinedByRatio.length, 2);
    });
  });
});
