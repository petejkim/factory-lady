(function() {
  var Factory = function() {
    var factory = this,
        factories = {},
        defaultAdapter = new Adapter(),
        adapters = {},
        created = [];

    factory.define = function(name, model, attributes, options) {
      options = options || {};

      factories[name] = {
        model: model,
        attributes: attributes,
        options: options
      };
    };

    var builderProxy = function(fnName) {
      return function() {
        var builder = new Builder();
        return builder[fnName].apply(this, arguments);
      };
    };

    factory.withOptions = builderProxy('withOptions');
    factory.build = builderProxy('build');
    factory.buildSync = builderProxy('buildSync');
    factory.buildMany = builderProxy('buildMany');
    factory.create = builderProxy('create');
    factory.createMany = builderProxy('createMany');

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
        if (factory.hasOwnProperty(i)) {
          promisified[i] = factory[i];
        }
      }
      promisified.build = promisify(factory.build);
      promisified.create = promisify(factory.create);
      promisified.buildMany = promisify(factory.buildMany);
      promisified.createMany = promisify(factory.createMany);
      promisified.cleanup = promisify(factory.cleanup);
      return promisified;
    };

    factory.cleanup = function(callback) {
      asyncForEach(created.reverse(), function(tuple, cb) {
        var name = tuple[0],
            doc = tuple[1],
            adapter = factory.adapterFor(name),
            model = factories[name].model;
        adapter.destroy(doc, model, cb);
      }, callback);
      created = [];
    };

    var Builder = function() {
      var builder = this;
      builder.options = {};

      builder.withOptions = function(options) {
        merge(builder.options, options);
        return builder;
      }

      builder.create = function(name, attrs, callback) {
        if (typeof attrs === 'function') {
          callback = attrs;
          attrs = {};
        }
        if (!factories[name]) {
          return callback(new Error("No factory defined for model '" + name + "'"));
        }

        builder.build(name, attrs, function(err, doc) {
          if (err) return callback(err);

          save(name, doc, function(saveErr, saveDoc) {
            if(saveErr) return callback(saveErr);

            if (factories[name].options.afterCreate) {
              factories[name].options.afterCreate.call(this, saveDoc, builder.options, callback);
            } else {
              callback(saveErr, saveDoc);
            }
          });
        });
      };

      builder.build = function(name, attrs, callback) {
        if (typeof attrs === 'function') {
          callback = attrs;
          attrs = {};
        }

        if (!factories[name]) {
          return callback(new Error("No factory defined for model '" + name + "'"));
        }
        var model = factories[name].model;
        attrs = merge(copy(factories[name].attributes), attrs);

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

      builder.buildSync = function(name, attrs) {
        if (!factories[name]) {
          throw new Error("No factory defined for model '" + name + "'");
        }
        var model = factories[name].model;
        attrs = merge(copy(factories[name].attributes), attrs);
        var names = keys(attrs);
        for (var i = 0; i < names.length; i++) {
          var key = names[i], fn = attrs[key];
          if (typeof fn == 'function') {
            if (fn.length) {
              throw new Error("buildSync only supports synchronous property functions (with no arguments): the function for '" + name + "." + key + "' expects " + fn.length + " arguments");
            }
            attrs[key] = fn.call(attrs);
          }
        }
        var adapter = factory.adapterFor(name);
        return adapter.build(model, attrs);
      };

      builder.buildMany = function(name, attrsArray, num, callback) {
        var args = parseBuildManyArgs.apply(null, arguments);
        buildMany(args);
      };

      builder.createMany = function(name, attrsArray, num, callback) {
        var args = parseBuildManyArgs.apply(null, arguments),
            results = [];
        callback = args.callback;
        args.callback = function(err, docs) {
          if (err) return callback(err);
          asyncForEach(docs, function(doc, cb, index) {
            save(name, doc, function(err) {
              if (!err) results[index] = doc;
              cb(err);
            });
          }, function(err) {
            callback(err, results);
          });
        };
        buildMany(args);
      };

      function buildMany(args) {
        var results = [];
        asyncForEach(args.attrsArray, function(attrs, cb, index) {
          builder.build(args.name, attrs, function(err, doc) {
            if (!err) results[index] = doc;
            cb(err);
          });
        }, function(err) {
          args.callback(err, results);
        });
      }

      function parseBuildManyArgs(name, attrsArray, num, callback) {
        if (typeof num == 'function') { // name, Array, callback
          callback = num;
          num = attrsArray.length;
        }
        if (typeof attrsArray == 'number') { // name, num, callback
          num = attrsArray;
          attrsArray = null;
        }
        if (!(attrsArray instanceof Array)) { // name, Object, num, callback
          if (typeof num != 'number') throw new Error("num must be specified when attrsArray is not an array");
          var attrs = attrsArray;
          attrsArray = new Array(num);
          for (var i = 0; i < num; i++) {
            attrsArray[i] = attrs;
          }
        }
        if (!attrsArray) {
          attrsArray = new Array(num);
        }
        else if( attrsArray.length !== num ) {
          attrsArray.length = num;
        }
        return {
          name: name,
          attrsArray: attrsArray,
          num: num,
          callback: callback
        };
      }

      function save(name, doc, callback) {
        var model = factories[name].model;
        factory.adapterFor(name).save(doc, model, function (err) {
          if (!err) created.push([name, doc]);
          callback(err, doc);
        });
      }
    }
  };

  var Adapter = function() {};

  Adapter.prototype.build = function(Model, props) {
    var doc = new Model();
    this.set(props, doc, Model);
    return doc;
  };
  Adapter.prototype.get = function(doc, attr, Model) {
    return doc[attr];
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

  if (typeof module === 'undefined') {
    this.factory = {};
    module = this.factory;
  }
  module.exports = new Factory();
  module.exports.Adapter = Adapter;
  module.exports.Factory = Factory;
  module.exports.ObjectAdapter = require('./lib/object-adapter');

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
    var rv = [], key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
       rv.push(key);
      }
    }
    return rv;
  }
  function asyncForEach(array, handler, callback) {
    var length = array.length,
        index = -1;
    function processNext(err) {
      if (err) return callback(err);
      index++;
      if (index < length) {
        handler(array[index], processNext, index);
      }
      else {
        callback && callback();
      }
    }
    processNext();
  }

}());

