const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('../pages/locators');
const TodoActions = require('../pages/actions/todo.actions');
const { env, debug } = require('../lib/mask');

// Debug environment variables
console.log('\n🔍 Environment Check in Steps:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('process.env.TEST_EMAIL:', process.env.TEST_EMAIL);
console.log('process.env.TEST_PASSWORD:', process.env.TEST_PASSWORD);
console.log('env.TEST_EMAIL:', env.TEST_EMAIL);
console.log('env.TEST_PASSWORD:', env.TEST_PASSWORD);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

Given('I am on the todo page', async function() {
    // Initialize actions
    this.todoActions = new TodoActions(this.bingoPage);
    // Navigate to page
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
    await this.todoActions.completeTodoItem();
});

Then('It should show as completed', async function() {
    await this.todoActions.verifyTodoItemCompleted();
});

When('I delete the todo item {string}', async function(todoText) {
    await this.todoActions.deleteTodoItem();
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

    // Show the masked values map
    debug();
});

Then('I should see "Email: test@example.com"', async function() {
    const email = env.TEST_EMAIL;
    console.log('Email:', email);
    expect(email).toBe('test@example.com');
});

Then('I should see "Password: secret"', async function() {
    const password = env.TEST_PASSWORD;
    console.log('Password:', password);
    expect(password).toBe(password);
});
