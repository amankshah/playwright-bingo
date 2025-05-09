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
const LocatorManager = require('../pages/locators');
const PageManager = require('../page.manager');
const PropertiesHandler = require('./properties-handler');
const TodoActions = require('../pages/actions/todo.actions');

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
    actions: {
        TodoActions
    },
    
    // Utilities
    mask: require('./mask'),
    propertiesHandler: require('./properties-handler')
}; 