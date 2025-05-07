const { chromium, firefox, webkit } = require('@playwright/test');
const BingoPage = require('./bingo-page');

class BingoFactory {
    static async createPage(browserType = 'chromium', options = {}) {
        let browser;
        switch (browserType.toLowerCase()) {
            case 'firefox':
                browser = await firefox.launch(options);
                break;
            case 'webkit':
                browser = await webkit.launch(options);
                break;
            default:
                browser = await chromium.launch(options);
        }

        const context = await browser.newContext();
        const page = await context.newPage();
        return new BingoPage(page);
    }

    static async createPages(browserType = 'chromium', count = 1, options = {}) {
        const pages = [];
        for (let i = 0; i < count; i++) {
            pages.push(await this.createPage(browserType, options));
        }
        return pages;
    }
}

module.exports = BingoFactory; 