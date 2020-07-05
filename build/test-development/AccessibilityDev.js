"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jestAxe = require("jest-axe");

var _pa11y = _interopRequireDefault(require("pa11y"));

var _pa11yReporterHtml = _interopRequireDefault(require("pa11y-reporter-html"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Individual test folder names */
const accessibilityDirName = 'accessibility';
const reportsDirName = 'reports';
const tempDirName = 'temp';
const testsDirName = 'tests';
/* Test data */

const maximumTestTimeout = 45000;
/* Test folder paths */

const tempDirectoryPath = `./${testsDirName}/${accessibilityDirName}/${tempDirName}`;
const reportsDirectoryPath = `./${testsDirName}/${accessibilityDirName}/${reportsDirName}`;
/**
* Build the relevant folders for the reports and temp files
* to be written to during the test process
*/

const buildTestDirectoryStructure = function () {
  /* Ensure the temp directory exists */
  const tempExists = _fs.default.existsSync(tempDirectoryPath);

  if (!tempExists) {
    _fs.default.mkdirSync(tempDirectoryPath);
  }
  /* Ensure the reports directory exists */


  const reportsExists = _fs.default.existsSync(reportsDirectoryPath);

  if (!reportsExists) {
    _fs.default.mkdirSync(reportsDirectoryPath);
  }
};

class AccessibilityDev {
  /**
   * Returns the maximum timeout in milliseconds for accessibility test suites
   * @returns {number}
   */
  static getMaximumTimeout() {
    return maximumTestTimeout;
  }
  /**
   * Returns the directory path for the reports directory
   * @returns {string}
   */


  static getReportsDirectoryPath() {
    return reportsDirectoryPath;
  }
  /**
   * Returns the directory path for the temp directory
   * @returns {string}
   */


  static getTempDirectoryPath() {
    return tempDirectoryPath;
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
   * Executes the specified HTML against pa11y and checks that HTML
   * template for accessibility related issues
   * @param {string} componentHtml
   * @param {string} testTitle
   * @returns {boolean}
   */


  static async runPa11y(componentHtml, testTitle) {
    /* Build the expected test directory structure if it does not already exist */
    buildTestDirectoryStructure();
    /* Write the component HTML to a temporary file */

    const tempHTMLFilePath = `${tempDirectoryPath}/${testTitle}.html`;

    _fs.default.writeFileSync(tempHTMLFilePath, componentHtml);
    /* Execute the accessibility test on the HTML file and process the results */


    const results = await (0, _pa11y.default)(tempHTMLFilePath);
    const reportsFilePath = `${reportsDirectoryPath}/${testTitle}-pa11y-report.html`;
    const htmlFilePath = `${reportsDirectoryPath}/${testTitle}-pa11y-dom.html`;
    let testPassed = true;

    if (results.issues.length > 0) {
      /* Write the failing test report and copy the HTML state to the reports folder */
      const resultsAsHtml = await _pa11yReporterHtml.default.results(results);

      _fs.default.writeFileSync(reportsFilePath, resultsAsHtml);

      _fs.default.copyFileSync(tempHTMLFilePath, htmlFilePath);

      testPassed = false;
    } else {
      /* Remove the old failing test report and HTML file if they exist */
      const previousReportsFileExists = _fs.default.existsSync(reportsFilePath);

      if (previousReportsFileExists) {
        _fs.default.unlinkSync(reportsFilePath);

        _fs.default.unlinkSync(htmlFilePath);
      }
    }
    /* Clean up any temporary files left over and return the test result */


    _fs.default.unlinkSync(tempHTMLFilePath);

    return testPassed;
  }

}

exports.default = AccessibilityDev;