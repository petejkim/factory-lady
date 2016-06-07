(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-runtime/helpers/extends'), require('babel-runtime/regenerator'), require('babel-runtime/helpers/asyncToGenerator'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/core-js/promise'), require('babel-runtime/helpers/typeof'), require('babel-runtime/core-js/object/keys'), require('debug'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits')) :
  typeof define === 'function' && define.amd ? define(['babel-runtime/helpers/extends', 'babel-runtime/regenerator', 'babel-runtime/helpers/asyncToGenerator', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/core-js/promise', 'babel-runtime/helpers/typeof', 'babel-runtime/core-js/object/keys', 'debug', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits'], factory) :
  (global.Factory = factory(global._extends,global._regeneratorRuntime,global._asyncToGenerator,global._classCallCheck,global._createClass,global._Promise,global._typeof,global._Object$keys,global.Debug,global._Object$getPrototypeOf,global._possibleConstructorReturn,global._inherits));
}(this, function (_extends,_regeneratorRuntime,_asyncToGenerator,_classCallCheck,_createClass,_Promise,_typeof,_Object$keys,Debug,_Object$getPrototypeOf,_possibleConstructorReturn,_inherits) { 'use strict';

  _extends = 'default' in _extends ? _extends['default'] : _extends;
  _regeneratorRuntime = 'default' in _regeneratorRuntime ? _regeneratorRuntime['default'] : _regeneratorRuntime;
  _asyncToGenerator = 'default' in _asyncToGenerator ? _asyncToGenerator['default'] : _asyncToGenerator;
  _classCallCheck = 'default' in _classCallCheck ? _classCallCheck['default'] : _classCallCheck;
  _createClass = 'default' in _createClass ? _createClass['default'] : _createClass;
  _Promise = 'default' in _Promise ? _Promise['default'] : _Promise;
  _typeof = 'default' in _typeof ? _typeof['default'] : _typeof;
  _Object$keys = 'default' in _Object$keys ? _Object$keys['default'] : _Object$keys;
  Debug = 'default' in Debug ? Debug['default'] : Debug;
  _Object$getPrototypeOf = 'default' in _Object$getPrototypeOf ? _Object$getPrototypeOf['default'] : _Object$getPrototypeOf;
  _possibleConstructorReturn = 'default' in _possibleConstructorReturn ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
  _inherits = 'default' in _inherits ? _inherits['default'] : _inherits;

  /**
   * Created by chetanv on 07/06/16.
   */

  var asyncPopulate = function () {
    var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(target, source) {
      var _this = this;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _Object$keys(source).forEach(function () {
                var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(attr) {
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!Array.isArray(source[attr])) {
                            _context.next = 6;
                            break;
                          }

                          target[attr] = [];
                          _context.next = 4;
                          return asyncPopulate(target[attr], source[attr]);

                        case 4:
                          _context.next = 21;
                          break;

                        case 6:
                          if (!(_typeof(source[attr]) === 'object')) {
                            _context.next = 12;
                            break;
                          }

                          target[attr] = target[attr] || {};
                          _context.next = 10;
                          return asyncPopulate(target[attr], source[attr]);

                        case 10:
                          _context.next = 21;
                          break;

                        case 12:
                          if (!(typeof source[attr] === 'function')) {
                            _context.next = 18;
                            break;
                          }

                          _context.next = 15;
                          return _Promise.resolve(source[attr]());

                        case 15:
                          target[attr] = _context.sent;
                          _context.next = 21;
                          break;

                        case 18:
                          _context.next = 20;
                          return _Promise.resolve(source[attr]);

                        case 20:
                          target[attr] = _context.sent;

                        case 21:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3) {
                  return ref.apply(this, arguments);
                };
              }());

              return _context2.abrupt('return', target);

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function asyncPopulate(_x, _x2) {
      return ref.apply(this, arguments);
    };
  }();

  var debug = Debug('Factory');

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
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var buildOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          var attrs;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  attrs = {};

                  if (!(typeof this.initializer === 'function')) {
                    _context.next = 7;
                    break;
                  }

                  _context.next = 4;
                  return _Promise.resolve(this.initializer(buildOptions));

                case 4:
                  attrs = _context.sent;
                  _context.next = 8;
                  break;

                case 7:
                  attrs = _extends({}, this.initializer);

                case 8:
                  return _context.abrupt('return', attrs);

                case 9:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getFactoryAttrs(_x2) {
          return ref.apply(this, arguments);
        }

        return getFactoryAttrs;
      }()
    }, {
      key: 'attrs',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
          var _attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var buildOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var factoryAttrs, modelAttrs;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.getFactoryAttrs(buildOptions);

                case 2:
                  factoryAttrs = _context2.sent;
                  modelAttrs = {};
                  _context2.next = 6;
                  return asyncPopulate(modelAttrs, factoryAttrs);

                case 6:
                  _context2.next = 8;
                  return asyncPopulate(modelAttrs, _attrs);

                case 8:
                  return _context2.abrupt('return', modelAttrs);

                case 9:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function attrs(_x4, _x5) {
          return ref.apply(this, arguments);
        }

        return attrs;
      }()
    }, {
      key: 'build',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(adapter) {
          var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var modelAttrs;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return this.attrs(attrs, buildOptions);

                case 2:
                  modelAttrs = _context3.sent;
                  return _context3.abrupt('return', adapter.build(this.Model, modelAttrs));

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function build(_x8, _x9, _x10) {
          return ref.apply(this, arguments);
        }

        return build;
      }()
    }, {
      key: 'create',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(adapter) {
          var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var buildOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var model;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.build(adapter, attrs, buildOptions);

                case 2:
                  model = _context4.sent;
                  return _context4.abrupt('return', adapter.save(this.Model, model));

                case 4:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function create(_x13, _x14, _x15) {
          return ref.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: 'attrsMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(num) {
          var attrsArray = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
          var buildOptionsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
          var models, attrObject, buildOptionsObject, i;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  models = [];
                  attrObject = null;
                  buildOptionsObject = null;


                  if (!Array.isArray(attrsArray) && (typeof attrsArray === 'undefined' ? 'undefined' : _typeof(attrsArray)) === 'object') {
                    attrObject = attrsArray;
                    attrsArray = [];
                  }

                  if (!Array.isArray(buildOptionsArray) && (typeof buildOptionsArray === 'undefined' ? 'undefined' : _typeof(buildOptionsArray)) === 'object') {
                    buildOptionsObject = buildOptionsArray;
                    buildOptionsArray = [];
                  }

                  if (!(typeof num !== 'number' || num < 1)) {
                    _context5.next = 7;
                    break;
                  }

                  throw new Error('Invalid number of objects requested');

                case 7:
                  if (Array.isArray(attrsArray)) {
                    _context5.next = 9;
                    break;
                  }

                  throw new Error('Invalid attrsArray passed');

                case 9:
                  if (Array.isArray(buildOptionsArray)) {
                    _context5.next = 11;
                    break;
                  }

                  throw new Error('Invalid buildOptionsArray passed');

                case 11:

                  attrsArray.length = buildOptionsArray.length = num;
                  for (i = 0; i < num; i++) {
                    models[i] = this.attrs(attrObject || attrsArray[i] || {}, buildOptionsObject || buildOptionsArray[i] || {});
                  }

                  return _context5.abrupt('return', _Promise.all(models));

                case 14:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function attrsMany(_x18, _x19, _x20) {
          return ref.apply(this, arguments);
        }

        return attrsMany;
      }()
    }, {
      key: 'buildMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee6(adapter, num) {
          var _this = this;

          var attrsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
          var buildOptionsArray = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
          var attrs, models;
          return _regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this.attrsMany(num, attrsArray, buildOptionsArray);

                case 2:
                  attrs = _context6.sent;
                  models = attrs.map(function (attr) {
                    return adapter.build(_this.Model, attr);
                  });
                  return _context6.abrupt('return', _Promise.all(models));

                case 5:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function buildMany(_x23, _x24, _x25, _x26) {
          return ref.apply(this, arguments);
        }

        return buildMany;
      }()
    }, {
      key: 'createMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee7(adapter, num) {
          var _this2 = this;

          var attrsArray = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
          var buildOptionsArray = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
          var models, savedModels;
          return _regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return this.buildMany(adapter, num, attrsArray, buildOptionsArray);

                case 2:
                  models = _context7.sent;
                  savedModels = models.map(function (model) {
                    return adapter.save(_this2.Model, model);
                  });
                  return _context7.abrupt('return', _Promise.all(savedModels));

                case 5:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function createMany(_x29, _x30, _x31, _x32) {
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
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
          var count;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  count = Sequence.sequences[this.id]++;
                  return _context.abrupt('return', this.callback ? this.callback(count) : count);

                case 2:
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

  var AssocMany = function (_ModelGenerator) {
    _inherits(AssocMany, _ModelGenerator);

    function AssocMany(factoryGirl, name, num) {
      var key = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
      var attrs = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
      var buildOptions = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

      _classCallCheck(this, AssocMany);

      var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(AssocMany).call(this, factoryGirl, name, key, attrs, buildOptions));

      if (typeof num !== 'number' || num < 1) {
        throw new Error('Invalid number of items requested.');
      }

      _this.num = num;
      return _this;
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
  }(ModelGenerator);

  var BuildMany = function (_ModelGenerator) {
    _inherits(BuildMany, _ModelGenerator);

    function BuildMany(factoryGirl, name, num) {
      var key = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
      var attrs = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
      var buildOptions = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

      _classCallCheck(this, BuildMany);

      var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(BuildMany).call(this, factoryGirl, name, key, attrs, buildOptions));

      if (typeof num !== 'number' || num < 1) {
        throw new Error('Invalid number of items requested.');
      }

      _this.num = num;
      return _this;
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
  }(ModelGenerator);

  /**
   * Created by chetanv on 01/06/16.
   */

  function attrGenerator (factoryGirl, SomeGenerator) {
    return function () {
      var generator = new (Function.prototype.bind.apply(SomeGenerator, [null].concat([factoryGirl], Array.prototype.slice.call(arguments))))();
      return _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", generator.generate());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
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
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(Model, props) {
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", new Model(props));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function build(_x, _x2) {
          return ref.apply(this, arguments);
        }

        return build;
      }()
    }, {
      key: "save",
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(Model, model) {
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  model.save();
                  return _context2.abrupt("return", model);

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function save(_x3, _x4) {
          return ref.apply(this, arguments);
        }

        return save;
      }()
    }, {
      key: "destroy",
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(Model, model) {
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  model.destroy();
                  return _context3.abrupt("return", model);

                case 2:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function destroy(_x5, _x6) {
          return ref.apply(this, arguments);
        }

        return destroy;
      }()
    }]);

    return DefaultAdapter;
  }();

  var FactoryGirl = function () {
    function FactoryGirl(options) {
      _classCallCheck(this, FactoryGirl);

      this.factories = {};
      this.options = {};
      this.adapters = {};

      this.assoc = attrGenerator(this, Assoc);
      this.assocMany = attrGenerator(this, AssocMany);
      this.assocBuild = attrGenerator(this, Build);
      this.assocBuildMany = attrGenerator(this, BuildMany);
      this.sequence = attrGenerator(this, Sequence);

      this.defaultAdapter = options.defaultAdapter || new DefaultAdapter();
    }

    _createClass(FactoryGirl, [{
      key: 'define',
      value: function define(name, Model, initializer, options) {
        if (this.getFactory(name)) {
          throw new Error('factory ' + name + ' already defined');
        }

        this.factories[name] = new Factory(Model, initializer, options);
      }
    }, {
      key: 'attrs',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(name, _attrs, buildOptions) {
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.getFactory(name).attrs(_attrs, buildOptions);

                case 2:
                  return _context.abrupt('return', _context.sent);

                case 3:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function attrs(_x, _x2, _x3) {
          return ref.apply(this, arguments);
        }

        return attrs;
      }()
    }, {
      key: 'build',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(name, attrs, buildOptions) {
          var adapter;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  adapter = this.adapters[name] || this.defaultAdapter;
                  _context2.next = 3;
                  return this.getFactory(name).build(adapter, attrs, buildOptions);

                case 3:
                  return _context2.abrupt('return', _context2.sent);

                case 4:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function build(_x4, _x5, _x6) {
          return ref.apply(this, arguments);
        }

        return build;
      }()
    }, {
      key: 'create',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(name, attrs, buildOptions) {
          var adapter;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  adapter = this.adapters[name] || this.defaultAdapter;
                  _context3.next = 3;
                  return this.getFactory(name).create(adapter, attrs, buildOptions);

                case 3:
                  return _context3.abrupt('return', _context3.sent);

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function create(_x7, _x8, _x9) {
          return ref.apply(this, arguments);
        }

        return create;
      }()
    }, {
      key: 'buildMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(name, num, attrs, buildOptions) {
          var adapter;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  adapter = this.adapters[name] || this.defaultAdapter;
                  _context4.next = 3;
                  return this.getFactory(name).buildMany(adapter, num, attrs, buildOptions);

                case 3:
                  return _context4.abrupt('return', _context4.sent);

                case 4:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function buildMany(_x10, _x11, _x12, _x13) {
          return ref.apply(this, arguments);
        }

        return buildMany;
      }()
    }, {
      key: 'createMany',
      value: function () {
        var ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(name, num, attrs, buildOptions) {
          var adapter;
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  adapter = this.adapters[name] || this.defaultAdapter;
                  _context5.next = 3;
                  return this.getFactory(name).createMany(adapter, num, attrs, buildOptions);

                case 3:
                  return _context5.abrupt('return', _context5.sent);

                case 4:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function createMany(_x14, _x15, _x16, _x17) {
          return ref.apply(this, arguments);
        }

        return createMany;
      }()
    }, {
      key: 'getFactory',
      value: function getFactory(name) {
        return this.factories[name];
      }
    }, {
      key: 'withOptions',
      value: function withOptions(options) {
        var merge = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        this.options = merge ? _extends({}, this.options, options) : options;
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