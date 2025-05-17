const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LocatorManager, env, debug } = require('playwright-bingo');
const { PageManager} = require('playwright-bingo');
const HelloActions = require('../../pages/actions/hello.actions.js');

Given('I am on the hello page', async function() {
    // Initialize page manager
   
    await PageManager.initialize();
    this.page = await PageManager.getPage('hello');
    this.helloActions = new HelloActions(this.page);
    // await this.helloActions.navigateToHelloPage();
});

Then('I should see the welcome message in hello page {string}', async function(expectedMessage) {
    await this.helloActions.verifyWelcomeMessage(expectedMessage);
});

// Add your step definitions here
// Example:
// When('I perform some action', async function() {
//   await this.pageManager.hello.someAction();
// });
