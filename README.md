# Playwright Bingo

A powerful testing framework built on top of Playwright and Cucumber, designed to make end-to-end testing more efficient and maintainable.

[![Documentation](https://img.shields.io/badge/Documentation-Playwright%20Bingo-blue)](https://playwright-bingo.netlify.app/)
[![npm version](https://img.shields.io/npm/v/playwright-bingo)](https://www.npmjs.com/package/playwright-bingo)

## 📚 Documentation

Visit our [official documentation site](https://playwright-bingo.netlify.app/) for comprehensive guides and resources.

### What's in the Documentation?

| Section | Description |
|---------|-------------|
| 🎯 **Getting Started** | Quick start guide and installation instructions |
| 📖 **Guides** | Detailed tutorials and how-to guides |
| 🔍 **API Reference** | Complete API documentation and examples |
| 💡 **Best Practices** | Recommended patterns and tips |
| 🚀 **Examples** | Real-world examples and use cases |

> 💡 **Pro Tip**: Bookmark the [documentation site](https://playwright-bingo.netlify.app/) for quick reference while working with Playwright Bingo.

## Features

- 🎯 **Page Object Model**: Organized structure for better test maintenance
- 🔄 **Cucumber Integration**: BDD-style test writing with Gherkin syntax
- 🎨 **Modern UI Testing**: Built on Playwright for reliable cross-browser testing
- 🔒 **Data Masking**: Built-in support for masking sensitive data
- 🛠️ **CLI Tools**: Easy project management and test creation
- 🔄 **Self-Healing Locators**: Automatic recovery from locator failures

## Installation

```bash
npm install playwright-bingo
```

## Project Structure

```
playwright-bingo/
├── features/              # Cucumber feature files
├── pages/                 # Page objects
│   ├── actions/          # Page actions
│   └── locators/         # Page locators
├── step-definitions/     # Cucumber step definitions
├── support/              # Support files
└── tests/                # Test files
```

## Data Masking

The framework includes a powerful data masking system to protect sensitive information in your tests.

### Setting Up

1. Create a `.env` file in your project root:
```env
BINGO_MASK_SALT=your-secret-salt
TEST_EMAIL=test@example.com
TEST_PASSWORD=your-password
```

2. Mask sensitive data using the CLI:
```bash
bingo mask test@example.com
```

3. Use the masked value in your `.env` file:
```env
TEST_EMAIL=BINGO_MASK_<hash>
```

### Using Masked Values

```javascript
const { env } = require('./lib/mask');

// Access environment variables (automatically decrypted)
console.log(env.TEST_EMAIL);  // Shows original value
```

### Automatic Masking

The system automatically detects and masks sensitive data types:
- Email addresses
- Credit card numbers
- Phone numbers
- Social security numbers
- API keys
- Passwords
- Database credentials
- JWT tokens

### Debugging

```javascript
const { debug } = require('./lib/mask');

// Show all masked values and their originals
debug();
```

## Self-Healing Locators

The framework includes a powerful self-healing mechanism that automatically recovers from locator failures by trying alternative locators.

### Setting Up Multiple Locators

```javascript
// pages/locators/todo.locators.js
class TodoLocators {
    constructor(page) {
        this.page = page;
        // Define multiple locators for the same element
        this.todoInput = [
            'input[placeholder="What needs to be done?"]',
            'input.new-todo',
            '[data-testid="todo-input"]'
        ];
    }
}
```

### Using Self-Healing in Actions

```javascript
// pages/actions/todo.actions.js
class TodoActions {
    constructor(bingoPage) {
        this.bingoPage = bingoPage;
        this.todo = new LocatorManager(bingoPage.page).todo;
    }

    async addTodoItem(todoText) {
        // The framework will try each locator until one works
        const input = await this.bingoPage.waitForElement(this.todo.todoInput);
        await input.fill(todoText);
        await input.press('Enter');
    }
}
```

### Configuration

Create a `bingo.config.js` file in your project root to customize self-healing behavior:

```javascript
module.exports = {
    selfHealing: {
        maxTimeout: 30000,    // Maximum time to wait for element (ms)
        retryInterval: 1000,  // Time between retries (ms)
        maxRetries: 3         // Maximum number of retry attempts
    }
};
```

### Best Practices for Self-Healing

1. **Locator Priority**
   - Order locators from most specific to least specific
   - Use data-testid attributes as primary locators
   - Include fallback locators for different page states

2. **Performance**
   - Limit the number of alternative locators
   - Use appropriate timeouts for your application
   - Consider using different configurations for different environments

3. **Maintenance**
   - Regularly review and update locators
   - Remove obsolete locators
   - Add new locators when UI changes

## CLI Commands

### Initialize Project
```bash
bingo init
```

### Add New Page
```bash
bingo add page "login"
```

### Mask Data
```bash
bingo mask "sensitive-data"
```

### Update Page
```bash
bingo update page "oldName" "newName"
```

### Delete Page
```bash
bingo delete page "pageName"
```

## Writing Tests

### Feature File
```gherkin
Feature: Login Functionality

  Scenario: Successful login
    Given I am on the login page
    When I enter my credentials
    Then I should be logged in
```

### Step Definitions
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { env } = require('./lib/mask');

When('I enter my credentials', async function() {
    const email = env.TEST_EMAIL;
    const password = env.TEST_PASSWORD;
    // Use the decrypted values
});
```

## Best Practices

1. **Environment Variables**
   - Always use the `env` proxy to access environment variables
   - Mask sensitive data before committing to version control
   - Use different salts for different environments

2. **Page Objects**
   - Keep locators separate from actions
   - Use descriptive names for actions and locators
   - Follow the single responsibility principle

3. **Test Organization**
   - Group related scenarios in feature files
   - Use tags to organize and filter tests
   - Keep step definitions focused and reusable

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 