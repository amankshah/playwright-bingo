const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { env, debug } = require('playwright-bingo');
const PageManager = require('../../page.manager');

Given('I am on the hello page', async function() {
    // this.page is provided by the Cucumber World (see hooks.js)
    const pm = new PageManager(this.page);
    const { actions } = pm.page('hello');
    this.helloActions = actions;
    // await this.helloActions.navigateToHelloPage();
});

Then('I should see the welcome message in hello page {string}', async function(expectedMessage) {
    await this.helloActions.verifyWelcomeMessage(expectedMessage);
});

// Add your step definitions here
// Example:
// When('I perform some action', async function() {
//   await this.helloActions.someAction();
// });
