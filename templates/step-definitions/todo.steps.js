const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const TodoActions = require('../pages/actions/todo.actions');

Given('I am on the todo page', async function() {
    // Navigate to the TodoMVC application
    await this.page.goto('https://todomvc.com/examples/vanillajs/');
    this.todoActions = new TodoActions(this.page);
});

When('I add a new todo {string}', async function(todoText) {
    await this.todoActions.addTodo(todoText);
});

Then('I should see {string} in the todo list', async function(todoText) {
    const todos = await this.todoActions.getTodoList();
    expect(todos).toContain(todoText);
});

Given('I have a todo {string}', async function(todoText) {
    await this.todoActions.addTodo(todoText);
});

When('I mark {string} as complete', async function(todoText) {
    await this.todoActions.markTodoAsComplete(todoText);
});

Then('{string} should be marked as complete', async function(todoText) {
    const isComplete = await this.todoActions.isTodoComplete(todoText);
    expect(isComplete).toBeTruthy();
});

When('I delete {string}', async function(todoText) {
    await this.todoActions.deleteTodo(todoText);
});

Then('{string} should not be in the todo list', async function(todoText) {
    const todos = await this.todoActions.getTodoList();
    expect(todos).not.toContain(todoText);
}); 