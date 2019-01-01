'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _shortid2 = require('shortid');

var _shortid3 = _interopRequireDefault(_shortid2);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _sortParser = require('./helpers/sortParser');

var _sortParser2 = _interopRequireDefault(_sortParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Ramda Playground https://goo.gl/2UUd4e

var NoRecordUpdatedException = function (_Error) {
  (0, _inherits3.default)(NoRecordUpdatedException, _Error);

  function NoRecordUpdatedException() {
    (0, _classCallCheck3.default)(this, NoRecordUpdatedException);
    return (0, _possibleConstructorReturn3.default)(this, (NoRecordUpdatedException.__proto__ || (0, _getPrototypeOf2.default)(NoRecordUpdatedException)).apply(this, arguments));
  }

  return NoRecordUpdatedException;
}(Error);

var defaultConf = {
  createdAt: true,
  updatedAt: true,
  shortId: true
};

var callbackMethods = ['beforeSave'];
var instanceMethods = ['toJSON'];

var isNativeType = function isNativeType(obj) {
  if (obj.name === "Number" || obj.name === "String") return true;else return false;
};

var globalMethods = {
  findWithPagination: function findWithPagination(query) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var limit = options.limit,
        pageNumber = options.pageNumber;

    var sort = (0, _sortParser2.default)(options.sort);
    var Model = this;

    return Model.find(query).sort(sort).limit(limit).skip(limit * (pageNumber - 1));
  },

  findWithCursor: function findWithCursor(query) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var limit = options.limit,
        after = options.after;

    var sort = (0, _sortParser2.default)(options.sort);
    var Model = this;

    if (_shortid3.default.isValid(after)) {
      return Model.find((0, _extends3.default)({}, query, {
        _id: { $gt: after }
      })).limit(limit).sort(sort);
    } else {
      return Model.find(query).limit(limit).sort(sort);
    }
  },

  // eslint-disable-next-line no-unused-vars
  getNextPageFlag: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(cursor) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var Model;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (cursor) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', 0);

            case 2:
              Model = this;
              return _context.abrupt('return', Model.count((0, _extends3.default)({}, query, { _id: { $gt: cursor } })));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getNextPageFlag(_x3) {
      return _ref.apply(this, arguments);
    }

    return getNextPageFlag;
  }(),

  find: function find() {
    return this.find.apply(this, arguments);
  },

  findOne: function findOne() {
    return this.findOne.apply(this, arguments);
  },

  getTotal: function getTotal(params) {
    return this.count(params);
  },

  create: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
      var Model, record, fieldErrors, field;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              Model = this;
              record = new Model(data);
              _context2.prev = 2;
              _context2.next = 5;
              return record.save();

            case 5:
              return _context2.abrupt('return', _context2.sent);

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2['catch'](2);

              if (_context2.t0) {
                if (_context2.t0.name === 'ValidationError') {
                  fieldErrors = [];

                  for (field in _context2.t0.errors) {
                    fieldErrors.push({
                      field: field,
                      message: _context2.t0.errors[field].message
                    });
                  }

                  _context2.t0.errors = fieldErrors;
                } else {
                  _context2.t0.errors = _context2.t0;
                }
              }

              throw _context2.t0;

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[2, 8]]);
    }));

    function create(_x6) {
      return _ref2.apply(this, arguments);
    }

    return create;
  }(),

  update: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data) {
      var Model, response, id, fields, _shortid, _fields, fieldErrors, field;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              Model = this;
              _context3.prev = 1;
              response = void 0;

              if (!data.id) {
                _context3.next = 10;
                break;
              }

              id = data.id, fields = (0, _objectWithoutProperties3.default)(data, ['id']);
              _context3.next = 7;
              return Model.update({ _id: id }, fields);

            case 7:
              response = _context3.sent;
              _context3.next = 14;
              break;

            case 10:
              _shortid = data.shortid, _fields = (0, _objectWithoutProperties3.default)(data, ['shortid']);
              _context3.next = 13;
              return Model.update({ shortid: _shortid }, _fields);

            case 13:
              response = _context3.sent;

            case 14:
              if (response.n) {
                _context3.next = 16;
                break;
              }

              throw new NoRecordUpdatedException('No records were modified.');

            case 16:
              _context3.next = 22;
              break;

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3['catch'](1);

              if (_context3.t0) {
                if (_context3.t0.name === 'ValidationError') {
                  fieldErrors = [];

                  for (field in _context3.t0.errors) {
                    fieldErrors.push({
                      field: field,
                      message: _context3.t0.errors[field].message
                    });
                  }

                  _context3.t0.errors = fieldErrors;
                } else {
                  _context3.t0.errors = _context3.t0;
                }
                if (_context3.t0 instanceof NoRecordUpdatedException) {
                  _context3.t0.errors = {
                    _error: _context3.t0.message
                  };
                }
              }

              throw _context3.t0;

            case 22:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[1, 18]]);
    }));

    function update(_x7) {
      return _ref3.apply(this, arguments);
    }

    return update;
  }()
};

