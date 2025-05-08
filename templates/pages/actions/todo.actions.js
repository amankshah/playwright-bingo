const { expect } = require('@playwright/test');
const LocatorManager = require('../locators');

class TodoActions {
    constructor(bingoPage) {
        this.bingoPage = bingoPage;
        const locatorManager = new LocatorManager(bingoPage.page);
        this.todo = locatorManager.todo;
    }

    async navigateToTodoPage() {
        await this.bingoPage.goto('https://demo.playwright.dev/todomvc');
        await this.bingoPage.waitForLoadState('networkidle');
    }

    async addTodoItem(todoText) {
        const input = await this.bingoPage.waitForElement(this.todo.todoInput);
        await input.fill(todoText);
        await input.press('Enter');
        await this.bingoPage.waitForElement(this.todo.todoItems);
    }

    async verifyTodoItemVisible(todoText) {
        const todoItem = await this.bingoPage.waitForElement(this.todo.todoItemLabel);
        await expect(todoItem).toBeVisible();
    }

    async completeTodoItem() {
        const toggle = await this.bingoPage.waitForElement(this.todo.todoItemCheckbox);
        await toggle.click();
        await this.bingoPage.waitForElement(this.todo.todoItems);
    }

    async verifyTodoItemCompleted() {
        const completedItem = await this.bingoPage.waitForElement(this.todo.todoItems);
        await expect(completedItem).toBeVisible();
    }

    async deleteTodoItem() {
        const todoItem = await this.bingoPage.waitForElement(this.todo.todoItems);
        await todoItem.hover();
        const deleteButton = await this.bingoPage.waitForElement(this.todo.todoItemDeleteButton);
        await deleteButton.click();
        await this.bingoPage.waitForTimeout(500);
    }

    async verifyTodoListEmpty() {
        await this.bingoPage.waitForTimeout(1000);
        const todoList = await this.bingoPage.findElement(this.todo.todoList, { checkExistence: false });
        if (await this.bingoPage.elementExists(this.todo.todoList)) {
            const items = await todoList.locator('li').count();
            expect(items).toBe(0);
        } else {
            expect(true).toBeTruthy();
        }
    }
}

module.exports = TodoActions; 