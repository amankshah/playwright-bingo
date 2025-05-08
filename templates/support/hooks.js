const { Before, After, AfterAll } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { BingoPage } = require('playwright-bingo');

Before(async function() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();
    this.bingoPage = new BingoPage(this.page);
    
    // Initialize page objects
    this.loginPage = new (require('../pages/actions/login.actions'))(this.bingoPage);
    this.dashboardPage = new (require('../pages/actions/dashboard.actions'))(this.bingoPage);
});

After(async function() {
    await this.page.close();
});

AfterAll(async function() {
    // Generate reports
    require('../../generate-report');
}); 