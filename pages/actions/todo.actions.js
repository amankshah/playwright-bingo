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
        // Wait for the last todo item with the given text to appear
        const itemLocators = Array.isArray(this.todo.todoItems)
            ? this.todo.todoItems.map(sel => `${sel}:has-text("${todoText}")`)
            : [`${this.todo.todoItems}:has-text("${todoText}")`];
        let lastItem;
        for (const locator of itemLocators) {
            const items = this.bingoPage.locator(locator);
            if (await items.count() > 0) {
                lastItem = items.last();
                await lastItem.waitFor({ state: 'visible' });
                break;
            }
        }
        this._lastTodoItem = lastItem;
    }

    async verifyTodoItemVisible(todoText) {
        const labelLocators = Array.isArray(this.todo.todoItemLabel)
            ? this.todo.todoItemLabel.map(sel => `${sel}:has-text("${todoText}")`)
            : [`${this.todo.todoItemLabel}:has-text("${todoText}")`];
        let lastItem;
        for (const locator of labelLocators) {
            const items = this.bingoPage.locator(locator);
            if (await items.count() > 0) {
                lastItem = items.last();
                break;
            }
        }
        await expect(lastItem).toBeVisible();
    }

    async completeTodoItem(todoText) {
        const itemLocators = Array.isArray(this.todo.todoItems)
            ? this.todo.todoItems.map(sel => `${sel}:has-text("${todoText}")`)
            : [`${this.todo.todoItems}:has-text("${todoText}")`];
        let lastItem;
        for (const locator of itemLocators) {
            const items = this.bingoPage.locator(locator);
            if (await items.count() > 0) {
                lastItem = items.last();
                break;
            }
        }
        const checkboxLocators = Array.isArray(this.todo.todoItemCheckbox)
            ? this.todo.todoItemCheckbox
            : [this.todo.todoItemCheckbox];
        let toggle;
        for (const cbSel of checkboxLocators) {
            try {
                toggle = await lastItem.locator(cbSel);
                if (await toggle.count() > 0) break;
            } catch {}
        }
        await toggle.click();
        await lastItem.waitFor({ state: 'visible' });
    }

    async verifyTodoItemCompleted(todoText) {
        const itemLocators = Array.isArray(this.todo.todoItems)
            ? this.todo.todoItems.map(sel => `${sel}.completed:has-text("${todoText}")`)
            : [`${this.todo.todoItems}.completed:has-text("${todoText}")`];
        let lastItem;
        for (const locator of itemLocators) {
            const items = this.bingoPage.locator(locator);
            if (await items.count() > 0) {
                lastItem = items.last();
                break;
            }
        }
        await expect(lastItem).toBeVisible();
    }

    async deleteTodoItem(todoText) {
        const itemLocators = Array.isArray(this.todo.todoItems)
            ? this.todo.todoItems.map(sel => `${sel}:has-text("${todoText}")`)
            : [`${this.todo.todoItems}:has-text("${todoText}")`];
        let lastItem;
        for (const locator of itemLocators) {
            const items = this.bingoPage.locator(locator);
            if (await items.count() > 0) {
                lastItem = items.last();
                break;
            }
        }
        const deleteLocators = Array.isArray(this.todo.todoItemDeleteButton)
            ? this.todo.todoItemDeleteButton
            : [this.todo.todoItemDeleteButton];
        let deleteButton;
        for (const delSel of deleteLocators) {
            try {
                deleteButton = await lastItem.locator(delSel);
                if (await deleteButton.count() > 0) break;
            } catch {}
        }
        await lastItem.hover();
        await deleteButton.click();
        await this.bingoPage.waitForTimeout(500);
    }

    async verifyTodoListEmpty() {
        // Wait a bit for the deletion to complete
        await this.bingoPage.waitForTimeout(1000);
        // Check if the list exists but has no items
        const todoList = await this.bingoPage.findElement(this.todo.todoList, { checkExistence: false });
        if (await this.bingoPage.elementExists(this.todo.todoList)) {
            const items = await todoList.locator('li').count();
            expect(items).toBe(0);
        } else {
            // If list doesn't exist, that's also fine
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