const fs = require('fs');
const path = require('path');

function loadModulesFromDir(dir, suffix) {
    const modules = {};
    if (!fs.existsSync(dir)) return modules;
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith(suffix) && file !== 'index.js') {
            const name = file.replace(suffix, '');
            modules[name] = require(path.join(dir, file));
        }
    });
    return modules;
}

function loadActions() {
    return loadModulesFromDir(path.join(process.cwd(), 'pages', 'actions'), '.actions.js');
}

function loadLocators() {
    return loadModulesFromDir(path.join(process.cwd(), 'pages', 'locators'), '.locators.js');
}

module.exports = { loadActions, loadLocators }; 