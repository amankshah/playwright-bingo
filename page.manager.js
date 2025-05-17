const TodoActions = require('./pages/actions/todo.actions');
const HelloActions = require('./pages/actions/hello.actions');


class PageManager {
    constructor(page) {
        this.page = page;
        this._initializePages();
    }

    _initializePages() {
        this.hello = new HelloActions(this.page);
        this.todo = new TodoActions(this.page);
    }
}

module.exports = PageManager; 