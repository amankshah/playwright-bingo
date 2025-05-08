const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LocatorManager, PageManager, env, debug } = require('playwright-bingo');

Given('I am on the todo page', async function() {
    // Initialize page manager
    this.pageManager = new PageManager(this.bingoPage);
    // Navigate to page
    await this.pageManager.todo.navigateToTodoPage();
});

When('I add a new todo item {string}', async function(todoText) {
    await this.pageManager.todo.addTodoItem(todoText);
});

Then('I should see {string} in the todo list', async function(todoText) {
    await this.pageManager.todo.verifyTodoItemVisible(todoText);
});

Given('I have a todo item {string}', async function(todoText) {
    await this.pageManager.todo.addTodoItem(todoText);
});

When('I complete the todo item {string}', async function(todoText) {
    await this.pageManager.todo.completeTodoItem();
});

Then('It should show as completed', async function() {
    await this.pageManager.todo.verifyTodoItemCompleted();
});

When('I delete the todo item {string}', async function(todoText) {
    await this.pageManager.todo.deleteTodoItem();
});

Then('It should be removed from the list', async function() {
    await this.pageManager.todo.verifyTodoListEmpty();
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
    // debug();
});

Then('I should see "Email: test@example.com"', async function() {
    const email = env.TEST_EMAIL;
    console.log('/nEmail:', email);
    console.log("Email value in env", process.env.TEST_EMAIL);
    expect(email).toBe('test@example.com');
});

Then('I should see "Password: secret"', async function() {
    const password = env.TEST_PASSWORD;
    console.log('/nPassword:', password);
    console.log("Password value in env", process.env.TEST_PASSWORD);
    expect(password).toBe("secret");
});
