import { axe } from 'jest-axe';

/* Test data */
const maximumTestTimeout = 60000;

export default class AccessibilityDev {
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
    const results = await axe(componentHtml);
    return results;
  }
}
