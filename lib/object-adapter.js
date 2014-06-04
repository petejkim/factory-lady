var ObjectAdapter = function() {};
ObjectAdapter.prototype.build = function(Model, props) {
  return props;
};
ObjectAdapter.prototype.save = function(doc, Model, cb) {
  process.nextTick(function() {
    cb(null, doc);
  });
};
ObjectAdapter.prototype.destroy = function(doc, Model, cb) {};

module.exports = ObjectAdapter;
