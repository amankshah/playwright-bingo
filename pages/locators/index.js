const TodoLocators = require('./todo.locators');

class LocatorManager {
    constructor(page) {
        this.page = page;
        this.todo = new TodoLocators(page);
    }

    // Helper method to get all locators
    getAllLocators() {
        return {
            todo: this.todo
        };
    }
}

// Export the class directly
module.exports = LocatorManager; 