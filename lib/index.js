require('module-alias/register');

const BingoPage = require('./bingo-page');
const config = require('../bingo.config');
const properties = require('./properties');
const { env, debug } = require('./mask');
const LocatorManager = require('../pages/locators');
const PageManager = require('../page.manager');
const PropertiesHandler = require('./properties-handler');
const { TodoActions } = require('../pages/actions');

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
    locators: require('../pages/locators'),
    
    // Utilities
    mask: require('./mask'),
    propertiesHandler: require('./properties-handler')
}; 