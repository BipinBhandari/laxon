'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lensProp = require('ramda/src/lensProp');

var _lensProp2 = _interopRequireDefault(_lensProp);

var _set = require('ramda/src/set');

var _set2 = _interopRequireDefault(_set);

var _db = require('../../modules/db');

var _db2 = _interopRequireDefault(_db);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (name, schemaMap) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _model2.default)(name, schemaMap, (0, _set2.default)((0, _lensProp2.default)('mongoose'), _db2.default)(options));
};