module.exports = {
    // Self-healing configuration
    selfHealing: {
        enabled: true,
        maxTimeout: 5000, // Maximum time to wait for any locator to be found
        retryInterval: 1000, // Time between retries
        maxRetries: 3, // Maximum number of retries for each locator
    },
    // Locator configuration
    locators: {
        defaultTimeout: 30000, // Default timeout for regular locators
        waitForTimeout: 5000, // Time to wait for elements to be ready
    },
    // Browser configuration
    browser: {
        headless: true,
        slowMo: 50,
    },
    // Reporting configuration
    reporting: {
        screenshots: {
            onFailure: true,
            onSuccess: false,
        },
        videos: {
            enabled: true,
            retainOnFailure: true,
        }
    }
}; 