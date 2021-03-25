const assert = require('assert');
const dataset = require('./test-data/test.dataset.location.time.json');
const datasets = require('./test-data/test.datasets.location.time.json');
const lotivis = require('../dist/lotivis');

describe('dataset', function () {

  describe('#dataset combine data by ratio', function () {
    let data = dataset.data;

    it('if ratio is 2 the data has a length of 3', function () {
      let groupSize = 2;
      let combinedByRatio = lotivis.combineDataByGroupsize(data, groupSize);
      console.log('combinedByRatio', combinedByRatio);
      assert.strictEqual(combinedByRatio.length, 3);
    });

    it('if ratio is 3 the data has a length of 2', function () {
      let groupSize = 3;
      let combinedByRatio = lotivis.combineDataByGroupsize(data, groupSize);
      console.log('combinedByRatio', combinedByRatio);
      assert.strictEqual(combinedByRatio.length, 2);
    });
  });
});
