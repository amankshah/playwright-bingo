const TodoLocators = require('../locators/todo.locators');

class TodoActions {
    constructor(page) {
        this.page = page;
        this.locators = new TodoLocators(page);
    }

    async addTodo(text) {
        await this.page.fill(this.locators.newTodoInput, text);
        await this.page.press(this.locators.newTodoInput, 'Enter');
    }

    async getTodoList() {
        const todoElements = await this.page.$$(this.locators.todoItems);
        const todos = [];
        for (const element of todoElements) {
            const text = await element.textContent();
            todos.push(text.trim());
        }
        return todos;
    }

    async markTodoAsComplete(todoText) {
        const todoElements = await this.page.$$(this.locators.todoItems);
        for (const element of todoElements) {
            const text = await element.textContent();
            if (text.trim() === todoText) {
                await element.click();
                break;
            }
        }
    }

    async isTodoComplete(todoText) {
        const todoElements = await this.page.$$(this.locators.todoItems);
        for (const element of todoElements) {
            const text = await element.textContent();
            if (text.trim() === todoText) {
                const classList = await element.getAttribute('class');
                return classList.includes('completed');
            }
        }
        return false;
    }

    async deleteTodo(todoText) {
        const todoElements = await this.page.$$(this.locators.todoItems);
        for (const element of todoElements) {
            const text = await element.textContent();
            if (text.trim() === todoText) {
                await element.hover();
                const deleteButton = await element.$(this.locators.deleteButton);
                await deleteButton.click();
                break;
            }
        }
    }
}

module.exports = TodoActions; 