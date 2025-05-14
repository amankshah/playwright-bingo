const TodoLocators = require('./todo.locators');



class LocatorManager {
    constructor(page) {
        this.page = page;
        this.todo = new TodoLocators(page);
    }

    // Helper method to get all locators
    getAllLocators() {
        return {            ...this.getAllLocators()
        };
    
    }
}

// Export the class directly
module.exports = LocatorManager; 