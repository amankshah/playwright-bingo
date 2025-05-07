const { Before, After, Status } = require('@cucumber/cucumber');

Before(async function() {
  await this.init();
});

After(async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
  await this.cleanup();
}); 