"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jestAxe = require("jest-axe");

/* Test data */
const maximumTestTimeout = 60000;

class AccessibilityDev {
  /**
   * Returns the maximum timeout in milliseconds for accessibility test suites
   * @returns {number}
   */
  static getMaximumTimeout() {
    return maximumTestTimeout;
  }
  /**
   * Executes the specified HTML against jest-axe and checks that HTML
   * template for accessibility related issues
   * @param {string} componentHtml
   * @returns {}
   */


  static async runJestAxe(componentHtml) {
    const results = await (0, _jestAxe.axe)(componentHtml);
    return results;
  }

}

exports.default = AccessibilityDev;