#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { initializeProject } = require('./init');
const { mask: maskData, env, getOriginalValue } = require('../lib/mask');
const dotenv = require('dotenv');
const fsExtra = require('fs-extra');
const chalk = require('chalk');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Security check for BINGO_MASK_SALT
if (!process.env.BINGO_MASK_SALT) {
    console.error('❌ Error: BINGO_MASK_SALT environment variable is not set.');
    console.error('This is required for secure data masking.');
    console.error('\nPlease set it in your .env file:');
    console.error('BINGO_MASK_SALT=your-secure-random-salt');
    console.error('\nOr set it as an environment variable:');
    console.error('export BINGO_MASK_SALT=your-secure-random-salt');
    process.exit(1);
}

// Validate salt strength
if (process.env.BINGO_MASK_SALT.length < 32) {
    console.warn('⚠️  Warning: BINGO_MASK_SALT should be at least 32 characters long for better security.');
    console.warn('Consider using a longer, more random salt.');
}

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
  const stepsPath = path.join(projectRoot, 'tests', 'step-definitions', `${pageName}.steps.js`);
  const actionsIndexPath = path.join(projectRoot, 'pages', 'actions', 'index.js');
  const locatorsIndexPath = path.join(projectRoot, 'pages', 'locators', 'index.js');

  if (fs.existsSync(actionsPath) || fs.existsSync(locatorsPath) || fs.existsSync(stepsPath)) {
    console.error('Page already exists.');
    process.exit(1);
  }

  const actionsContent = `const { expect } = require('@playwright/test');
const LocatorManager = require('../locators');

class ${className} {
    constructor(bingoPage) {
        this.bingoPage = bingoPage;
        const locatorManager = new LocatorManager(bingoPage.page);
        this.${pageName} = locatorManager.${pageName};
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
const { LocatorManager, PageManager, env, debug } = require('playwright-bingo');

Given('I am on the ${pageName} page', async function() {
    // Initialize page manager
    this.pageManager = new PageManager(this.bingoPage);
    // Navigate to page
    await this.pageManager.${pageName}.navigateTo${capitalize(pageName)}Page();
});

// Add your step definitions here
// Example:
// When('I perform some action', async function() {
//   await this.pageManager.${pageName}.someAction();
// });
`;

  // Ensure directories exist
  fs.mkdirSync(path.dirname(actionsPath), { recursive: true });
  fs.mkdirSync(path.dirname(locatorsPath), { recursive: true });
  fs.mkdirSync(path.dirname(stepsPath), { recursive: true });

  // Create the files
  fs.writeFileSync(actionsPath, actionsContent);
  fs.writeFileSync(locatorsPath, locatorsContent);
  fs.writeFileSync(stepsPath, stepsContent);

  // Update actions index.js
  if (fs.existsSync(actionsIndexPath)) {
    let actionsIndexContent = fs.readFileSync(actionsIndexPath, 'utf8');
    if (!actionsIndexContent.includes(`const ${className}`)) {
      actionsIndexContent = actionsIndexContent.replace(
        'module.exports = {',
        `const ${className} = require('./${pageName}.actions');\n\nmodule.exports = {`
      );
      actionsIndexContent = actionsIndexContent.replace(
        '};',
        `    ${className},\n};`
      );
      fs.writeFileSync(actionsIndexPath, actionsIndexContent);
    }
  } else {
    fs.writeFileSync(actionsIndexPath, `const ${className} = require('./${pageName}.actions');\n\nmodule.exports = {\n    ${className}\n};`);
  }

  // Update locators index.js
  if (fs.existsSync(locatorsIndexPath)) {
    let locatorsIndexContent = fs.readFileSync(locatorsIndexPath, 'utf8');
    if (!locatorsIndexContent.includes(`const ${locatorClassName}`)) {
      locatorsIndexContent = locatorsIndexContent.replace(
        'class LocatorManager {',
        `const ${locatorClassName} = require('./${pageName}.locators');\n\nclass LocatorManager {`
      );
      locatorsIndexContent = locatorsIndexContent.replace(
        'constructor(page) {',
        `constructor(page) {\n        this.${pageName} = new ${locatorClassName}(page);`
      );
      locatorsIndexContent = locatorsIndexContent.replace(
        'getAllLocators() {',
        `getAllLocators() {\n        return {\n            ${pageName}: this.${pageName},\n            ...this.getAllLocators()\n        };`
      );
      fs.writeFileSync(locatorsIndexPath, locatorsIndexContent);
    }
  } else {
    fs.writeFileSync(locatorsIndexPath, `const ${locatorClassName} = require('./${pageName}.locators');\n\nclass LocatorManager {\n    constructor(page) {\n        this.page = page;\n        this.${pageName} = new ${locatorClassName}(page);\n    }\n\n    getAllLocators() {\n        return {\n            ${pageName}: this.${pageName}\n        };\n    }\n}\n\nmodule.exports = LocatorManager;`);
  }

  console.log(`Page '${pageName}' created with actions, locators, and step definitions.`);
  console.log('Updated index files in actions and locators directories.');
}

