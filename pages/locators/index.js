const TodoLocators = require('./todo.locators');



const HelloLocators = require('./hello.locators');

class LocatorManager {
    constructor(page) {
        this.hello = new HelloLocators(page);
        this.page = page;
        this.todo = new TodoLocators(page);
    }

    // Helper method to get all locators
    getAllLocators() {
        return {
            hello: this.hello,
            ...this.getAllLocators()
        };
        return {            ...this.getAllLocators()
        };
       
        return {
            todo: this.todo
        };
    }
}

// Export the class directly
module.exports = LocatorManager; 