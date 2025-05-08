const TodoLocators = require('./todo.locators');

const LoginLocators = require('./login.locators');

class LocatorManager {
    constructor(page) {
        this.login = new LoginLocators(page);
        this.page = page;
        this.todo = new TodoLocators(page);
    }

    // Helper method to get all locators
    getAllLocators() {
        return {
            login: this.login,
            ...this.getAllLocators()
        };
        return {
            todo: this.todo
        };
    }
}

// Export the class directly
module.exports = LocatorManager; 