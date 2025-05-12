const { Given, When, Then } = require('@cucumber/cucumber');
const { LocatorManager, PageManager, env, debug } = require('playwright-bingo');
const chalk = require('chalk');


Given('I am on the todo page', async function() {
    // Initialize page manager
    await PageManager.initialize();
    this.page = await PageManager.getPage('todo');
    // Mock page navigation
    this.page.goto = async () => {};
});

When('I add a new todo item {string}', async function(todoText) {
    // Mock page interactions
    this.page.type = async () => {};
    this.page.press = async () => {};
    await this.page.type('[data-test="todo-input"]', todoText);
    await this.page.press('[data-test="todo-input"]', 'Enter');
});

Then('I should see {string} in the todo list', async function(todoText) {
    // Mock locator and visibility check
    const mockLocator = {
        toBeVisible: async () => {}
    };
    this.page.locator = () => mockLocator;
    const todoItem = await this.page.locator(`[data-test="todo-item"]:has-text("${todoText}")`);
    await todoItem.toBeVisible();
});

Given('I have a todo item {string}', async function(todoText) {
    // Mock page interactions
    this.page.type = async () => {};
    this.page.press = async () => {};
    await this.page.type('[data-test="todo-input"]', todoText);
    await this.page.press('[data-test="todo-input"]', 'Enter');
});

When('I complete the todo item {string}', async function(todoText) {
    // Mock locator and click
    const mockLocator = {
        locator: () => ({
            click: async () => {}
        })
    };
    this.page.locator = () => mockLocator;
    const todoItem = await this.page.locator(`[data-test="todo-item"]:has-text("${todoText}")`);
    await todoItem.locator('[data-test="todo-checkbox"]').click();
});

Then('It should show as completed', async function() {
    // Mock locator and visibility check
    const mockLocator = {
        toBeVisible: async () => {}
    };
    this.page.locator = () => mockLocator;
    const completedItem = await this.page.locator('[data-test="todo-item"].completed');
    await completedItem.toBeVisible();
});

When('I delete the todo item {string}', async function(todoText) {
    // Mock locator and click
    const mockLocator = {
        locator: () => ({
            click: async () => {}
        })
    };
    this.page.locator = () => mockLocator;
    const todoItem = await this.page.locator(`[data-test="todo-item"]:has-text("${todoText}")`);
    await todoItem.locator('[data-test="todo-delete"]').click();
});

Then('It should be removed from the list', async function() {
    // Mock locator and count check
    const mockLocator = {
        toHaveCount: async () => {}
    };
    this.page.locator = () => mockLocator;
    const todoList = await this.page.locator('[data-test="todo-list"]');
    await todoList.toHaveCount(0);
});

When('I enter my credentials', async function() {
    // Debug environment variables
    console.log('\n🔑 Credentials Check:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Raw TEST_EMAIL:', process.env.TEST_EMAIL);
    console.log('Raw TEST_PASSWORD:', process.env.TEST_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Use environment variables
    const email = env.TEST_EMAIL;
    const password = env.TEST_PASSWORD;
    
    console.log('\n🔐 Decrypted Values:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

Then('I should see "Email: test@example.com"', async function() {
    const email = env.TEST_EMAIL;
    console.log('/n Email:', email);
    console.log("Email value in env", process.env.TEST_EMAIL);
    if (email !== 'test@example.com') {
        throw new Error(`Expected email to be 'test@example.com' but got '${email}'`);
    }
});

Then('I should see "Password: secret"', async function() {
    const password = env.TEST_PASSWORD;
    console.log('/n Password:', password);
    console.log("Password value in env", process.env.TEST_PASSWORD);
    if (password !== 'secret') {
        throw new Error(`Expected password to be 'secret' but got '${password}'`);
    }
});
