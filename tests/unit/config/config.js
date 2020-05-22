import { configureAccessibilityTests } from '../../../src';

describe('Accessibility Configuration Files', () => {
  
  describe('configureAccessibilityTests() method behaviour - Default root directory', () => {
    let jestConfig;

    beforeAll(() => {
      jestConfig = configureAccessibilityTests();
    });

    it('verifies that the root directory location property is set correctly', () => {
      expect(jestConfig.rootDir).toBe('../../');
    });

    it('verifies that the max concurrency property is correctly set for sequential test execution', () => {
      expect(jestConfig.maxConcurrency).toBe(1);
    });

    it('verifies that the list of setup files after environment property is defined', () => {
      expect(jestConfig.setupFilesAfterEnv).toBeDefined();
    });

    it('verifies that the list of setup files after environment property is initialised with multiple file locations', () => {
      expect(jestConfig.setupFilesAfterEnv.length).toBe(2);
    });

    it('verifies that the setup files after environment file location property includes the path to the enzyme configuration', () => {
      expect(jestConfig.setupFilesAfterEnv[0]).toBe('<rootDir>/tests/jest-config/enzyme.config.js');
    });

    it('verifies that the setup files after environment file location property includes the path to the document configuration', () => {
      expect(jestConfig.setupFilesAfterEnv[1]).toBe('<rootDir>/tests/jest-config/document.config.js');
    });

    it('verifies that the test match property is defined', () => {
      expect(jestConfig.testMatch).toBeDefined();
    });

    it('verifies that the test match property is initialised with a single file location', () => {
      expect(jestConfig.testMatch.length).toBe(1);
    });

    it('verifies that the test match file location property is set correctly', () => {
      expect(jestConfig.testMatch[0]).toBe('<rootDir>/tests/accessibility/**/*.js');
    });
  });

  describe('configureAccessibilityTests() method behaviour - Custom root directory specified', () => {
    let jestConfig;

    beforeAll(() => {
      jestConfig = configureAccessibilityTests('my/project/root/directory');
    });

    it('verifies that the root directory location property is set correctly', () => {
      expect(jestConfig.rootDir).toBe('my/project/root/directory');
    });
  });
});
