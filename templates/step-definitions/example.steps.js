const { Given, When, Then } = require('@cucumber/cucumber');
const { env } = require('playwright-bingo/lib/mask');

Given('I am on the login page', async function() {
    await this.page.goto('/login');
});

When('I enter valid credentials', async function() {
    const email = env.TEST_USER_EMAIL;
    const password = env.TEST_USER_PASSWORD;
    await this.loginPage.login(email, password);
});

Then('I should be logged in successfully', async function() {
    await this.dashboardPage.verifyLoggedIn();
});

Given('I have sensitive data in my properties file', async function() {
    await this.properties.load('config/test.properties', true);
});

When('I access the masked data', async function() {
    this.maskedValue = await this.properties.get('db.password');
    this.originalValue = await this.properties.get('db.password', true);
});

Then('it should be automatically decrypted', async function() {
    expect(this.maskedValue).toContain('BINGO_MASK_');
    expect(this.originalValue).not.toContain('BINGO_MASK_');
}); 