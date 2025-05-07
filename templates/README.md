# Playwright Bingo

A BDD framework for Playwright with Cucumber integration.

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

- Page Object Model structure
- Cucumber BDD integration
- Allure reporting
- CLI tool for managing pages
- TypeScript support
- Playwright integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 