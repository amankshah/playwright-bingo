const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const env = require('../../lib/env-handler');

Given('I am on the login page', async function() {
    await this.page.goto('https://example.com/login');
});

When('I enter my masked email', async function() {
    // The email will be automatically decrypted if it's masked
    await this.page.fill('#email', env.TEST_EMAIL);
});

When('I enter my masked password', async function() {
    // The password will be automatically decrypted if it's masked
    await this.page.fill('#password', env.TEST_PASSWORD);
});

Then('I should be logged in successfully', async function() {
    await expect(this.page.locator('.welcome-message')).toBeVisible();
});

Given('I am logged in', async function() {
    await this.page.goto('https://example.com/login');
    await this.page.fill('#email', env.TEST_EMAIL);
    await this.page.fill('#password', env.TEST_PASSWORD);
    await this.page.click('#login-button');
    await expect(this.page.locator('.welcome-message')).toBeVisible();
});

When('I navigate to profile settings', async function() {
    await this.page.click('#profile-settings');
});

When('I update my phone number with masked value', async function() {
    // The phone number will be automatically decrypted if it's masked
    await this.page.fill('#phone', env.TEST_PHONE);
    await this.page.click('#save-profile');
});

Then('my profile should be updated successfully', async function() {
    await expect(this.page.locator('.success-message')).toBeVisible();
    const savedPhone = await this.page.locator('#phone').inputValue();
    expect(savedPhone).toBe(env.TEST_PHONE); // Will use decrypted value
}); 