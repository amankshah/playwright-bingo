const { expect } = require('@playwright/test');
const { PageManager } = require('playwright-bingo');

class TodoActions {
    constructor(page) {
        // Use PageManager to get locators for 'todo'
        const pm = new PageManager(page);
        this.todoLocators = pm.page('todo').locators;
        this.page = page;
    }

    async navigateToTodoPage() {
        await this.page.goto('https://demo.playwright.dev/todomvc');
        await this.page.waitForLoadState('networkidle');
    }

    async addTodoItem(todoText) {
        const input = await this.page.waitForSelector(this.todoLocators.todoInput[1]);
        await input.fill(todoText);
        await input.press('Enter');
        // Wait for the last todo item with the given text to appear
        const itemLocator = `${this.todoLocators.todoItems}:has-text("${todoText}")`;
        const items = this.page.locator(itemLocator);
        if (await items.count() > 0) {
            this._lastTodoItem = items.last();
            await this._lastTodoItem.waitFor({ state: 'visible' });
        }
    }

    async verifyTodoItemVisible(todoText) {
        const labelLocator = `${this.todoLocators.todoItemLabel}:has-text("${todoText}")`;
        const items = this.page.locator(labelLocator);
        await expect(items.last()).toBeVisible();
    }

    async completeTodoItem(todoText) {
        const itemLocator = `${this.todoLocators.todoItems}:has-text("${todoText}")`;
        const items = this.page.locator(itemLocator);
        const lastItem = items.last();
        const toggle = await lastItem.locator(this.todoLocators.todoItemCheckbox);
        await toggle.click();
        await lastItem.waitFor({ state: 'visible' });
    }

    async verifyTodoItemCompleted(todoText) {
        const itemLocator = `${this.todoLocators.todoItems}:has-text("${todoText}")`;
        const items = this.page.locator(itemLocator);
        const lastItem = items.last();
        // Wait for the completed class to appear (retry for up to 2s)
        const maxRetries = 20;
        let found = false;
        for (let i = 0; i < maxRetries; i++) {
            const className = await lastItem.getAttribute('class');
            if (className && className.includes('completed')) {
                found = true;
                break;
            }
            await this.page.waitForTimeout(100);
        }
        if (!found) {
            throw new Error(`Todo item "${todoText}" was not marked as completed.`);
        }
        await expect(lastItem).toBeVisible();
    }

    async deleteTodoItem(todoText) {
        const itemLocator = `${this.todoLocators.todoItems}:has-text("${todoText}")`;
        const items = this.page.locator(itemLocator);
        const lastItem = items.last();
        const deleteButton = await lastItem.locator(this.todoLocators.todoItemDeleteButton);
        await lastItem.hover();
        await deleteButton.click();
        await this.page.waitForTimeout(500);
    }

    async verifyTodoListEmpty() {
        await this.page.waitForTimeout(1000);
        if (await this.page.$(this.todoLocators.todoList[1])) {
            const todoList = await this.page.$(this.todoLocators.todoList[1]);
            const items = await todoList.$$('li');
            expect(items.length).toBe(0);
        } else {
            expect(true).toBeTruthy();
        }
    }

    async filterTodos(filter) {
        switch(filter.toLowerCase()) {
            case 'all':
                await this.page.click(this.locators.allFilter);
                break;
            case 'active':
                await this.page.click(this.locators.activeFilter);
                break;
            case 'completed':
                await this.page.click(this.locators.completedFilter);
                break;
        }
    }

    async clearCompleted() {
        await this.page.click(this.locators.clearCompletedButton);
    }

    async getTodoCount() {
        const countText = await this.page.textContent(this.locators.todoCount);
        return parseInt(countText);
    }

    async getTodoItems() {
        return await this.page.$$(this.locators.todoItems);
    }
}

module.exports = TodoActions; 