const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PageManager = require('../page.manager');

Given('I am on the todo page', async function() {
  await this.page.goto('https://demo.playwright.dev/todomvc');
  this.pageManager = new PageManager(this.page);
  const { todoActions } = this.pageManager;
  this.todo = todoActions;
});

When('I add a new todo item {string}', async function(item) {
  await this.todo.addTodo(item);
});

Then('I should see {string} in the todo list', async function(item) {
  const todoItems = await this.todo.getTodoItems();
  const itemTexts = await Promise.all(todoItems.map(item => item.textContent()));
  expect(itemTexts).toContain(item);
});

Given('I have a todo item {string}', async function(item) {
  await this.todo.addTodo(item);
});

When('I complete the todo item {string}', async function(item) {
  const todoItems = await this.todo.getTodoItems();
  const itemTexts = await Promise.all(todoItems.map(item => item.textContent()));
  const index = itemTexts.indexOf(item);
  if (index !== -1) {
    await this.todo.completeTodo(index);
  }
});

Then('It should show as completed', async function() {
  const todoItems = await this.todo.getTodoItems();
  const completedItems = await Promise.all(
    todoItems.map(async item => {
      const checkbox = await item.$('input[type="checkbox"]');
      return await checkbox.isChecked();
    })
  );
  expect(completedItems).toContain(true);
});

When('I delete the todo item {string}', async function(item) {
  const todoItems = await this.todo.getTodoItems();
  const itemTexts = await Promise.all(todoItems.map(item => item.textContent()));
  const index = itemTexts.indexOf(item);
  if (index !== -1) {
    await this.todo.deleteTodo(index);
  }
});

Then('It should be removed from the list', async function() {
  const todoItems = await this.todo.getTodoItems();
  expect(todoItems.length).toBe(0);
}); 