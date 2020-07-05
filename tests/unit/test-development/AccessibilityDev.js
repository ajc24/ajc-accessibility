import React from 'react';
import { toHaveNoViolations } from 'jest-axe';
import fs from 'fs';
import { TestDev } from 'ajc-jest-enzyme';
import { AccessibilityDev } from '../../../src';

describe('Accessibility Development', () => {
  const reportsDirectoryPath = AccessibilityDev.getReportsDirectoryPath();
  const tempDirectoryPath = AccessibilityDev.getTempDirectoryPath();
  const testTimeout = AccessibilityDev.getMaximumTimeout();

  /* Extend the expect behaviour of jest */
  expect.extend(toHaveNoViolations);

  /* Create the passing component required for the tests */
  const PassingComponent = () => {
    return (
      <div role="main">
        <p>Hello World</p>
      </div>
    );
  };
  /* Create the failing component required for the test */
  const FailingComponent = () => {
    return (
      <div>
        <div id="id-name">Name</div>
        <input type="text" aria-labelledby="id-random"/>
      </div>
    );
  };

  afterAll(() => {
    /* Remove all folders created during the test */
    fs.rmdirSync(reportsDirectoryPath);
    fs.rmdirSync(tempDirectoryPath);
  });

  describe('getMaximumTimeout() method behaviour', () => {
    let maximumTimeout;

    beforeAll(() => {
      maximumTimeout = AccessibilityDev.getMaximumTimeout();
    });

    it('verifies that the maximum timeout is of the number data type', () => {
      expect(typeof maximumTimeout).toBe('number');
    });

    it('verifies that the maximum timeout is correctly set as a positive integer', () => {
      expect(maximumTimeout).toBe(45000);
    });
  });

  describe('getReportsDirectoryPath() method behaviour', () => {
    let reportsDirectoryTest;

    beforeAll(() => {
      reportsDirectoryTest = AccessibilityDev.getReportsDirectoryPath();
    });

    it('verifies that the reports directory path is of the string data type', () => {
      expect(typeof reportsDirectoryTest).toBe('string');
    });

    it('verifies that the reports directory path correctly points to the reports directory', () => {
      expect(reportsDirectoryTest).toBe('./tests/accessibility/reports');
    });
  });

  describe('getTempDirectoryPath() method behaviour', () => {
    let tempDirectoryTest;

    beforeAll(() => {
      tempDirectoryTest = AccessibilityDev.getTempDirectoryPath();
    });

    it('verifies that the temp directory path is of the string data type', () => {
      expect(typeof tempDirectoryTest).toBe('string');
    });

    it('verifies that the temp directory path correctly points to the temp directory', () => {
      expect(tempDirectoryTest).toBe('./tests/accessibility/temp');
    });
  });

  describe('runJestAxe() method behaviour - Passing component test', () => {
    let results;

    beforeAll(async () => {
      const componentHtml = TestDev.mountHtmlTemplate(<PassingComponent />, 'PassingComponent');
      results = await AccessibilityDev.runJestAxe(componentHtml);
    }, testTimeout);

    it('verifies that the component passes the accessibility test', () => {
      expect(results).toHaveNoViolations();
    });
  });

  describe('runJestAxe() method behaviour - Failing component test', () => {
    let results;

    beforeAll(async () => {
      const componentHtml = TestDev.mountHtmlTemplate(<FailingComponent />, 'FailingComponent');
      results = await AccessibilityDev.runJestAxe(componentHtml);
    }, testTimeout);

    it('verifies that the component fails the accessibility test', () => {
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });

  describe('runPa11y() method behaviour - Passing component test', () => {
    let componentTitle;
    let results;

    beforeAll(async () => {
      componentTitle = 'PassingComponent';
      const componentHtml = TestDev.mountHtmlTemplate(<PassingComponent />, componentTitle);
      results = await AccessibilityDev.runPa11y(componentHtml, componentTitle);
    }, testTimeout);

    it('verifies that the component passes the accessibility test', () => {
      expect(results).toBeTruthy();
    });

    it('verifies that the temporary HTML file is removed from the temp directory', () => {
      const filesList = fs.readdirSync(tempDirectoryPath);
      expect(filesList).toHaveLength(0);
    });
  
    it('verifies that the HTML template is not written to the reports folder', () => {
      const htmlExists = fs.existsSync(`${reportsDirectoryPath}/${componentTitle}-pa11y-dom.html`);
      expect(htmlExists).toBeFalsy();
    });

    it('verifies that the accessibility report is not written to the reports folder', () => {
      const reportExists = fs.existsSync(`${reportsDirectoryPath}/${componentTitle}-pa11y-report.html`);
      expect(reportExists).toBeFalsy();
    });
  });

  describe('runPa11y() method behaviour - Failing component test', () => {
    let componentTitle;
    let results;

    beforeAll(async () => {
      componentTitle = 'FailingComponent';
      const componentHtml = TestDev.mountHtmlTemplate(<FailingComponent />, componentTitle);
      results = await AccessibilityDev.runPa11y(componentHtml, componentTitle);
    }, testTimeout);
  
    it('verifies that the component fails the accessibility test', () => {
      expect(results).toBeFalsy();
    });

    it('verifies that the temporary HTML file is removed from the temp directory', () => {
      const filesList = fs.readdirSync(tempDirectoryPath);
      expect(filesList).toHaveLength(0);
    });

    it('verifies that the HTML template is written to the reports folder', () => {
      const htmlExists = fs.existsSync(`${reportsDirectoryPath}/${componentTitle}-pa11y-dom.html`);
      expect(htmlExists).toBeTruthy();
    });

    it('verifies that the accessibility report is written to the reports folder', () => {
      const reportExists = fs.existsSync(`${reportsDirectoryPath}/${componentTitle}-pa11y-report.html`);
      expect(reportExists).toBeTruthy();
    });
  });

  describe('runPa11y() method behaviour - Fixed previously failing component test', () => {
    let componentTitle;
    let results;

    /* Create the fixed component required for the test */
    const FixedComponent = () => {
      return (
        <div>
          <div id="id-name">Name</div>
          <input type="text" aria-labelledby="id-name"/>
        </div>
      );
    };
    beforeAll(async () => {
      componentTitle = 'FailingComponent';
      const componentHtml = TestDev.mountHtmlTemplate(<FixedComponent />, componentTitle);
      results = await AccessibilityDev.runPa11y(componentHtml, componentTitle);
    }, testTimeout);
  
    it('verifies that the fixed component passes the accessibility test', () => {
      expect(results).toBeTruthy();
    });

    it('verifies that the temporary HTML file is removed from the temp directory', () => {
      const filesList = fs.readdirSync(tempDirectoryPath);
      expect(filesList).toHaveLength(0);
    });

    it('verifies that the HTML template is removed from the reports folder', () => {
      const htmlExists = fs.existsSync(`${reportsDirectoryPath}/${componentTitle}-pa11y-dom.html`);
      expect(htmlExists).toBeFalsy();
    });

    it('verifies that the accessibility report is removed from the reports folder', () => {
      const reportExists = fs.existsSync(`${reportsDirectoryPath}/${componentTitle}-pa11y-report.html`);
      expect(reportExists).toBeFalsy();
    });
  });
});
