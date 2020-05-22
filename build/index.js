"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AccessibilityDev", {
  enumerable: true,
  get: function () {
    return _AccessibilityDev.default;
  }
});
Object.defineProperty(exports, "configureAccessibilityTests", {
  enumerable: true,
  get: function () {
    return _config.default;
  }
});

var _AccessibilityDev = _interopRequireDefault(require("./test-development/AccessibilityDev"));

var _config = _interopRequireDefault(require("./config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }