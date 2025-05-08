const TodoLocators = require('./todo.locators');

class LocatorManager {
    constructor(page) {
        this.page = page;
        this.todo = new TodoLocators(page);
    }

    getAllLocators() {
        return {
            todo: this.todo
        };
    }
}

module.exports = LocatorManager; 