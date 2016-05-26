/**
 * Created by chetanv on 26/05/16.
 */

var factory = require('../..');

var FaultyAdapter = function () {
};
FaultyAdapter.prototype = new factory.Adapter();
FaultyAdapter.prototype.save = function (doc, Model, cb) {
  cb(new Error('Save failed'));
};

module.exports = {
  FaultyAdapter: FaultyAdapter
};