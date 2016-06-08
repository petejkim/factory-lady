(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-runtime/helpers/slicedToArray'), require('babel-runtime/core-js/promise'), require('babel-runtime/core-js/get-iterator'), require('babel-runtime/helpers/extends'), require('babel-runtime/core-js/set'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/regenerator'), require('babel-runtime/helpers/asyncToGenerator'), require('babel-runtime/helpers/typeof'), require('babel-runtime/core-js/object/keys'), require('debug'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('chance')) :
  typeof define === 'function' && define.amd ? define(['babel-runtime/helpers/slicedToArray', 'babel-runtime/core-js/promise', 'babel-runtime/core-js/get-iterator', 'babel-runtime/helpers/extends', 'babel-runtime/core-js/set', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/regenerator', 'babel-runtime/helpers/asyncToGenerator', 'babel-runtime/helpers/typeof', 'babel-runtime/core-js/object/keys', 'debug', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', 'chance'], factory) :
  (global.Factory = factory(global._slicedToArray,global._Promise,global._getIterator,global._extends,global._Set,global._classCallCheck,global._createClass,global._regeneratorRuntime,global._asyncToGenerator,global._typeof,global._Object$keys,global.Debug,global._Object$getPrototypeOf,global._possibleConstructorReturn,global._inherits,global.Chance));
}(this, function (_slicedToArray,_Promise,_getIterator,_extends,_Set,_classCallCheck,_createClass,_regeneratorRuntime,_asyncToGenerator,_typeof,_Object$keys,Debug,_Object$getPrototypeOf,_possibleConstructorReturn,_inherits,Chance) { 'use strict';

  _slicedToArray = 'default' in _slicedToArray ? _slicedToArray['default'] : _slicedToArray;
  _Promise = 'default' in _Promise ? _Promise['default'] : _Promise;
  _getIterator = 'default' in _getIterator ? _getIterator['default'] : _getIterator;
  _extends = 'default' in _extends ? _extends['default'] : _extends;
  _Set = 'default' in _Set ? _Set['default'] : _Set;
  _classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
  _createClass = 'default' in _createClass ? _createClass['default'] : _createClass;
  _regeneratorRuntime = 'default' in _regeneratorRuntime ? _regeneratorRuntime['default'] : _regeneratorRuntime;
  _asyncToGenerator = 'default' in _asyncToGenerator ? _asyncToGenerator['default'] : _asyncToGenerator;
  _typeof = 'default' in _typeof ? _typeof['default'] : _typeof;
  _Object$keys = 'default' in _Object$keys ? _Object$keys['default'] : _Object$keys;
  Debug = 'default' in Debug ? Debug['default'] : Debug;
  _Object$getPrototypeOf = 'default' in _Object$getPrototypeOf ? _Object$getPrototypeOf['default'] : _Object$getPrototypeOf;
  _possibleConstructorReturn = 'default' in _possibleConstructorReturn ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
  _inherits = 'default' in _inherits ? _inherits['default'] : _inherits;
  Chance = 'default' in Chance ? Chance['default'] : Chance;

  var debug$2 = Debug('asyncPopulate');

  function asyncPopulate(target, source) {
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
      return _Promise.reject(new Error('Invalid target passed'));
    }

    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') {
      return _Promise.reject(new Error('Invalid source passed'));
    }

    var promises = [];
    _Object$keys(source).forEach(function (attr) {
      if (Array.isArray(source[attr])) {
        target[attr] = [];
        promises.push(asyncPopulate(target[attr], source[attr]));
      } else if (_typeof(source[attr]) === 'object') {
        target[attr] = target[attr] || {};
        promises.push(asyncPopulate(target[attr], source[attr]));
      } else if (typeof source[attr] === 'function') {
        promises.push(_Promise.resolve(source[attr]()).then(function (v) {
          target[attr] = v;
        }));
      } else {
        promises.push(_Promise.resolve(source[attr]).then(function (v) {
          target[attr] = v;
        }));
      }
    });

    return _Promise.all(promises);
  }

  var debug$1 = Debug('Factory');

  var Factory = function () {
    function Factory(Model, initializer) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      _classCallCheck(this, Factory);

      this.name = null;
      this.Model = null;
      this.initializer = null;
      this.options = null;

      if (!Model || typeof Model !== 'function') {
        throw new Error('Invalid Model passed to the factory');
      }

      if (!initializer || (typeof initializer === 'undefined' ? 'undefined' : _typeof(initializer)) !== 'object' && typeof initializer !== 'function') {
        throw new Error('Invalid initializer passed to the factory');
      }

      this.Model = Model;
      this.initializer = initializer;
      this.options = options;
    }

    _createClass(Factory, [{
      key: 'getFactoryAttrs',
      value: function getFactoryAttrs() {
        var buildOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var attrs = {};
        if (typeof this.initializer === 'function') {
          attrs = this.initializer(buildOptions);
        } else {
          attrs = _extends({}, this.initializer);
        }

        return _Promise.resolve(attrs);
      }
    }, {
      key: 'attrs',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var _attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var buildOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var factoryAttrs, modelAttrs;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.getFactoryAttrs(buildOptions);

                case 2:
                  factoryAttrs = _context.sent;
                  modelAttrs = {};
                  _context.next = 6;
                  return asyncPopulate(modelAttrs, factoryAttrs);

                case 6:
                  _context.next = 8;
                  return asyncPopulate(modelAttrs, _attrs);

                case 8:
                  return _context.abrupt('return', modelAttrs);

                case 9:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function attrs(_x3, _x4) {
          return ref.apply(this, arguments);
        }

        return attrs;
      }()
    }, {
      key: 'build',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(adapter) {
          var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var modelAttrs;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.attrs(attrs, buildOptions);

                case 2:
                  modelAttrs = _context2.sent;
                  return _context2.abrupt('return', adapter.build(this.Model, modelAttrs));

                case 4:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function build(_x7, _x8, _x9) {
          return ref.apply(this, arguments);
        }

        return build;
      }()
    }, {
      key: 'create',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(adapter) {
          var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var model;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return this.build(adapter, attrs, buildOptions);

                case 2:
                  model = _context3.sent;
                  return _context3.abrupt('return', adapter.save(this.Model, model));

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function create(_x12, _x13, _x14) {
          return ref.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: 'attrsMany',
      value: function attrsMany(num) {
        var attrsArray = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var buildOptionsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

        var models = [];
        var attrObject = null;
        var buildOptionsObject = null;

        if ((typeof attrsArray === 'undefined' ? 'undefined' : _typeof(attrsArray)) === 'object' && !Array.isArray(attrsArray)) {
          attrObject = attrsArray;
          attrsArray = [];
        }

        if (!Array.isArray(buildOptionsArray) && (typeof buildOptionsArray === 'undefined' ? 'undefined' : _typeof(buildOptionsArray)) === 'object') {
          buildOptionsObject = buildOptionsArray;
          buildOptionsArray = [];
        }

        if (typeof num !== 'number' || num < 1) {
          return _Promise.reject(new Error('Invalid number of objects requested'));
        }

        if (!Array.isArray(attrsArray)) {
          return _Promise.reject(new Error('Invalid attrsArray passed'));
        }

        if (!Array.isArray(buildOptionsArray)) {
          return _Promise.reject(new Error('Invalid buildOptionsArray passed'));
        }

        attrsArray.length = buildOptionsArray.length = num;
        for (var i = 0; i < num; i++) {
          models[i] = this.attrs(attrObject || attrsArray[i] || {}, buildOptionsObject || buildOptionsArray[i] || {});
        }

        return _Promise.all(models);
      }
    }, {
      key: 'buildMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(adapter, num) {
          var _this = this;

          var attrsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
          var buildOptionsArray = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
          var attrs, models;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.attrsMany(num, attrsArray, buildOptionsArray);

                case 2:
                  attrs = _context4.sent;
                  models = attrs.map(function (attr) {
                    return adapter.build(_this.Model, attr);
                  });
                  return _context4.abrupt('return', _Promise.all(models));

                case 5:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function buildMany(_x19, _x20, _x21, _x22) {
          return ref.apply(this, arguments);
        }

        return buildMany;
      }()
    }, {
      key: 'createMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(adapter, num) {
          var _this2 = this;

          var attrsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
          var buildOptionsArray = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
          var models, savedModels;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.buildMany(adapter, num, attrsArray, buildOptionsArray);

                case 2:
                  models = _context5.sent;
                  savedModels = models.map(function (model) {
                    return adapter.save(_this2.Model, model);
                  });
                  return _context5.abrupt('return', _Promise.all(savedModels));

                case 5:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function createMany(_x25, _x26, _x27, _x28) {
          return ref.apply(this, arguments);
        }

        return createMany;
      }()
    }]);

    return Factory;
  }();

  /**
   * Created by chetanv on 01/06/16.
   */

  var Generator = function () {
    function Generator(factoryGirl) {
      _classCallCheck(this, Generator);

      if (!factoryGirl) {
        throw new Error('No FactoryGirl instance passed.');
      }
      this.factoryGirl = factoryGirl;
    }

    _createClass(Generator, [{
      key: 'generate',
      value: function generate() {
        throw new Error('Override this method to generate a value');
      }
    }]);

    return Generator;
  }();

  var Sequence = function (_Generator) {
    _inherits(Sequence, _Generator);

    function Sequence(factoryGirl, id) {
      var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      _classCallCheck(this, Sequence);

      var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(Sequence).call(this, factoryGirl));

      _this.id = '';


      if (typeof id !== 'string') {
        throw new Error('Invalid sequence key passed');
      }

      _this.id = id;

      Sequence.sequences[id] = Sequence.sequences[id] || 1;
      _this.callback = callback;
      return _this;
    }

    _createClass(Sequence, [{
      key: 'generate',
      value: function generate() {
        var count = Sequence.sequences[this.id]++;
        return _Promise.resolve(this.callback ? this.callback(count) : count);
      }
    }]);

    return Sequence;
  }(Generator);

  Sequence.sequences = {};

  var ModelGenerator = function (_Generator) {
    _inherits(ModelGenerator, _Generator);

    function ModelGenerator(factoryGirl, name) {
      var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var attrs = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
      var buildOptions = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

      _classCallCheck(this, ModelGenerator);

      var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(ModelGenerator).call(this, factoryGirl));

      if (typeof name !== 'string' || name.length < 1) {
        throw new Error('Invalid model name passed');
      }

      _this.name = name;
      _this.key = key;
      _this.attrs = attrs;
      _this.buildOptions = buildOptions;
      return _this;
    }

    return ModelGenerator;
  }(Generator);

  var Assoc = function (_ModelGenerator) {
    _inherits(Assoc, _ModelGenerator);

    function Assoc() {
      _classCallCheck(this, Assoc);

      return _possibleConstructorReturn(this, _Object$getPrototypeOf(Assoc).apply(this, arguments));
    }

    _createClass(Assoc, [{
      key: 'generate',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var model;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.create(this.name, this.attrs, this.buildOptions);

                case 2:
                  model = _context.sent;
                  return _context.abrupt('return', this.key ? model[this.key] : model);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate() {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);

    return Assoc;
  }(ModelGenerator);

  var AssocAttrs = function (_ModelGenerator) {
    _inherits(AssocAttrs, _ModelGenerator);

    function AssocAttrs() {
      _classCallCheck(this, AssocAttrs);

      return _possibleConstructorReturn(this, _Object$getPrototypeOf(AssocAttrs).apply(this, arguments));
    }

    _createClass(AssocAttrs, [{
      key: 'generate',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var model;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.attrs(this.name, this.attrs, this.buildOptions);

                case 2:
                  model = _context.sent;
                  return _context.abrupt('return', this.key ? model[this.key] : model);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate() {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);

    return AssocAttrs;
  }(ModelGenerator);

  var Build = function (_ModelGenerator) {
    _inherits(Build, _ModelGenerator);

    function Build() {
      _classCallCheck(this, Build);

      return _possibleConstructorReturn(this, _Object$getPrototypeOf(Build).apply(this, arguments));
    }

    _createClass(Build, [{
      key: 'generate',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var model;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.build(this.name, this.attrs, this.buildOptions);

                case 2:
                  model = _context.sent;
                  return _context.abrupt('return', this.key ? model[this.key] : model);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate() {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);

    return Build;
  }(ModelGenerator);

  var ManyModelGenerator = function (_ModelGenerator) {
    _inherits(ManyModelGenerator, _ModelGenerator);

    function ManyModelGenerator(factoryGirl, name, num) {
      var key = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
      var attrs = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
      var buildOptions = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

      _classCallCheck(this, ManyModelGenerator);

      var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(ManyModelGenerator).call(this, factoryGirl, name, key, attrs, buildOptions));

      if (typeof num !== 'number' || num < 1) {
        throw new Error('Invalid number of items requested.');
      }

      _this.num = num;
      return _this;
    }

    return ManyModelGenerator;
  }(ModelGenerator);

  var AssocMany = function (_ManyModelGenerator) {
    _inherits(AssocMany, _ManyModelGenerator);

    function AssocMany() {
      _classCallCheck(this, AssocMany);

      return _possibleConstructorReturn(this, _Object$getPrototypeOf(AssocMany).apply(this, arguments));
    }

    _createClass(AssocMany, [{
      key: 'generate',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var models;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.createMany(this.name, this.num, this.attrs, this.buildOptions);

                case 2:
                  models = _context.sent;
                  return _context.abrupt('return', this.key ? models.map(function (model) {
                    return model[_this2.key];
                  }) : models);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate() {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);

    return AssocMany;
  }(ManyModelGenerator);

  var AssocAttrsMany = function (_ManyModelGenerator) {
    _inherits(AssocAttrsMany, _ManyModelGenerator);

    function AssocAttrsMany() {
      _classCallCheck(this, AssocAttrsMany);

      return _possibleConstructorReturn(this, _Object$getPrototypeOf(AssocAttrsMany).apply(this, arguments));
    }

    _createClass(AssocAttrsMany, [{
      key: 'generate',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var models;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.attrsMany(this.name, this.num, this.attrs, this.buildOptions);

                case 2:
                  models = _context.sent;
                  return _context.abrupt('return', this.key ? models.map(function (model) {
                    return model[_this2.key];
                  }) : models);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate() {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);

    return AssocAttrsMany;
  }(ManyModelGenerator);

  var BuildMany = function (_ManyModelGenerator) {
    _inherits(BuildMany, _ManyModelGenerator);

    function BuildMany() {
      _classCallCheck(this, BuildMany);

      return _possibleConstructorReturn(this, _Object$getPrototypeOf(BuildMany).apply(this, arguments));
    }

    _createClass(BuildMany, [{
      key: 'generate',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var models;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.factoryGirl.buildMany(this.name, this.num, this.attrs, this.buildOptions);

                case 2:
                  models = _context.sent;
                  return _context.abrupt('return', this.key ? models.map(function (model) {
                    return model[_this2.key];
                  }) : models);

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function generate() {
          return ref.apply(this, arguments);
        }

        return generate;
      }()
    }]);

    return BuildMany;
  }(ManyModelGenerator);

  var debug$3 = Debug('Chance');
  var chance = new Chance();

  var ChanceGenerator = function (_Generator) {
    _inherits(ChanceGenerator, _Generator);

    function ChanceGenerator(factoryGirl, chanceMethod, options) {
      _classCallCheck(this, ChanceGenerator);

      var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(ChanceGenerator).call(this, factoryGirl));

      _this.method = null;
      _this.params = null;


      if (typeof chance[chanceMethod] !== 'function') {
        throw new Error('Invalid chance method requested');
      }

      _this.method = chanceMethod;
      _this.params = options;
      return _this;
    }

    _createClass(ChanceGenerator, [{
      key: 'generate',
      value: function generate() {
        return _Promise.resolve(chance[this.method](this.params));
      }
    }]);

    return ChanceGenerator;
  }(Generator);

  /**
   * Created by chetanv on 01/06/16.
   */

  function attrGenerator (factoryGirl, SomeGenerator) {
    return function () {
      var generator = new (Function.prototype.bind.apply(SomeGenerator, [null].concat([factoryGirl], Array.prototype.slice.call(arguments))))();
      return function () {
        return generator.generate();
      };
    };
  }

  /**
   * Created by chetanv on 01/06/16.
   */

  var DefaultAdapter = function () {
    function DefaultAdapter() {
      _classCallCheck(this, DefaultAdapter);
    }

    _createClass(DefaultAdapter, [{
      key: "build",
      value: function build(Model, props) {
        return _Promise.resolve(new Model(props));
      }
    }, {
      key: "save",
      value: function save(Model, model) {
        return _Promise.resolve(model.save()).then(function () {
          return model;
        });
      }
    }, {
      key: "destroy",
      value: function destroy(Model, model) {
        return _Promise.resolve(model.destroy()).then(function () {
          return model;
        });
      }
    }]);

    return DefaultAdapter;
  }();

  var debug = Debug('FactoryGirl');

  var FactoryGirl = function () {
    function FactoryGirl(options) {
      _classCallCheck(this, FactoryGirl);

      this.factories = {};
      this.options = {};
      this.adapters = {};
      this.created = new _Set();

      this.assoc = attrGenerator(this, Assoc);
      this.assocMany = attrGenerator(this, AssocMany);
      this.assocBuild = attrGenerator(this, Build);
      this.assocBuildMany = attrGenerator(this, BuildMany);
      this.assocAttrs = attrGenerator(this, AssocAttrs);
      this.assocAttrsMany = attrGenerator(this, AssocAttrsMany);
      this.seq = this.sequence = attrGenerator(this, Sequence);
      this.chance = attrGenerator(this, ChanceGenerator);

      this.defaultAdapter = new DefaultAdapter();
      this.options = options;
    }

    _createClass(FactoryGirl, [{
      key: 'define',
      value: function define(name, Model, initializer, options) {
        if (this.getFactory(name, false)) {
          throw new Error('factory ' + name + ' already defined');
        }

        this.factories[name] = new Factory(Model, initializer, options);
      }
    }, {
      key: 'attrs',
      value: function attrs(name, _attrs, buildOptions) {
        return this.getFactory(name).attrs(_attrs, buildOptions);
      }
    }, {
      key: 'build',
      value: function build(name, attrs, buildOptions) {
        var adapter = this.getAdapter(name);
        return this.getFactory(name).build(adapter, attrs, buildOptions);
      }
    }, {
      key: 'create',
      value: function create(name, attrs, buildOptions) {
        var _this = this;

        var adapter = this.getAdapter(name);
        return this.getFactory(name).create(adapter, attrs, buildOptions).then(function (createdModel) {
          _this.addToCreatedList(adapter, createdModel);
          return createdModel;
        });
      }
    }, {
      key: 'attrsMany',
      value: function attrsMany(name, num, attrs, buildOptions) {
        return this.getFactory(name).attrsMany(num, attrs, buildOptions);
      }
    }, {
      key: 'buildMany',
      value: function buildMany(name, num, attrs, buildOptions) {
        var adapter = this.getAdapter(name);
        return this.getFactory(name).buildMany(adapter, num, attrs, buildOptions);
      }
    }, {
      key: 'createMany',
      value: function createMany(name, num, attrs, buildOptions) {
        var _this2 = this;

        var adapter = this.getAdapter(name);
        return this.getFactory(name).createMany(adapter, num, attrs, buildOptions).then(function (createdModels) {
          _this2.addToCreatedList(adapter, createdModels);
          return createdModels;
        });
      }
    }, {
      key: 'getFactory',
      value: function getFactory(name) {
        var throwError = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (!this.factories[name]) {
          if (throwError) {
            throw new Error('Invalid factory requested');
          }
        }
        return this.factories[name];
      }
    }, {
      key: 'withOptions',
      value: function withOptions(options) {
        var merge = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        this.options = merge ? _extends({}, this.options, options) : options;
      }
    }, {
      key: 'getAdapter',
      value: function getAdapter(factory) {
        return factory ? this.adapters[factory] || this.defaultAdapter : this.defaultAdapter;
      }
    }, {
      key: 'addToCreatedList',
      value: function addToCreatedList(adapter, models) {
        if (!Array.isArray(models)) {
          models = [models];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(models), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var model = _step.value;

            this.created.add([adapter, model]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'cleanUp',
      value: function cleanUp() {
        var promises = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(this.created), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2);

            var adapter = _step2$value[0];
            var model = _step2$value[1];

            promises.push(adapter.destroy(model.constructor, model));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.created.clear();
        return _Promise.all(promises);
      }
    }, {
      key: 'setAdapter',
      value: function setAdapter(adapter, factory) {
        if (!factory) {
          this.defaultAdapter = adapter;
        } else {
          this.adapters[factory] = adapter;
        }
      }
    }]);

    return FactoryGirl;
  }();

  var factory = new FactoryGirl();

  return factory;

}));
//# sourceMappingURL=index.umd.js.map