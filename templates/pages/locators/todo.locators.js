class TodoLocators {
    constructor(page) {
        this.page = page;
    }

    get newTodoInput() {
        return '.new-todo';
    }

    get todoItems() {
        return '.todo-list li';
    }

    get deleteButton() {
        return '.destroy';
    }
}

module.exports = TodoLocators; 