(function() {
  if (typeof module === 'undefined') {
    exports = this.factory = {};
  }

  var factories = {};
  var defaultAdapter = null;
  var adapters = {};

  var factory = function(name, userAttrs, callback) {
    if (typeof userAttrs === 'function') {
      callback = userAttrs;
      userAttrs = {};
    }

    if (!factories[name]) {
      return callback(new Error("No factory defined for model '" + name + "'"));
    }
    factory.build(name, userAttrs, function(err, doc) {
      var model = factories[name].model;
      factory.adapterFor(name).save(doc, model, function(err) {
        callback(err, doc);
      });
    });
  };
  module.exports = factory;
  factory.create = factory;

  factory.define = function(name, model, attributes) {
    factories[name] = {
      model: model,
      attributes: attributes
    };
  };

  factory.build = function(name, userAttrs, callback) {
    if (typeof userAttrs === 'function') {
      callback = userAttrs;
      userAttrs = {};
    }

    if (!factories[name]) {
      return callback(new Error("No factory defined for model '" + name + "'"));
    }
    var model = factories[name].model;
    var attrs = copy(factories[name].attributes);
    merge(attrs, userAttrs);

    asyncForEach(keys(attrs), function(key, cb) {
      var fn = attrs[key];
      if (typeof fn === 'function') {
        if (!fn.length) {
          attrs[key] = fn.call(attrs);
          cb();
        }
        else {
          fn.call(attrs, function(err, value) {
            if (err) return cb(err);
            attrs[key] = value;
            cb();
          });
        }
      }
      else {
        cb();
      }
    }, function(err) {
      if (err) return callback(err);
      var doc = factory.adapterFor(name).build(model, attrs);
      callback(null, doc);
    });
  };

  factory.assoc = function(name, attr) {
    return function(callback) {
      factory.create(name, function(err, doc) {
        if (attr) {
          callback(err, doc[attr]);
        }
        else {
          callback(err, doc);
        }
      });
    };
  };

  factory.adapterFor = function(name) {
    return adapters[name] || defaultAdapter;
  }

  factory.setAdapter = function(adapter, name) {
    if (name) {
      adapters[name] = adapter;
    }
    else {
      defaultAdapter = adapter;
    }
  }

  factory.promisify = function(promiseLibrary) {
    var promisified = {};
    for (var i in factory) {
      promisified[i] = factory[i];
    }
    var promisify = promiseLibrary.promisify || promiseLibrary.denodeify;
    if (promisify) {
      promisified.build = promisify(factory.build);
      promisified.create = promisify(factory.create);
      return promisified;
    }
    else {
      throw new Error("No 'promisify' or 'denodeify' method found in supplied promise library");
    }
  }

  var Adapter = function() {};
  factory.Adapter = Adapter;
  Adapter.prototype.build = function(Model, props) {
    var doc = new Model();
    this.set(props, doc, Model);
    return doc;
  };
  Adapter.prototype.set = function(props, doc, Model) {
    var key;
    for (key in props) {
      if (props.hasOwnProperty(key)) {
        doc[key] = props[key];
      }
    }
  };
  Adapter.prototype.save = function(doc, Model, cb) {
    doc.save(cb);
  };
  defaultAdapter = new Adapter();

  function merge(obj1, obj2) {
    if (obj1 && obj2) {
      var key;
      for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          obj1[key] = obj2[key];
        }
      }
    }
    return obj1;
  }
  function copy(obj) {
    var newObj = {};
    if (obj) {
      merge(newObj, obj);
    }
    return newObj;
  }
  function keys(obj) {
    var keys = [], key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
       keys.push(key);
      }
    }
    return keys;
  }
  var asyncForEach = function(array, handler, callback) {
    var length = array.length, index = -1;

    var processNext = function(err) {
      if (err) return callback(err);
      index++;
      if (index < length) {
        var item = array[index];
        handler(item, processNext);
      } else {
        callback();
      }
    };

    processNext();
  };

}());

