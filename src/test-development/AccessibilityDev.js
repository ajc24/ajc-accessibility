import { axe } from 'jest-axe';
import pa11y from 'pa11y';
import html from 'pa11y-reporter-html';
import fs from 'fs';

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
const buildTestDirectoryStructure = () => {
/* Ensure the temp directory exists */
 const tempExists = fs.existsSync(tempDirectoryPath);
 if (!tempExists) {
   fs.mkdirSync(tempDirectoryPath);
 }
 /* Ensure the reports directory exists */
 const reportsExists = fs.existsSync(reportsDirectoryPath);
 if (!reportsExists) {
   fs.mkdirSync(reportsDirectoryPath);
 }
}

export default class AccessibilityDev {
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
    const results = await axe(componentHtml);
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
    fs.writeFileSync(tempHTMLFilePath, componentHtml);
    
    /* Execute the accessibility test on the HTML file and process the results */
    const results = await pa11y(tempHTMLFilePath);
    const reportsFilePath = `${reportsDirectoryPath}/${testTitle}-pa11y-report.html`;
    const htmlFilePath = `${reportsDirectoryPath}/${testTitle}-pa11y-dom.html`;
    let testPassed = true;
    if (results.issues.length > 0) {
      /* Write the failing test report and copy the HTML state to the reports folder */
      const resultsAsHtml = await html.results(results);
      fs.writeFileSync(reportsFilePath, resultsAsHtml);
      fs.copyFileSync(tempHTMLFilePath, htmlFilePath);
      testPassed = false;
    } else {
      /* Remove the old failing test report and HTML file if they exist */
      const previousReportsFileExists = fs.existsSync(reportsFilePath);
      if (previousReportsFileExists) {
        fs.unlinkSync(reportsFilePath);
        fs.unlinkSync(htmlFilePath);
      }
    }
    /* Clean up any temporary files left over and return the test result */
    fs.unlinkSync(tempHTMLFilePath);
    return testPassed;
  }
}
