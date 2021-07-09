# ajc-accessibility

Work in progress (06/07/2021)

An easy to import and use accessibility testing framework module designed for use with JavaScript and ReactJs projects.

Driven by the [`jest-axe`](https://github.com/nickcolley/jest-axe) module.

**Please note:** It is intended that you will use [`jest`](https://jestjs.io/docs/getting-started) in order to execute your accessibility test suite. This accessibility testing framework is designed to be compatible with the [`ajc-jest-enzyme`](https://github.com/ajc24/ajc-jest-enzyme) module. See the README documentation for that module for more information on how to install it and configure it with your project workspace.

# Installation

Add the following entry to the `dependencies` or `devDependencies` section of your projects `package.json` file:

```
"ajc-accessibility": "github:ajc24/ajc-accessibility"
```

---

# Add Accessibility Configuration Files

Create a `<rootDir>/tests/jest-config` folder in your project workspace.

## Add the `accessibility.config.js` file

Create a file called `accessibility.config.js` which is located at the path `<rootDir>/tests/jest-config/accessibility.config.js` in your project workspace.

Add the following content to that file:

```javascript
const { configureAccessibilityTests } = require('ajc-accessibility');

const jestConfig = configureAccessibilityTests();

module.exports = jestConfig;
```

### Default accessibility test path settings

Accessibility test paths are expected to match the following path:

```
<rootDir>/tests/accessibility/**/*.js
```

You can specify a custom accessibility test path by setting `jestConfig.testMatch = [ ... your file(s) ... ]` in the content of this file.

---

# The `AccessibilityDev` module

Use the included `AccessibilityDev` module to drive your accessibility tests. This module invokes APIs from [`jest-axe`](https://github.com/nickcolley/jest-axe) in order to check your components for accessibility violations.

## Import `AccessibilityDev` into your test files

Add the following import statements to the beginning of each of your test files:

```javascript
import { toHaveNoViolations } from 'jest-axe';
import { AccessibilityDev } from 'ajc-accessibility';
```

## Using `AccessibilityDev` with your test files

Use the following [`jest`](https://jestjs.io/docs/getting-started) test template in each of your test files in order to execute your accessibility tests using this module.

Each test suite requires you to `extend` from the [`jest.expect`](https://jestjs.io/docs/expect) to ensure the `toHaveNoViolations` functionality is available to you. You will also need to set a timeout for your tests, a value for which is provided to you with the module.

```javascript
describe('Component_Name', () => {
  /* Create the test data for the menu */
  const testTimeout = AccessibilityDev.getMaximumTimeout();

  /* Extend the expect behaviour of jest */
  expect.extend(toHaveNoViolations);

  describe('Describe your jest test suite here', () => {
    let jestAxeResults;

    beforeAll(async () => {
      const html = // ... render your component as HTML ...
      jestAxeResults = await AccessibilityDev.runJestAxe(html);
    }, testTimeout);

    it('verifies the jest-axe accessibility standards for the component', () => {
      expect(jestAxeResults).toHaveNoViolations();
    });
  });
});
```

## `AccessibilityDev` module functionality

The following functions and functionality are provided as part of the `AccessibilityDev` module:

- [`getMaximumTimeout()`](https://github.com/ajc24/ajc-accessibility#getmaximumtimeout)
- [`runJestAxe(componentHtml)`](https://github.com/ajc24/ajc-accessibility#runjestaxecomponenthtml)


### `getMaximumTimeout()`:

Returns the maximum timeout setting for accessibility tests. By default the value of this timeout is set to 60 seconds.

```javascript
const testTimeout = AccessibilityDev.getMaximumTimeout();
```

### `runJestAxe(componentHtml)`:

Executes the specified HTML through [`jest-axe`](https://github.com/nickcolley/jest-axe) and verifies that HTML for accessibility violations.

The `componentHtml` parameter is specified with a `string` value.

Returns the results from the accessibility checks including any violations found.

```javascript
const componentAsHtml = '<div><p>Hello World</p></div>';
const jestAxeResults = await AccessibilityDev.runJestAxe(componentAsHtml);
```

---
