const { loadActions, loadLocators } = require('../lib/page-loader');

class PageManager {
    constructor(page) {
        this.page = page;
        this._actionInstances = {};
        this._locatorInstances = {};
        this._actions = loadActions();
        this._locators = loadLocators();
    }

    page(name) {
        if (!this._actionInstances[name] && this._actions[name]) {
            this._actionInstances[name] = new this._actions[name](this.page);
        }
        if (!this._locatorInstances[name] && this._locators[name]) {
            this._locatorInstances[name] = new this._locators[name](this.page);
        }
        return {
            actions: this._actionInstances[name],
            locators: this._locatorInstances[name]
        };
    }
}

module.exports = PageManager; 