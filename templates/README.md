# Playwright Bingo Framework

A powerful and user-friendly test automation framework built on Playwright and Cucumber.js, designed to make test automation easy and efficient.

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

## 🚀 Features

- **Page Object Model**: Clean and maintainable test structure
- **Self-healing Locators**: Automatic retry mechanism for flaky elements
- **Data Masking**: Secure handling of sensitive test data
- **Parallel Execution**: Run tests in parallel for faster execution
- **HTML Reports**: Beautiful and detailed test reports
- **CLI Tools**: Easy-to-use commands for project management
- **Cucumber Integration**: BDD-style test writing with Gherkin syntax
- **Modern UI Testing**: Built on Playwright for reliable cross-browser testing

## 📦 Installation

1. Install the framework globally:
```bash
npm install -g playwright-bingo
```

2. Create a new project:
```bash
bingo init
```

3. Install dependencies:
```bash
npm install
```

4. Install Playwright browsers:
```bash
npx playwright install
```

## 🎮 Usage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in parallel
npm run test:parallel

# Generate HTML report
npm run test:report
```

### CLI Commands

```bash
# Add a new page
bingo add page <pageName>

# Delete a page
bingo delete page <pageName>

# Update page name
bingo update page <oldName> <newName>

# Mask sensitive data
bingo mask <data>

# Unmask data
bingo unmask <maskedData>
```

## 📁 Project Structure

```
playwright-bingo/
├── features/                    # Cucumber feature files
│   └── todo.feature            # Example Todo feature file
├── lib/                        # Core framework files
│   ├── index.js               # Main framework exports
│   ├── locators.js            # Locator management
│   ├── page.manager.js        # Page object management
│   └── utils/                 # Utility functions
│       ├── data-masker.js     # Data masking utilities
│       └── properties.js      # Properties file handling
├── pages/                      # Page objects
│   ├── actions/               # Page actions
│   │   ├── index.js          # Actions exports
│   │   └── todo.actions.js   # Todo page actions
│   └── locators/             # Page locators
│       ├── index.js          # Locators exports
│       └── todo.locators.js  # Todo page locators
├── step-definitions/          # Cucumber step definitions
│   └── todo.steps.js         # Todo feature steps
├── support/                   # Support files
│   ├── env-setup.js          # Environment configuration
│   ├── hooks.js              # Cucumber hooks
│   └── world.js              # Custom world setup
├── tests/                     # Test files
│   └── todo.test.js          # Example test file
├── .env                      # Environment variables
├── .gitignore                # Git ignore file
├── bingo.config.js           # Framework configuration
├── cucumber.js               # Cucumber configuration
├── generate-report.js        # HTML report generation
├── jsconfig.json             # JavaScript configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## ⚙️ Configuration

### bingo.config.js

```javascript
module.exports = {
    selfHealing: {
        enabled: true,
        maxTimeout: 5000,
        retryInterval: 1000,
        maxRetries: 3
    },
    locators: {
        defaultTimeout: 30000,
        waitForTimeout: 5000
    },
    browser: {
        headless: true,
        slowMo: 50
    },
    reporting: {
        screenshots: {
            onFailure: true,
            onSuccess: false
        },
        videos: {
            enabled: true,
            retainOnFailure: true
        }
    },
    dataMasking: {
        enabled: true,
        properties: {
            autoMask: true,
            sensitiveKeys: [
                'password',
                'secret',
                'key',
                'token',
                'credential',
                'apiKey',
                'auth',
                'private'
            ]
        }
    }
};
```

## 🔒 Data Masking

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
const { env } = require('playwright-bingo');

// Access environment variables (automatically decrypted)
console.log(env.TEST_EMAIL);  // Shows original value
```

### Properties File Masking

The framework can automatically mask sensitive values in `.properties` files:

1. Configure masking in `bingo.config.js`:
```javascript
module.exports = {
    dataMasking: {
        enabled: true,
        properties: {
            autoMask: true,
            sensitiveKeys: [
                'password',
                'secret',
                'key',
                'token',
                'credential',
                'apiKey',
                'auth',
                'private'
            ]
        }
    }
};
```

2. Use the Properties class to handle masked values:
```javascript
const { properties } = require('playwright-bingo');

// Load properties with automatic masking
properties.load('path/to/properties.file', true);

// Get masked value
const maskedValue = properties.get('db.password');

// Get original value
const originalValue = properties.get('db.password', true);

// Save masked properties to a new file
properties.save('path/to/masked.properties', true);
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
- Properties file values containing sensitive keys

### Debugging

```javascript
const { debug } = require('playwright-bingo');

// Show all masked values and their originals
debug();
```

## 🔄 Self-Healing Locators

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

## 📊 Reports

HTML reports are generated automatically after test execution:

```bash
npm run test:report
```

Reports include:
- Test execution summary
- Scenario details
- Screenshots on failure
- Environment information
- Execution time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 