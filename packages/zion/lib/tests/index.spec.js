'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mongoConnectionString = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _mochaSteps = require('mocha-steps');

var _fakedata = require('./fakedata');

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

var mongoConnection = function mongoConnection(mongoConnectionString) {
  return new _promise2.default(function (resolve, reject) {
    _mongoose2.default.connect(mongoConnectionString, function (err) {
      if (err) reject(err);else resolve('DB connected!');
    });
  });
};

var mongoConnectionString = exports.mongoConnectionString = 'mongodb://localhost:27017/laxonTestDB';

var zion = void 0;
describe('Testing instantiate function', function () {
  var db = void 0;
  var TestModel = void 0;
  var TestUser = void 0;
  var TestComment = void 0;
  var zion = void 0;

  before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return mongoConnection(mongoConnectionString);

          case 2:
            res = _context.sent;

            console.log(res);

            zion = new _2.default(_mongoose2.default);
            TestUser = zion.model('TestUser', {
              attributes: {
                name: {
                  type: String,
                  required: true
                }
              }
            });

            TestComment = zion.model('TestMoment', {
              attributes: {
                description: {
                  type: String,
                  required: true
                },
                resources: [{ ref: 'TestUser' }]
              }
            });

            TestModel = zion.model('TestModal', {
              attributes: {
                name: {
                  type: String,
                  required: true
                }
              },
              beforeSave: function beforeSave(next) {
                var user = this;
                user.name = 'Blab';
                next();
              }
            });

            TestComment = zion.model('TestComment', {
              attributes: {
                name: {
                  type: String,
                  required: true
                },
                commentedBy: {
                  ref: 'TestUser'
                }
              }
            });

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  (0, _mochaSteps.step)('check if beforeSave is working', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var name, modelInstance;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            name = 'blab';
            _context2.next = 3;
            return TestModel.create({ name: name });

          case 3:
            modelInstance = _context2.sent;

            expect(modelInstance.name).not.to.equal(name);
            expect(modelInstance.name).to.equal('Blab');

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  (0, _mochaSteps.step)('check if updatedAt and createAt are added', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var name, modelInstance;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            name = 'blab';
            _context3.next = 3;
            return TestModel.create({ name: name });

          case 3:
            modelInstance = _context3.sent;

            expect(modelInstance.createdAt).to.exist;
            expect(modelInstance.updatedAt).to.exist;

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  (0, _mochaSteps.step)('check if object ref is working', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var user, userInstance, commentInstance, foundCommentInstance;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user = { name: 'Bipin Bhandari' };
            _context4.next = 3;
            return TestUser.create(user);

          case 3:
            userInstance = _context4.sent;
            _context4.next = 6;
            return TestComment.create({
              name: 'Comment 1',
              commentedBy: userInstance._id
            });

          case 6:
            commentInstance = _context4.sent;
            _context4.next = 9;
            return TestComment.findOne({ _id: commentInstance._id }).populate('commentedBy');

          case 9:
            foundCommentInstance = _context4.sent;

            expect(foundCommentInstance.commentedBy).to.exist;
            expect(String(foundCommentInstance.commentedBy._id)).to.equal(String(userInstance._id));

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  (0, _mochaSteps.step)('check if embedded schema works', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var Toodler, toodler;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            Toodler = zion.model('Toodler', {
              attributes: {
                name: {
                  type: String,
                  required: true
                },
                children: [{
                  attributes: {
                    name: {
                      type: String,
                      required: true
                    }
                  }
                }],
                contacts: {
                  attributes: {
                    officeNumber: {
                      type: String
                    },
                    homeNumber: {
                      type: String
                    },
                    mobileNumber: {
                      type: String
                    }
                  }
                }
              }
            });
            _context5.next = 3;
            return Toodler.create({
              name: 'Toodler 2',
              children: [{ name: 'Child 3' }, { name: 'Child 4' }],
              contacts: {
                officeNumber: '5202456',
                homeNumber: '5202456',
                mobileNumber: '984544344'
              }
            });

          case 3:
            toodler = _context5.sent;


            expect(toodler.children).to.exist;
            expect(toodler.contacts).to.exist;

            expect(toodler.children).to.have.lengthOf(2);
            expect(toodler.contacts.officeNumber).to.equal('5202456');
            expect(toodler.contacts.homeNumber).to.equal('5202456');
            expect(toodler.contacts.mobileNumber).to.equal('984544344');

            expect(toodler.children.find(function (child) {
              return child.name === 'Child 3';
            })).to.exist;
            expect(toodler.children.find(function (child) {
              return child.name === 'Child 4';
            })).to.exist;

          case 12:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  (0, _mochaSteps.step)('check if triple nested schema works', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var TUser, tuser, tuser2, updatedTuser, updatedTuser3;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            TUser = zion.model('TUserB', {
              attributes: {
                name: {
                  type: String,
                  required: true
                },
                preferences: {
                  attributes: {
                    devicePreferences: {
                      attributes: {
                        devices: [{
                          attributes: {
                            name: {
                              type: String,
                              required: true
                            }
                          }
                        }]
                      }
                    }
                  }
                }
              }
            });
            _context6.next = 3;
            return TUser.create({
              name: 'Yellow Bomb',
              preferences: {
                devicePreferences: {
                  devices: [{ name: 'Nexus One' }]
                }
              }
            });

          case 3:
            tuser = _context6.sent;


            expect(tuser.name).to.exist;
            expect(tuser.preferences).to.exist;
            expect(tuser.preferences.devicePreferences).to.exist;
            expect(tuser.preferences.devicePreferences.devices.length).to.equal(1);
            expect(tuser.preferences.devicePreferences.devices[0].name).to.equal('Nexus One');

            _context6.next = 11;
            return TUser.create({
              name: 'Yellow Bomb'
            });

          case 11:
            tuser2 = _context6.sent;


            tuser2.preferences = {
              devicePreferences: {
                devices: [{ name: 'Nexus One Bablulasdas' }]
              }
            };

            _context6.next = 15;
            return tuser2.save();

          case 15:
            _context6.next = 17;
            return TUser.findOne({ _id: tuser2._id });

          case 17:
            updatedTuser = _context6.sent;


            updatedTuser.preferences.devicePreferences.devices.push({
              name: 'iPhone Yellow'
            });

            _context6.next = 21;
            return updatedTuser.save();

          case 21:
            _context6.next = 23;
            return TUser.findOne({ _id: tuser2._id });

          case 23:
            updatedTuser3 = _context6.sent;

            expect(updatedTuser3.preferences.devicePreferences.devices.length).to.equal(2);

          case 25:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});