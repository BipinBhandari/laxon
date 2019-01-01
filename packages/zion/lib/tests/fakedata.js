'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInstitution = undefined;

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chance = new _chance2.default();

var getInstitution = exports.getInstitution = function getInstitution() {
  return {
    name: chance.name(),
    address: chance.address(),
    phoneNumber: chance.phone(),
    facultyName: 'Faculty One',
    yearName: 'Year',
    groupName: 'Group',
    type: 'preschool'
  };
};