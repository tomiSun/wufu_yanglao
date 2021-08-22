"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryBrokenLine = queryBrokenLine;
exports.queryCake = queryCake;
exports.selectCountInfo = selectCountInfo;
exports.querySource = querySource;

var _request = _interopRequireDefault(require("@/utils/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function queryBrokenLine(params) {
  return regeneratorRuntime.async(function queryBrokenLine$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _request["default"])('/summary/queryBrokenLine', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

function queryCake(params) {
  return regeneratorRuntime.async(function queryCake$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", (0, _request["default"])('/summary/queryCake', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function selectCountInfo(params) {
  return regeneratorRuntime.async(function selectCountInfo$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", (0, _request["default"])('/summary/select', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function querySource(params) {
  return regeneratorRuntime.async(function querySource$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", (0, _request["default"])('/summary/querySource', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}