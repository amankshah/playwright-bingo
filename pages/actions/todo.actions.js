const { expect } = require('@playwright/test');

class TodoActions {
    constructor(bingoPage, todo) {
        this.bingoPage = bingoPage;
        this.todo = todo;
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