# Playwright Cucumber Framework

A robust test automation framework using Playwright and Cucumber for BDD testing.

## 🚀 Features

- Page Object Model (POM) implementation
- BDD with Cucumber
- Playwright for browser automation
- Multiple reporting options (HTML, JSON, Allure)
- Real-time test progress tracking
- Cross-browser testing support

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

## 🏗️ Project Structure

```
project-root/
├── pages/
│   ├── locators/          # Page element locators
│   │   └── todo.locators.js
│   └── actions/           # Page actions
│       └── todo.actions.js
├── features/              # Cucumber feature files
├── step-definitions/      # Step definitions
├── support/              # Support files
├── page.manager.js       # Page object manager
├── cucumber.js           # Cucumber configuration
└── playwright.config.js  # Playwright configuration
```

## 🚀 Running Tests

1. Run all tests:
```bash
npm run test
```

2. Run tests with Allure report:
```bash
npm run test:allure
```

## 📊 Reports

The framework generates multiple types of reports:

1. **Console Progress**
   - Real-time test execution progress
   - Step-by-step execution details
   - Summary of test results

2. **HTML Report**
   - Located in: `test-results/cucumber-report.html`
   - Detailed test execution information
   - Step-by-step results

3. **Allure Report**
   - Located in: `allure-report/`
   - Interactive dashboard
   - Detailed test execution metrics
   - Screenshots and logs

## 🏗️ Page Object Model

The framework uses a robust Page Object Model structure:

1. **Locators**
   - Contains all page element selectors
   - Separated by page/feature
   - Easy to maintain and update

2. **Actions**
   - Contains all page interactions
   - Reusable methods
   - Business logic implementation

3. **Page Manager**
   - Centralized page object management
   - Lazy loading of page objects
   - Single instance management

## 📝 Writing Tests

1. Create a feature file in `features/`:
```gherkin
Feature: Todo List
  Scenario: Add a new todo item
    Given I am on the todo page
    When I add a new todo item "Buy groceries"
    Then I should see "Buy groceries" in the todo list
```

2. Implement step definitions in `step-definitions/`

## 🔧 Configuration

- `cucumber.js`: Cucumber configuration
- `playwright.config.js`: Playwright configuration
- `package.json`: Project dependencies and scripts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License. 