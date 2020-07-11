"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jestAxe = require("jest-axe");

var _pa11y = _interopRequireDefault(require("pa11y"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Individual test folder names */
const accessibilityDirName = 'accessibility';
const reportsDirName = 'reports';
const testsDirName = 'tests';
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
  /**
   * Executes the HTML at the specified URL / filename against pa11y
   * and checks that HTML template for accessibility related issues
   * @param {string} componentUrlOrFilename
   * @param {string} testTitle
   * @returns {boolean}
   */


  static async runPa11y(componentUrlOrFilename, testTitle) {
    /* Execute the accessibility test on the HTML file and process the results */
    const results = await (0, _pa11y.default)(componentUrlOrFilename);
    let testPassed = true;

    if (results.issues.length > 0) {
      let errorMessage = '\n--------------------------------------------------\n';
      errorMessage += ` Title of failing test  : ${results.documentTitle}\n`;
      errorMessage += ` URL / path to test file: ${results.pageUrl}\n`;
      errorMessage += ` Issues Found           : ${results.issues.length}\n`;
      results.issues.forEach(function (issue) {
        errorMessage += `\n Accessibility Code: ${issue.code}\n`;
        errorMessage += ` Type              : ${issue.type}\n`;
        errorMessage += ` Type code         : ${issue.typeCode}\n`;
        errorMessage += ` Failure message   : ${issue.message}\n`;
        errorMessage += ` Element affected  : ${issue.context}\n`;
        errorMessage += ` CSS selector      : ${issue.selector}\n`;
      });
      errorMessage += '--------------------------------------------------\n';
      console.log(errorMessage);
      testPassed = false;
    }

    return testPassed;
  }

}

exports.default = AccessibilityDev;