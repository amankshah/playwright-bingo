const TodoActions = require('./pages/actions/todo.actions');

class PageManager {
    constructor(page) {
        this.page = page;
        this._todoActions = null;
    }

    get todoActions() {
        if (!this._todoActions) {
            this._todoActions = new TodoActions(this.page);
        }
        return this._todoActions;
    }
}

module.exports = PageManager; 