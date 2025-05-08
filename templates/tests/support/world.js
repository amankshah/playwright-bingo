const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { BingoPage } = require('playwright-bingo');

// Custom World class
class CustomWorld {
    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        this.bingoPage = new BingoPage(this.page);
    }
}

// Set up the custom world
setWorldConstructor(CustomWorld); 