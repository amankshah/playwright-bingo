# Playwright Bingo

A Playwright-based testing framework with self-healing capabilities and Cucumber integration.

## Features

- Self-healing locators
- Cucumber BDD integration
- Page Object Model support
- Screenshot capture on test failure
- Configurable timeouts and retries

## Installation

```bash
npm install playwright-bingo
```

## Configuration

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

## Usage

### Basic Page Object Setup

```javascript
const { BingoPage } = require('playwright-bingo');

// In your step definitions
Given('I am on the todo page', async function() {
    // Initialize actions
    this.todoActions = new TodoActions(this.bingoPage);
    // Navigate to page
    await this.todoActions.navigateToTodoPage();
});
```

### Using Self-Healing Locators

```javascript
// In your locators file
class TodoLocators {
    constructor(page) {
        this.page = page;
        // Define multiple locators for the same element
        this.todoInput = [
            'input[placeholder="What needs to be done?"]',
            'input.new-todo'
        ];
    }
}

// In your actions file
async addTodoItem(todoText) {
    const input = await this.bingoPage.waitForElement(this.todo.todoInput);
    await input.fill(todoText);
    await input.press('Enter');
}
```

## Page Object Model

The framework includes a structured approach to Page Object Model:

### Locators
```javascript
// pages/locators/todo.locators.js
class TodoLocators {
    constructor(page) {
        this.page = page;
        this.todoInput = 'input.new-todo';
        this.todoList = '.todo-list';
    }
}
```

### Actions
```javascript
// pages/actions/todo.actions.js
class TodoActions {
    constructor(bingoPage) {
        this.bingoPage = bingoPage;
        this.todo = new LocatorManager(bingoPage.page).todo;
    }

    async addTodoItem(todoText) {
        const input = await this.bingoPage.waitForElement(this.todo.todoInput);
        await input.fill(todoText);
        await input.press('Enter');
    }
}
```

### Step Definitions
```javascript
// step-definitions/todo.steps.js
Given('I am on the todo page', async function() {
    this.todoActions = new TodoActions(this.bingoPage);
    await this.todoActions.navigateToTodoPage();
});

When('I add a new todo item {string}', async function(todoText) {
    await this.todoActions.addTodoItem(todoText);
});
```

## API Reference

### BingoPage

The `BingoPage` class extends Playwright's `Page` class with self-healing capabilities:

- `waitForElement(locator, options)`: Wait for an element to be ready
- `findElement(locator, options)`: Find an element without waiting
- `elementExists(locator, options)`: Check if an element exists
- `waitForElementHidden(locator, options)`: Wait for element to be hidden
- `waitForElementDetached(locator, options)`: Wait for element to be detached

### Options

All element methods accept the following options:

```javascript
{
    timeout: 30000,        // Maximum time to wait (ms)
    retryInterval: 1000,   // Time between retries (ms)
    maxRetries: 3,         // Maximum number of retry attempts
    state: 'visible',      // Element state to wait for
    checkExistence: true   // Whether to check element existence
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 