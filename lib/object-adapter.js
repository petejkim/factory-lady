/* global window, define */
(function(adapter) {
  if (typeof module !== 'undefined') {
    var ObjectAdapter = adapter();
    module.exports = ObjectAdapter;
  }
  else if (typeof define === 'function' && define.amd) {
    define('factory-girl-object-adapter', function() {
      return adapter();
    });
  }
  else {
    window.ObjectAdapter = adapter();
  }
}(function() {

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

  return ObjectAdapter;
}));
