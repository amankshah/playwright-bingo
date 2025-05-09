const path = require('path');
const fs = require('fs');

class LocatorManager {
    constructor() {
        this.locators = {};
        this.loadLocators();
    }

    loadLocators() {
        const projectRoot = this.findProjectRoot();
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
    }

    findProjectRoot() {
        let currentDir = process.cwd();
        while (currentDir !== path.parse(currentDir).root) {
            if (fs.existsSync(path.join(currentDir, 'package.json'))) {
                return currentDir;
            }
            currentDir = path.dirname(currentDir);
        }
        return process.cwd();
    }

    getLocator(name) {
        return this.locators[name];
    }
}

module.exports = new LocatorManager(); 