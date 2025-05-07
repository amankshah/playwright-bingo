const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('../pages/locators');
const TodoActions = require('../pages/actions/todo.actions');

Given('I am on the todo page', async function() {
    // Initialize locators
    this.locators = new LocatorManager(this.page);
    this.todo = this.locators.todo;
    // Initialize actions
    this.todoActions = new TodoActions(this.bingoPage, this.todo);
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