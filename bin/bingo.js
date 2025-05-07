#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const [,, cmd, type, oldName, newName] = process.argv;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toClassName(name) {
  return capitalize(name) + (type === 'page' ? '' : capitalize(type));
}

function getProjectRoot() {
  // If we're in a node_modules directory, go up to the project root
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return process.cwd();
}

function addPage(pageName) {
  const projectRoot = getProjectRoot();
  const className = capitalize(pageName) + 'Actions';
  const locatorClassName = capitalize(pageName) + 'Locators';
  const actionsPath = path.join(projectRoot, 'pages', 'actions', `${pageName}.actions.js`);
  const locatorsPath = path.join(projectRoot, 'pages', 'locators', `${pageName}.locators.js`);
  const stepsPath = path.join(projectRoot, 'step-definitions', `${pageName}.steps.js`);

  if (fs.existsSync(actionsPath) || fs.existsSync(locatorsPath) || fs.existsSync(stepsPath)) {
    console.error('Page already exists.');
    process.exit(1);
  }

  const actionsContent = `const ${locatorClassName} = require('../locators/${pageName}.locators');

class ${className} {
    constructor(page) {
        this.page = page;
        this.locators = new ${locatorClassName}(page);
    }
    // Add your page actions here
}

module.exports = ${className};
`;

  const locatorsContent = `class ${locatorClassName} {
    constructor(page) {
        this.page = page;
        // Define your locators here
    }
}

module.exports = ${locatorClassName};
`;

  const stepsContent = `const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PageManager = require('../page.manager');

Given('I am on the ${pageName} page', async function() {
  // TODO: Update the URL for your page
  await this.page.goto('https://your-page-url.com');
  this.pageManager = new PageManager(this.page);
  const { ${pageName}Actions } = this.pageManager;
  this.${pageName} = ${pageName}Actions;
});

// Add your step definitions here
// Example:
// When('I perform some action', async function() {
//   await this.${pageName}.someAction();
// });
`;

  // Ensure directories exist
  fs.mkdirSync(path.dirname(actionsPath), { recursive: true });
  fs.mkdirSync(path.dirname(locatorsPath), { recursive: true });
  fs.mkdirSync(path.dirname(stepsPath), { recursive: true });

  fs.writeFileSync(actionsPath, actionsContent);
  fs.writeFileSync(locatorsPath, locatorsContent);
  fs.writeFileSync(stepsPath, stepsContent);
  console.log(`Page '${pageName}' created with actions, locators, and step definitions.`);
}

function deletePage(pageName) {
  const projectRoot = getProjectRoot();
  const actionsPath = path.join(projectRoot, 'pages', 'actions', `${pageName}.actions.js`);
  const locatorsPath = path.join(projectRoot, 'pages', 'locators', `${pageName}.locators.js`);
  const stepsPath = path.join(projectRoot, 'step-definitions', `${pageName}.steps.js`);

  let deleted = false;
  if (fs.existsSync(actionsPath)) {
    fs.unlinkSync(actionsPath);
    deleted = true;
  }
  if (fs.existsSync(locatorsPath)) {
    fs.unlinkSync(locatorsPath);
    deleted = true;
  }
  if (fs.existsSync(stepsPath)) {
    fs.unlinkSync(stepsPath);
    deleted = true;
  }
  if (deleted) {
    console.log(`Page '${pageName}' deleted.`);
  } else {
    console.error('Page does not exist.');
    process.exit(1);
  }
}

function updatePage(oldPageName, newPageName) {
  const projectRoot = getProjectRoot();
  const oldActionsPath = path.join(projectRoot, 'pages', 'actions', `${oldPageName}.actions.js`);
  const oldLocatorsPath = path.join(projectRoot, 'pages', 'locators', `${oldPageName}.locators.js`);
  const oldStepsPath = path.join(projectRoot, 'step-definitions', `${oldPageName}.steps.js`);
  
  const newActionsPath = path.join(projectRoot, 'pages', 'actions', `${newPageName}.actions.js`);
  const newLocatorsPath = path.join(projectRoot, 'pages', 'locators', `${newPageName}.locators.js`);
  const newStepsPath = path.join(projectRoot, 'step-definitions', `${newPageName}.steps.js`);

  // Check if old files exist
  if (!fs.existsSync(oldActionsPath) || !fs.existsSync(oldLocatorsPath) || !fs.existsSync(oldStepsPath)) {
    console.error('Source page does not exist.');
    process.exit(1);
  }

  // Check if new files already exist
  if (fs.existsSync(newActionsPath) || fs.existsSync(newLocatorsPath) || fs.existsSync(newStepsPath)) {
    console.error('Target page already exists.');
    process.exit(1);
  }

  // Read and update the content of the files
  const oldActionsContent = fs.readFileSync(oldActionsPath, 'utf8');
  const oldLocatorsContent = fs.readFileSync(oldLocatorsPath, 'utf8');
  const oldStepsContent = fs.readFileSync(oldStepsPath, 'utf8');

  const newActionsContent = oldActionsContent
    .replace(new RegExp(oldPageName, 'g'), newPageName)
    .replace(new RegExp(capitalize(oldPageName), 'g'), capitalize(newPageName));

  const newLocatorsContent = oldLocatorsContent
    .replace(new RegExp(capitalize(oldPageName), 'g'), capitalize(newPageName));

  const newStepsContent = oldStepsContent
    .replace(new RegExp(oldPageName, 'g'), newPageName)
    .replace(new RegExp(capitalize(oldPageName), 'g'), capitalize(newPageName));

  // Write the new files
  fs.writeFileSync(newActionsPath, newActionsContent);
  fs.writeFileSync(newLocatorsPath, newLocatorsContent);
  fs.writeFileSync(newStepsPath, newStepsContent);

  // Delete the old files
  fs.unlinkSync(oldActionsPath);
  fs.unlinkSync(oldLocatorsPath);
  fs.unlinkSync(oldStepsPath);

  console.log(`Page '${oldPageName}' updated to '${newPageName}'.`);
}

if (cmd === 'add' && type === 'page' && oldName) {
  addPage(oldName);
} else if (cmd === 'delete' && type === 'page' && oldName) {
  deletePage(oldName);
} else if (cmd === 'update' && type === 'page' && oldName && newName) {
  updatePage(oldName, newName);
} else {
  console.log('Usage: bingo add page <pagename>\n       bingo delete page <pagename>\n       bingo update page <oldpagename> <newpagename>');
  process.exit(1);
} 