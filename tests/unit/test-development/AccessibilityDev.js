import 'jsdom-global/register';
import React from 'react';
import { toHaveNoViolations } from 'jest-axe';
import { TestDev } from 'ajc-jest-enzyme';
import { AccessibilityDev } from '../../../src';

describe('Accessibility Development - Default Values', () => {
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
        <label htmlFor="firstname">First name:</label>
        <input type="text" name="lastname" id="lastname" />
      </div>
    );
  };

  describe('getMaximumTimeout() method behaviour', () => {
    let maximumTimeout;

    beforeAll(() => {
      maximumTimeout = AccessibilityDev.getMaximumTimeout();
    });

    it('verifies that the maximum timeout is of the number data type', () => {
      expect(typeof maximumTimeout).toBe('number');
    });

    it('verifies that the maximum timeout is correctly set as a positive integer', () => {
      expect(maximumTimeout).toBe(60000);
    });
  });

  describe('runJestAxe() method behaviour - Passing component test', () => {
    let results;

    beforeAll(async () => {
      const componentHtml = TestDev.mountHtmlTemplate(<PassingComponent />, 'Passing Component');
      results = await AccessibilityDev.runJestAxe(componentHtml);
    }, testTimeout);

    it('verifies that the component passes the accessibility test', () => {
      expect(results).toHaveNoViolations();
    });
  });

  describe('runJestAxe() method behaviour - Failing component test', () => {
    let results;

    beforeAll(async () => {
      const componentHtml = TestDev.mountHtmlTemplate(<FailingComponent />, 'Failing Component');
      results = await AccessibilityDev.runJestAxe(componentHtml);
    }, testTimeout);

    it('verifies that the component fails the accessibility test', () => {
      expect(results.violations.length).toBeGreaterThan(0);
    });
  });
});
