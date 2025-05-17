const { Given, When, Then } = require('@cucumber/cucumber');
const { PageManager, env } = require('playwright-bingo');
const TodoActions = require('../../pages/actions/todo.actions.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { mask, isMasked, getOriginalValue } = require('../../lib/mask');


Given('I am on the todo page', async function() {
    await PageManager.initialize();
    this.page = await PageManager.getPage('todo');
    console.log('DEBUG: this.page.constructor.name =', this.page.constructor.name); // Should be BingoPage
    this.todoActions = new TodoActions(this.page);
    await this.todoActions.navigateToTodoPage();
});

When('I add a new todo item {string}', async function(todoText) {
    await this.todoActions.addTodoItem(todoText);
});

Then('I should see {string} in the todo list', async function(todoText) {
    await this.todoActions.verifyTodoItemVisible(todoText);
});

Given('I have a todo item {string}', async function(todoText) {
    await this.todoActions.addTodoItem(todoText);
});

When('I complete the todo item {string}', async function(todoText) {
    await this.todoActions.completeTodoItem(todoText);
});

Then('It should show as completed', async function() {
    await this.todoActions.verifyTodoItemCompleted('Buy groceries');
});

When('I delete the todo item {string}', async function(todoText) {
    await this.todoActions.deleteTodoItem(todoText);
});

Then('It should be removed from the list', async function() {
    await this.todoActions.verifyTodoListEmpty();
});

When('I enter my credentials', async function() {
    // Debug environment variables
    console.log('\n🔑 Credentials Check:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Raw TEST_EMAIL:', process.env.TEST_EMAIL);
    console.log('Raw TEST_PASSWORD:', process.env.TEST_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Use environment variables
    const email = env.TEST_EMAIL;
    const password = env.TEST_PASSWORD;
    
    console.log('\n🔐 Decrypted Values:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

Then('I should see "Email: test@example.com"', async function() {
    const email = env.TEST_EMAIL;
    console.log('/n Email:', email);
    console.log("Email value in env", process.env.TEST_EMAIL);
    if (email !== 'test@example.com') {
        throw new Error(`Expected email to be 'test@example.com' but got '${email}'`);
    }
});

Then('I should see "Password: secret"', async function() {
    const password = env.TEST_PASSWORD;
    console.log('/n Password:', password);
    console.log("Password value in env", process.env.TEST_PASSWORD);
    if (password !== 'secret') {
        throw new Error(`Expected password to be 'secret' but got '${password}'`);
    }
});

Given('I load the properties file', async function() {
    const propertiesPath = path.resolve(__dirname, '../../config/test.properties.json');
    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    this.properties = properties;
    console.log('Loaded properties:', properties);
});

Then('I should see the welcome message {string}', async function(expectedMessage) {
    const actualMessage = this.properties.welcomeMessage;
    if (actualMessage !== expectedMessage) {
        throw new Error(`Expected welcome message to be "${expectedMessage}" but got "${actualMessage}"`);
    }
    // Optionally, you could also verify this message in the UI if your app displays it
});

Then('the apiKey should be masked as {string}', async function(expectedMasked) {
    const apiKey = this.properties.apiKey;
    // Mask all but the last 10 characters
    const masked = apiKey.replace(/^[^-]+-[^-]+/, '*****-*****');
    if (masked !== expectedMasked) {
        throw new Error(`Expected masked apiKey to be "${expectedMasked}" but got "${masked}"`);
    }
});

Then('the secret should be masked as {string}', async function(expectedMasked) {
    const secret = this.properties.secret;
    if (!isMasked(secret)) {
        throw new Error(`Expected secret to be masked, but got: ${secret}`);
    }
});

Given('I mask the value {string}', async function(originalValue) {
    this.maskedValue = mask(originalValue);
    this.originalValue = originalValue;
});

Then('the value should be masked', async function() {
    if (!isMasked(this.maskedValue)) {
        throw new Error(`Expected value to be masked, but got: ${this.maskedValue}`);
    }
});

Then('unmasking should return the original value', async function() {
    const unmasked = getOriginalValue(this.maskedValue);
    if (unmasked !== this.originalValue) {
        throw new Error(`Expected unmasked value to be '${this.originalValue}', but got '${unmasked}'`);
    }
});
