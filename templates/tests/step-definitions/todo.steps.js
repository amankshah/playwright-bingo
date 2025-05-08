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
    // This is just an example of using masked data
    const email = env('TEST_EMAIL', 'test@example.com');
    const password = env('TEST_PASSWORD', 'secret');
    // Use the credentials in your test
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}); 