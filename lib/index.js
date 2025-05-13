require('module-alias/register');

const BingoPage = require('./bingo-page');
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

const properties = require('./properties');
const { env, debug } = require('./mask');

// Create a dynamic locator manager that loads from user's project
class DynamicLocatorManager {
    constructor() {
        this.locators = {};
        this.loadLocators();
    }

    loadLocators() {
        try {
            const projectRoot = findProjectRoot();
            const locatorsDir = path.join(projectRoot, 'pages', 'locators');
            
            if (fs.existsSync(locatorsDir)) {
                const files = fs.readdirSync(locatorsDir);
                files.forEach(file => {
                    if (file.endsWith('.locators.js')) {
                        const locatorModule = require(path.join(locatorsDir, file));
                        this.locators = { ...this.locators, ...locatorModule };
                    }
                });
            }
        } catch (error) {
            // If locators can't be loaded, use empty object
            this.locators = {};
        }
    }

    getLocator(name) {
        return this.locators[name];
    }
}

// Remove the DynamicPageManager definition and use the custom PageManager
const PageManager = require('./page-manager');

// Create a dynamic action loader
class DynamicActionLoader {
    constructor() {
        this.actions = {};
        this.loadActions();
    }

    loadActions() {
        try {
            const projectRoot = findProjectRoot();
            const actionsDir = path.join(projectRoot, 'pages', 'actions');
            
            if (fs.existsSync(actionsDir)) {
                const files = fs.readdirSync(actionsDir);
                files.forEach(file => {
                    if (file.endsWith('.actions.js')) {
                        const actionName = path.basename(file, '.actions.js');
                        const actionModule = require(path.join(actionsDir, file));
                        this.actions[actionName] = actionModule;
                    }
                });
            }
        } catch (error) {
            // If actions can't be loaded, use empty object
            this.actions = {};
        }
    }

    getAction(name) {
        return this.actions[name];
    }
}

const LocatorManager = new DynamicLocatorManager();
const PropertiesHandler = require('./properties-handler');
const ActionLoader = new DynamicActionLoader();

// Export all framework capabilities
module.exports = {
    // Core Framework
    BingoPage,
    PageManager,
    LocatorManager,
    PropertiesHandler,
    
    // Configuration & Environment
    config,
    properties,
    env,
    debug,
    
    // Actions & Locators
    actions: ActionLoader.actions,
    
    // Utilities
    mask: require('./mask'),
    propertiesHandler: require('./properties-handler')
}; 