var isNotFunc = function isNotFunc(v) {
  return _ramda2.default.not(typeof v === 'function');
};

var createSchema = function createSchema(attrs) {
  return new _mongoose2.default.Schema(attrs);
};

var combineVirtualFunctions = function combineVirtualFunctions(funcs, schema) {
  if (!funcs || !funcs.length) return schema;
  _ramda2.default.compose(_ramda2.default.map(function (d) {
    return schema.methods[d[0]] = d[1];
  }), _ramda2.default.filter(function (a) {
    return !_ramda2.default.contains(a[0], instanceMethods);
  }))(funcs);
  //TODO Handle instance methods
  return schema;
};

var schemafyIfNested = function schemafyIfNested(obj) {
  if (obj.Object) {
    _ramda2.default.map(function (x) {
      return _ramda2.default.ifElse(_ramda2.default.compose(_ramda2.default.has('attributes'), _ramda2.default.last), function (y) {
        y[1] = schemafy(y[1]);
        return y;
      }, _ramda2.default.identity)(x);
    })(obj.Object);
  }

  if (obj.Array) {
    _ramda2.default.map(function (x) {
      if (x[1].length !== 1) throw new Error('Nested array schema should have only one child.');

      if (!isNativeType(x[1][0]) && !_ramda2.default.has('ref', x[1][0])) {
        x[1] = [schemafy(x[1][0])];
      }
    })(obj.Array);

    obj.Object = _ramda2.default.concat(obj.Object ? obj.Object : [], obj.Array);
  }

  return obj;
};

var schemafy = function schemafy(schema) {
  return _ramda2.default.compose(_ramda2.default.converge(combineVirtualFunctions, [_ramda2.default.view(_ramda2.default.lensProp('Function')), _ramda2.default.compose(createSchema, _ramda2.default.fromPairs, _ramda2.default.view(_ramda2.default.lensProp('Object')))]), schemafyIfNested, _ramda2.default.groupBy(_ramda2.default.compose(_ramda2.default.type, _ramda2.default.last)), _ramda2.default.toPairs, alterCollectionRef)(schema.attributes);
};

var alterCollectionRef = _ramda2.default.ifElse(_ramda2.default.both(isNotFunc, _ramda2.default.either(_ramda2.default.is(Array), _ramda2.default.is(Object))), _ramda2.default.pipe(_ramda2.default.map(_ramda2.default.ifElse(_ramda2.default.allPass([isNotFunc, _ramda2.default.is(Object), _ramda2.default.has('ref')]), _ramda2.default.set(_ramda2.default.lensProp('type'), _mongoose2.default.Schema.Types.ObjectId), _ramda2.default.identity), _ramda2.default.identity), _ramda2.default.map(function (a) {
  return alterCollectionRef(a);
})), _ramda2.default.identity);

exports.default = function (name, _schemaMap, options) {
  var mongoose = options.mongoose;


  var schemaMap = (0, _cloneDeep3.default)(_schemaMap);

  if (!name) throw new Error('No name of the model was provided');

  var opts = _ramda2.default.merge(defaultConf, options);
  if (opts.createdAt) schemaMap.attributes['createdAt'] = { type: Date, default: Date.now };
  if (opts.updatedAt) schemaMap.attributes['updatedAt'] = { type: Date, default: Date.now };
  if (opts.shortId) schemaMap.attributes['shortid'] = { type: String, default: _shortid3.default.generate, unique: true };

  var modelSchema = schemafy(schemaMap);
  if (schemaMap.beforeSave) modelSchema.pre('save', schemaMap.beforeSave);

  var Model = {
    name: name
  };

  Model._model = mongoose.model(name, modelSchema);

  _ramda2.default.pipe(_ramda2.default.toPairs, _ramda2.default.filter(function (a) {
    return a[1] instanceof Function && !_ramda2.default.contains(a[0], callbackMethods);
  }))(schemaMap).map(function (method) {
    return Model[method[0]] = method[1].bind(Model._model);
  });

  _ramda2.default.toPairs(globalMethods).forEach(function (method) {
    return Model[method[0]] = method[1].bind(Model._model);
  });
  return Model;
};