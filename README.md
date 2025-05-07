# Playwright Bingo

A powerful testing framework built on top of Playwright and Cucumber, designed to make end-to-end testing more efficient and maintainable.

## Features

- 🎯 **Page Object Model**: Organized structure for better test maintenance
- 🔄 **Cucumber Integration**: BDD-style test writing with Gherkin syntax
- 🎨 **Modern UI Testing**: Built on Playwright for reliable cross-browser testing
- 🔒 **Data Masking**: Built-in support for masking sensitive data
- 🛠️ **CLI Tools**: Easy project management and test creation

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