function deletePage(pageName) {
  const projectRoot = getProjectRoot();
  const actionsPath = path.join(projectRoot, 'pages', 'actions', `${pageName}.actions.js`);
  const locatorsPath = path.join(projectRoot, 'pages', 'locators', `${pageName}.locators.js`);
  const stepsPath = path.join(projectRoot, 'tests', 'step-definitions', `${pageName}.steps.js`);

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
  const oldStepsPath = path.join(projectRoot, 'tests', 'step-definitions', `${oldPageName}.steps.js`);
  
  const newActionsPath = path.join(projectRoot, 'pages', 'actions', `${newPageName}.actions.js`);
  const newLocatorsPath = path.join(projectRoot, 'pages', 'locators', `${newPageName}.locators.js`);
  const newStepsPath = path.join(projectRoot, 'tests', 'step-definitions', `${newPageName}.steps.js`);

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

function handleMaskData(value) {
    if (!value) {
        console.error('❌ Error: No value provided to mask');
        return;
    }

    // Mask the value using our mask function
    const masked = maskData(value);
    
    console.log('\n🔒 Masked Value:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Original:', value);
    console.log('Masked:  ', masked);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
   
}

// Function to generate random salt
function generateRandomSalt(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

program
    .name('bingo')
    .description('CLI for Playwright Bingo framework')
    .version('1.0.2');

program
    .command('init')
    .description('Initialize a new Playwright Bingo project')
    .action(async () => {
        try {
            const templateDir = path.join(__dirname, '../templates');
            const currentDir = process.cwd();

            console.log(chalk.blue('🚀 Initializing Playwright Bingo project...'));

            // Copy all template files
            await fsExtra.copy(templateDir, currentDir);

            // Create bingo.config.js if it doesn't exist
            const configPath = path.join(currentDir, 'bingo.config.js');
            if (!fs.existsSync(configPath)) {
                await fsExtra.copy(
                    path.join(templateDir, 'bingo.config.js'),
                    configPath
                );
            }

            // Create .env file with random salt
            const envPath = path.join(currentDir, '.env');
            const randomSalt = generateRandomSalt();
            await fs.writeFile(envPath, `BINGO_MASK_SALT=${randomSalt}\n`);

            console.log(chalk.green('✓ Project files created successfully!'));

            // Install dependencies
            console.log(chalk.blue('\n📦 Installing dependencies...'));
            execSync('npm install', { stdio: 'inherit' });

            // Install Playwright browsers
            console.log(chalk.blue('\n🌐 Installing Playwright browsers...'));
            execSync('npx playwright install', { stdio: 'inherit' });

            console.log(chalk.green('\n✨ Project setup completed successfully!'));
            console.log(chalk.yellow('\n🎯 Next steps:'));
            console.log('1. Review your .env file for the generated BINGO_MASK_SALT');
            console.log('2. Start writing your tests in the features directory');
            console.log('3. Run your tests with: npm test');
            console.log('\n🎮 Happy and Easy testing with Bingo! 🎲');
            console.log(chalk.cyan('   Documentation: https://playwright-bingo.netlify.app/'));
        } catch (error) {
            console.error(chalk.red('❌ Error initializing project:'), error);
            process.exit(1);
        }
    });

program
    .command('add')
    .description('Add a new component')
    .addCommand(new program.Command('page')
        .description('Add a new page')
        .argument('<name>', 'name of the page')
        .action((name) => {
            addPage(name);
        }))
    .addCommand(new program.Command('action')
        .description('Add a new action')
        .argument('<page>', 'name of the page')
        .argument('<name>', 'name of the action')
        .action((page, name) => {
            // Implementation for adding an action
            console.log(`Adding action ${name} to page ${page}`);
        }))
    .addCommand(new program.Command('locator')
        .description('Add a new locator')
        .argument('<page>', 'name of the page')
        .argument('<name>', 'name of the locator')
        .action((page, name) => {
            // Implementation for adding a locator
            console.log(`Adding locator ${name} to page ${page}`);
        }));

program
    .command('update')
    .description('Update a component')
    .addCommand(new program.Command('page')
        .description('Update a page name')
        .argument('<oldName>', 'current name of the page')
        .argument('<newName>', 'new name for the page')
        .action((oldName, newName) => {
            updatePage(oldName, newName);
        }));

program
    .command('delete')
    .description('Delete a component')
    .addCommand(new program.Command('page')
        .description('Delete a page')
        .argument('<name>', 'name of the page')
        .action((name) => {
            deletePage(name);
        }));

program
    .command('mask')
    .description('Mask sensitive data')
    .argument('<data>', 'data to mask')
    .action((data) => {
        handleMaskData(data);
    });

program
    .command('unmask')
    .description('Unmask a masked value')
    .argument('<maskedValue>', 'masked value to unmask')
    .action((maskedValue) => {
        if (!maskedValue) {
            console.error('❌ Error: No masked value provided');
            return;
        }

        try {
            const originalValue = getOriginalValue(maskedValue);
            
            console.log('\n🔓 Unmasked Value:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Masked:   ', maskedValue);
            console.log('Original: ', originalValue);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        } catch (error) {
            console.error('❌ Error:', error.message);
            console.log('\n💡 Tip: Make sure you\'re using the same BINGO_MASK_SALT that was used to mask the value.');
        }
    });

program.parse(process.argv); 