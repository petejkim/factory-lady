(function() {
  if (typeof module === 'undefined') {
    exports = this.factory = {};
  };

  var factories = {},
      defaultAdapter = null,
      adapters = {};

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
        if (!err) factories[name].created.push(doc);
        callback(err, doc);
      });
    });
  };
  module.exports = factory;
  factory.create = factory;

  factory.define = function(name, model, attributes) {
    factories[name] = {
      model: model,
      attributes: attributes,
      created: []
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
      var adapter = factory.adapterFor(name),
          doc = adapter.build(model, attrs);
      callback(null, doc);
    });
  };

  factory.assoc = function(name, attr) {
    return function(callback) {
      factory.create(name, function(err, doc) {
        if (err) return callback(err);
        callback(null, attr ? doc[attr] : doc);
      });
    };
  };

  factory.adapterFor = function(name) {
    return adapters[name] || defaultAdapter;
  };

  factory.setAdapter = function(adapter, name) {
    if (name) {
      adapters[name] = adapter;
    }
    else {
      defaultAdapter = adapter;
    }
  };

  factory.promisify = function(promiseLibrary) {
    var promisify = promiseLibrary.promisify || promiseLibrary.denodeify;
    if (!promisify) throw new Error("No 'promisify' or 'denodeify' method found in supplied promise library");
    var promisified = {};
    for (var i in factory) {
      promisified[i] = factory[i];
    }
    promisified.build = promisify(factory.build);
    promisified.create = promisify(factory.create);
    promisified.cleanup = promisify(factory.cleanup);
    return promisified;
  };

  factory.cleanup = function(callback) {
    asyncForEach(keys(factories), function(name, cb1) {
      var model = factories[name].model,
          adapter = factory.adapterFor(name);
      asyncForEach(factories[name].created, function(doc, cb2) {
        adapter.destroy(doc, model, cb2);
      }, cb1);
      factories[name].created = [];
    }, callback);
  };

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
  /**
    Be aware that the model may have already been destroyed
   */
  Adapter.prototype.destroy = function(doc, Model, cb) {
    doc.destroy(cb);
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
  };
  function copy(obj) {
    var newObj = {};
    if (obj) {
      merge(newObj, obj);
    }
    return newObj;
  };
  function keys(obj) {
    var keys = [], key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
       keys.push(key);
      }
    }
    return keys;
  };
  function asyncForEach(array, handler, callback) {
    var length = array.length,
        index = -1;
    function processNext(err) {
      if (err) return callback(err);
      index++;
      if (index < length) {
        handler(array[index], processNext);
      }
      else {
        callback && callback();
      }
    };
    processNext();
  };

}());

