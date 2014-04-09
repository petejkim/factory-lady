(function() {
  var hash = {
    merge: function(obj1, obj2) {
      if(obj1 && obj2) {
        var key;
        for(key in obj2) {
          if(obj2.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
          }
        }
      }
      return obj1;
    }
  , copy: function(obj) {
      var newObj = {};
      if(obj) {
        hash.merge(newObj, obj);
      }
      return newObj;
    }
  , keys: function(obj) {
      var keys = [], key;
      for(key in obj) {
        if(obj.hasOwnProperty(key)) {
         keys.push(key);
        }
      }
      return keys;
    }
  };

  var asyncForEach = function(array, handler, callback) {
    var length = array.length, index = -1;

    var processNext = function() {
      index ++;
      if(index < length) {
        var item = array[index];
        handler(item, processNext);
      } else {
        callback();
      }
    };

    processNext();
  };

  var factories = {};

  var define = function(name, model, attributes) {
    factories[name] = {
      model: model
    , attributes: attributes
    };
  };

  var build = function(name, userAttrs, callback) {
    if(typeof userAttrs === 'function') {
      callback = userAttrs;
      userAttrs = {};
    }

    var model = factories[name].model;
    var attrs = hash.copy(factories[name].attributes);
    hash.merge(attrs, userAttrs);

    asyncForEach(hash.keys(attrs), function(key, cb) {
      var fn = attrs[key];
      if(typeof fn === 'function') {
        fn(function(value) {
          attrs[key] = value;
          cb();
        });
      } else {
        cb();
      }
    }, function() {
      var doc = adapterFor(name).build(model, attrs);
      callback(doc);
    });
  };

  var create = function(name, userAttrs, callback) {
    if(typeof userAttrs === 'function') {
      callback = userAttrs;
      userAttrs = {};
    }

    build(name, userAttrs, function(doc) {
      var model = factories[name].model;
      adapterFor(name).save(doc, model, function(err) {
        if (err) throw err;
        callback(doc);
      });
    });
  };

  var assoc = function(name, attr) {
    return function(callback) {
      create(name, function(doc) {
        if(attr) {
          callback(doc[attr]);
        } else {
          callback(doc);
        }
      });
    };
  };

  var Adapter = function() {};
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

  var defaultAdapter = new Adapter();
  var adapters = {};

  function adapterFor(name) {
    return adapters.name || defaultAdapter;
  }

  function setAdapter(adapter, name) {
    if (name) {
      adapters[name] = adapter;
    }
    else {
      defaultAdapter = adapter;
    }
  }

  var Factory        = create;
  Factory.define     = define;
  Factory.build      = build;
  Factory.create     = create;
  Factory.assoc      = assoc;
  Factory.Adapter    = Adapter;
  Factory.adapterFor = adapterFor;
  Factory.setAdapter = setAdapter;

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = Factory;
  } else {
    this.Factory = Factory;
  }
}());

