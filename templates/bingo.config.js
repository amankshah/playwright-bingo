/**
 * Bingo Framework Configuration
 * This file contains all the configuration settings for the Bingo testing framework.
 * Each section is documented with its purpose and available options.
 */

module.exports = {
    /**
     * Self-healing Configuration
     * Enables automatic retry mechanism for locators that fail to find elements.
     * This helps handle flaky tests and dynamic content loading.
     */
    selfHealing: {
        enabled: true,        // Enable/disable self-healing mechanism
        maxTimeout: 5000,     // Maximum time (ms) to wait for any locator to be found
        retryInterval: 1000,  // Time (ms) between retry attempts
        maxRetries: 3,        // Maximum number of retry attempts for each locator
    },

    /**
     * Locator Configuration
     * Controls how locators behave when finding and interacting with elements.
     * These settings affect all locator operations across the framework.
     */
    locators: {
        defaultTimeout: 30000,  // Default timeout (ms) for all locator operations
        waitForTimeout: 5000,   // Time (ms) to wait for elements to be ready for interaction
    },

    /**
     * Browser Configuration
     * Settings for controlling the browser instance during test execution.
     * These settings are passed directly to Playwright's browser launch options.
     */
    browser: {
        headless: true,  // Run browser in headless mode (true) or visible mode (false)
        slowMo: 50,      // Slow down operations by specified milliseconds for debugging
    },

    /**
     * Reporting Configuration
     * Controls various reporting features including screenshots, videos, and test reports.
     * All paths are relative to the project root.
     */
    reporting: {
        screenshots: {
            onFailure: true,    // Take screenshots when tests fail
            onSuccess: false,   // Take screenshots when tests pass
            path: './screenshots'  // Directory to store screenshot files
        },
        videos: {
            enabled: true,           // Enable video recording of test execution
            retainOnFailure: true,   // Keep video files only for failed tests
            path: './videos'         // Directory to store video files
        },
        reports: {
            path: './reports',  // Directory to store test reports
            format: 'html'      // Report format (html, json, etc.)
        }
    },

    /**
     * Data Masking Configuration
     * Controls how sensitive data is handled during test execution and reporting.
     * Helps prevent exposure of sensitive information in logs and reports.
     */
    dataMasking: {
        enabled: true,  // Enable/disable automatic data masking
        properties: {
            autoMask: true,  // Automatically mask sensitive data in properties
            sensitiveKeys: [ // List of keys that should trigger data masking
                'password',
                'secret',
                'key',
                'token',
                'credential',
                'apiKey',
                'auth',
                'private'
            ]
        }
    },

    /**
     * Base URL Configuration
     * The default URL for your application under test.
     * Can be overridden using the BASE_URL environment variable.
     */
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',

    /**
     * Timeout Configuration
     * Global timeout settings for different types of operations.
     * These can be overridden at the step level if needed.
     */
    timeouts: {
        default: 30000,    // Default timeout for all operations
        navigation: 10000, // Timeout for page navigation
        element: 5000      // Timeout for element interactions
    }
}; 