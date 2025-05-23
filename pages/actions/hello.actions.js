const { expect } = require('@playwright/test');
const { PageManager } = require('playwright-bingo');

class HelloActions {
    constructor(page) {
        // Use PageManager to get locators for 'hello'
        const pm = new PageManager(page);
        this.helloLocators = pm.page('hello').locators;
        this.page = page;
    }
    // Add your page actions here
    async verifyWelcomeMessage(expectedMessage) {
        await expect(this.helloLocators.welcomeMessage).toBe(expectedMessage);
    }
}

module.exports = HelloActions;
