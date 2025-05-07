# Playwright Bingo

A powerful Playwright framework with self-healing capabilities and page object model support.

## Installation

```bash
npm install playwright-bingo
```

## Project Setup

After installation, initialize your project:

```bash
npx playwright-bingo init
```

This will create the following structure:
```
├── features/              # Cucumber feature files
├── pages/                 # Page Object Model
│   ├── actions/          # Page actions
│   └── locators/         # Page locators
├── step-definitions/     # Cucumber step definitions
├── support/              # Support files
└── tests/               # Test files
```

## Usage

### Creating a New Page

```bash
bingo add page "login"
```

This will create:
- `pages/actions/login.actions.js`
- `pages/locators/login.locators.js`
- `step-definitions/login.steps.js`

### Updating a Page Name

```bash
bingo update page "login" "auth"
```

### Deleting a Page

```bash
bingo delete page "login"
```

## Running Tests

```bash
# Run tests
npm test

# Run tests with Allure report
npm run test:allure

# Open Allure report
npm run test:allure:open
```

## Features

- Self-healing locators with configurable retry mechanisms
- Page Object Model support
- Cucumber BDD integration
- Allure reporting
- CLI tools for managing pages and actions
- Cross-browser support (Chromium, Firefox, WebKit)

## Self-Healing Locators

The framework provides self-healing capabilities through the `BingoPage` class. You can use multiple locators for the same element, and the framework will try each one until it finds the element.

### Configuration

Create a `bingo.config.js` file in your project root:

```javascript
module.exports = {
    selfHealing: {
        maxTimeout: 30000,    // Maximum time to wait for element (ms)
        retryInterval: 1000,  // Time between retries (ms)
        maxRetries: 3         // Maximum number of retry attempts
    }
};
```

### Usage

```javascript
const { BingoFactory } = require('playwright-bingo');

async function example() {
    // Create a new page
    const page = await BingoFactory.createPage('chromium');

    // Navigate to a page
    await page.goto('https://example.com');

    // Use multiple locators for the same element
    await page.click([
        '#submit-button',
        'button[type="submit"]',
        '//button[contains(text(), "Submit")]'
    ]);

    // Fill a form field with multiple possible locators
    await page.fill([
        '#username',
        'input[name="username"]',
        '//input[@placeholder="Enter username"]'
    ], 'testuser');

    // Check if an element is visible using multiple locators
    const isVisible = await page.isVisible([
        '.success-message',
        '#success',
        '//div[contains(@class, "success")]'
    ]);
}
```

## Page Object Model

The framework includes CLI tools to help you manage your page objects:

```bash
# Create a new page
npx bingo create-page login

# Create a new action
npx bingo create-action login submit

# Create a new locator
npx bingo create-locator login submit-button
```

## API Reference

### BingoFactory

- `createPage(browserType = 'chromium', options = {})`: Creates a new page instance
- `createPages(browserType = 'chromium', count = 1, options = {})`: Creates multiple page instances

### BingoPage

The `BingoPage` class extends Playwright's `Page` class with self-healing capabilities. All methods that accept a locator can now accept an array of locators:

- `click(locatorArray, options)`
- `fill(locatorArray, value, options)`
- `type(locatorArray, text, options)`
- `selectOption(locatorArray, values, options)`
- `check(locatorArray, options)`
- `uncheck(locatorArray, options)`
- `getAttribute(locatorArray, name, options)`
- `textContent(locatorArray, options)`
- `innerText(locatorArray, options)`
- `isVisible(locatorArray, options)`
- `isEnabled(locatorArray, options)`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 