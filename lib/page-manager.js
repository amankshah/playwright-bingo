const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const BingoPage = require('./bingo-page');

class PageManager {
    constructor() {
        this.browser = null;
        this.context = null;
        this.pages = new Map();
    }

    async initialize() {
        this.browser = await chromium.launch({
            headless: true
        });
        this.context = await this.browser.newContext();
    }

    async getPage(name) {
        if (!this.pages.has(name)) {
            const page = await this.context.newPage();
            const bingoPage = new BingoPage(page);
            this.pages.set(name, bingoPage);
        }
        return this.pages.get(name);
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

module.exports = new PageManager(); 