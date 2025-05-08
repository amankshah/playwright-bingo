const { Before, After } = require('@cucumber/cucumber');
const { config } = require('playwright-bingo');

// Before each scenario
Before(async function() {
    await this.init();
});

// After each scenario
After(async function(scenario) {
    // Take screenshot on failure if configured
    if (scenario.result.status === 'failed' && config.screenshots.onFailure) {
        const screenshotPath = `${config.screenshots.path}/${scenario.pickle.name.replace(/\s+/g, '_')}.png`;
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
    }

    // Close browser
    await this.browser.close();
}); 