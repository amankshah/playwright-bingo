const TodoLocators = require('../locators/todo.locators');

class TodoActions {
    constructor(page) {
        this.page = page;
        this.locators = new TodoLocators(page);
    }

    async addTodo(todoText) {
        await this.page.fill(this.locators.todoInput, todoText);
        await this.page.press(this.locators.todoInput, 'Enter');
    }

    async completeTodo(index) {
        const checkboxes = await this.page.$$(this.locators.todoItemCheckbox);
        await checkboxes[index].click();
    }

    async deleteTodo(index) {
        const todoItems = await this.page.$$(this.locators.todoItems);
        await todoItems[index].hover();
        const deleteButtons = await this.page.$$(this.locators.todoItemDeleteButton);
        await deleteButtons[index].click();
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