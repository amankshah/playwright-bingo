const { Before, After, BeforeAll, AfterAll, setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { BingoPage } = require('playwright-bingo');
const path = require('path');
const fs = require('fs');

// Set default timeout for all steps
setDefaultTimeout(30000);

let browser;

// Define custom world
class CustomWorld {
    constructor() {
        this.page = null;
        this.bingoPage = null;
    }
}

setWorldConstructor(CustomWorld);

BeforeAll(async function() {
    browser = await chromium.launch();
});

Before(async function() {
    const context = await browser.newContext();
    const page = await context.newPage();
    this.page = page;
    this.bingoPage = new BingoPage(page);
});

After(async function(scenario) {
    if (scenario.result.status === 'FAILED') {
        try {
            // Create screenshots directory if it doesn't exist
            const screenshotsDir = path.join(process.cwd(), 'screenshots');
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const screenshotPath = path.join(screenshotsDir, `${scenario.pickle.name}.png`);
            await this.page.screenshot({
                path: screenshotPath,
                fullPage: true
            });
            
            // Attach screenshot to the report
            const screenshot = fs.readFileSync(screenshotPath);
            if (typeof this.attach === 'function') {
                await this.attach(screenshot, 'image/png');
            }
        } catch (error) {
            console.error('Failed to take screenshot:', error);
        }
    }
    await this.page.close();
});

AfterAll(async function() {
    await browser.close();
    
    console.log("Browser closed");
   
}); 