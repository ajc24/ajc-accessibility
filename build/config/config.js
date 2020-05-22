"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ajcJestEnzyme = require("ajc-jest-enzyme");

/**
 * Sets the configuration for jest accessibility tests
 * @param {string} rootDirectory
 * @returns {JSON}
 */
const configureAccessibilityTests = function (rootDirectory) {
  const jestConfig = (0, _ajcJestEnzyme.configureSnapshotTests)(rootDirectory);
  /* Ensure that all tests are run sequentially as opposed to in parallel */

  jestConfig.maxConcurrency = 1;
  /* Set the path to the document configuration required for jest-axe tests */

  jestConfig.setupFilesAfterEnv.push('<rootDir>/tests/jest-config/document.config.js');
  /* Set the path to the tests to be executed as part of the snapshots test suite */

  jestConfig.testMatch = [];
  jestConfig.testMatch.push('<rootDir>/tests/accessibility/**/*.js');
  return jestConfig;
};

var _default = configureAccessibilityTests;
exports.default = _default;