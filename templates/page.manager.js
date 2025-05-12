const TodoActions = require('./pages/actions/todo.actions');


class PageManager {
    constructor(page) {
        this.page = page;
        this._initializePages();
    }

    _initializePages() {
        this.todo = new TodoActions(this.page);
    }
}

module.exports = PageManager; 