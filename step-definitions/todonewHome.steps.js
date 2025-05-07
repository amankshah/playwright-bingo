const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PageManager = require('../page.manager');

Given('I am on the todonewHome page', async function() {
  // TODO: Update the URL for your page
  await this.page.goto('https://your-page-url.com');
  this.pageManager = new PageManager(this.page);
  const { todonewHomeActions } = this.pageManager;
  this.todonewHome = todonewHomeActions;
});


Example:
When('I perform some action 2', async function() {
  await this.todonewHome.someAction();
});
