const { configureUnitTests } = require('ajc-jest-enzyme');

const jestConfig = configureUnitTests();
jestConfig.setupFilesAfterEnv.push('<rootDir>/tests/jest-config/document.config.js');
jestConfig.coveragePathIgnorePatterns.push('<rootDir>/src/index.js');
jestConfig.maxConcurrency = 1;

module.exports = jestConfig;
