'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _isEmpty2 = require('ramda/src/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sortParser = function sortParser(option) {
  if (!option || (0, _isEmpty3.default)(option)) {
    return {};
  }

  var p = option.split(' ');
  if (p.length !== 2) {
    return {};
  }
  return (0, _defineProperty3.default)({}, [p[0]], p[1] === 'ASC' ? 1 : -1);
};

exports.default = sortParser;