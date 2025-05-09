const { BingoPage } = require('../index');

class TodoActions extends BingoPage {
    constructor() {
        super();
    }

    async addTodo(text) {
        await this.type('todo.input', text);
        await this.press('todo.input', 'Enter');
    }

    async completeTodo(index) {
        await this.click(`todo.checkbox[${index}]`);
    }

    async deleteTodo(index) {
        await this.click(`todo.delete[${index}]`);
    }

    async getTodoText(index) {
        return await this.getText(`todo.text[${index}]`);
    }

    async getTodoCount() {
        return await this.count('todo.item');
    }
}

module.exports = new TodoActions(); 