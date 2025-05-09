const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Try to load user's config or use default config
let config;
try {
    // First try to find the config in the project root
    const projectRoot = findProjectRoot();
    const configPath = path.join(projectRoot, 'bingo.config.js');
    
    if (fs.existsSync(configPath)) {
        config = require(configPath);
    } else {
        throw new Error('Config file not found');
    }
} catch (error) {
    // If config not found, use default config
    config = {
        selfHealing: {
            enabled: true,
            maxTimeout: 5000,
            retryInterval: 1000,
            maxRetries: 3
        },
        locators: {
            defaultTimeout: 30000,
            waitForTimeout: 5000
        }
    };
}

// Helper function to find project root
function findProjectRoot() {
    let currentDir = process.cwd();
    while (currentDir !== path.parse(currentDir).root) {
        if (fs.existsSync(path.join(currentDir, 'package.json'))) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return process.cwd();
}

class BingoPage {
    constructor(page) {
        this.page = page;
        this.config = config;
        
        // Delegate all page methods
        Object.getOwnPropertyNames(Object.getPrototypeOf(page))
            .filter(method => typeof page[method] === 'function')
            .forEach(method => {
                this[method] = (...args) => this.page[method](...args);
            });
    }

    async locators(locatorArray, options = {}) {
        const {
            timeout = this.config.selfHealing.maxTimeout,
            retryInterval = this.config.selfHealing.retryInterval,
            maxRetries = this.config.selfHealing.maxRetries,
            state = 'visible',
            checkExistence = true
        } = options;

        // Convert single locator to array
        if (!Array.isArray(locatorArray)) {
            locatorArray = [locatorArray];
        }

        let lastError = null;
        let attempts = 0;

        while (attempts < maxRetries) {
            for (const locator of locatorArray) {
                try {
                    const element = this.page.locator(locator);
                    
                    // Only check existence if required
                    if (checkExistence) {
                        const exists = await element.count() > 0;
                        if (!exists) {
                            throw new Error(`Element not found: ${locator}`);
                        }
                    }

                    // Wait for the desired state if specified
                    if (state) {
                        await element.waitFor({ 
                            state,
                            timeout: timeout / maxRetries 
                        });
                    }

                    return element;
                } catch (error) {
                    lastError = error;
                    continue;
                }
            }
            attempts++;
            if (attempts < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            }
        }

        throw new Error(`Failed to find any of the locators after ${maxRetries} attempts. Last error: ${lastError.message}`);
    }

    // Helper method to wait for element to be ready
    async waitForElement(locator, options = {}) {
        return await this.locators(locator, options);
    }

    // Helper method to find element without waiting
    async findElement(locator, options = {}) {
        return await this.locators(locator, { ...options, state: null });
    }

    // Helper method to check if element exists
    async elementExists(locator, options = {}) {
        try {
            await this.locators(locator, { ...options, state: null });
            return true;
        } catch (error) {
            return false;
        }
    }

    // Helper method to wait for element to be hidden
    async waitForElementHidden(locator, options = {}) {
        return await this.locators(locator, { ...options, state: 'hidden' });
    }

    // Helper method to wait for element to be detached
    async waitForElementDetached(locator, options = {}) {
        return await this.locators(locator, { ...options, state: 'detached' });
    }
}

module.exports = BingoPage; 