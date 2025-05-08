module.exports = {
    // Framework configuration
    framework: {
        name: 'playwright-bingo',
        version: '1.0.2'
    },

    // Browser configuration
    browser: {
        headless: true,
        slowMo: 50,
        timeout: 30000
    },

    // Report configuration
    report: {
        enabled: true,
        format: 'html',
        outputDir: './reports'
    },

    // Data masking configuration
    masking: {
        enabled: true,
        maskPrefix: 'BINGO_MASK_',
        propertiesFile: './config/test.properties'
    },

    // Self-healing configuration
    selfHealing: {
        enabled: true,
        maxRetries: 3,
        retryDelay: 1000
    }
}; 