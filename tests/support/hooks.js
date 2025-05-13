const { Before, After, BeforeAll, AfterAll, setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');
const { PageManager, BingoPage } = require('playwright-bingo');
const path = require('path');
const fs = require('fs');

// Set default timeout for all steps
setDefaultTimeout(30000);

// Define custom world
class CustomWorld {
    constructor() {
        this.page = null;
        this.bingoPage = null;
    }
}

setWorldConstructor(CustomWorld);

BeforeAll(async function() {
    console.clear();
    console.log("Starting browser");
    await PageManager.initialize();
});

Before(async function() {
    this.page = await PageManager.getPage('todo');
    this.bingoPage = this.page; // BingoPage instance
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
    // Optionally, you can close the page here if PageManager supports it
    // await this.page.close();
});

AfterAll(async function() {
    await PageManager.close();
    console.log("Browser closed");
    // process.exit(0); // Ensure CLI is ready for next prompt
}); 