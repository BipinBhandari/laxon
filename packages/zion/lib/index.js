'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lensProp = require('ramda/src/lensProp');

var _lensProp2 = _interopRequireDefault(_lensProp);

var _set = require('ramda/src/set');

var _set2 = _interopRequireDefault(_set);

var _model2 = require('./model');

var _model3 = _interopRequireDefault(_model2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Zion = function () {
    function Zion(mongoose) {
        (0, _classCallCheck3.default)(this, Zion);

        this.mongoose = mongoose;
    }

    (0, _createClass3.default)(Zion, [{
        key: 'model',
        value: function model(name, schemaMap) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            options.mongoose = this.mongoose;
            return (0, _model3.default)(name, schemaMap, options);
        }
    }]);
    return Zion;
}();

exports.default = Zion;