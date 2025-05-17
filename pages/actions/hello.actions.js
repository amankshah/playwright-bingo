const { expect } = require('@playwright/test');
const LocatorManager = require('../locators');

class HelloActions {
    constructor(bingoPage) {
        this.bingoPage = bingoPage;
        const locatorManager = new LocatorManager(bingoPage.page);
        this.hello = locatorManager.hello;
    }
    // Add your page actions here
    async verifyWelcomeMessage() {
        await expect(this.hello.welcomeMessage).toBe("Welcome to Playwright Bingo!");
    }
}

module.exports = HelloActions;
