#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function generateRandomSalt() {
    return crypto.randomBytes(32).toString('base64');
}

function copyDir(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursively copy subdirectories
            copyDir(srcPath, destPath);
        } else {
            // Copy files
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function createDirectories(projectRoot) {
    const directories = [
        'tests/features',
        'tests/step-definitions',
        'tests/support',
        'pages/actions',
        'pages/locators'
    ];

    directories.forEach(dir => {
        const dirPath = path.join(projectRoot, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });
}

function ensureEnvFile(projectRoot) {
    const envPath = path.join(projectRoot, '.env');
    if (!fs.existsSync(envPath)) {
        const salt = generateRandomSalt();
        fs.writeFileSync(envPath, `BINGO_MASK_SALT=${salt}\nBASE_URL=http://localhost:3000\n`);
    }
}

function createDefaultFiles(projectRoot) {
    // Create default locator file
    const defaultLocatorContent = `module.exports = {
    'todo.input': '[data-test="todo-input"]',
    'todo.item': '[data-test="todo-item"]',
    'todo.checkbox': '[data-test="todo-checkbox"]',
    'todo.delete': '[data-test="todo-delete"]',
    'todo.text': '[data-test="todo-text"]'
};`;
    fs.writeFileSync(
        path.join(projectRoot, 'pages', 'locators', 'todo.locators.js'),
        defaultLocatorContent
    );

    // Create default action file
    const defaultActionContent = `const { BingoPage } = require('playwright-bingo');

class TodoActions extends BingoPage {
    constructor() {
        super();
    }

    async addTodo(text) {
        await this.type('todo.input', text);
        await this.press('todo.input', 'Enter');
    }

    async completeTodo(index) {
        await this.click(\`todo.checkbox[\${index}]\`);
    }

    async deleteTodo(index) {
        await this.click(\`todo.delete[\${index}]\`);
    }

    async getTodoText(index) {
        return await this.getText(\`todo.text[\${index}]\`);
    }

    async getTodoCount() {
        return await this.count('todo.item');
    }
}

module.exports = new TodoActions();`;
    fs.writeFileSync(
        path.join(projectRoot, 'pages', 'actions', 'todo.actions.js'),
        defaultActionContent
    );
}

function createPackageJson(projectRoot) {
    const packageJson = {
        "name": "playwright-bingo-project",
        "version": "1.0.0",
        "description": "Playwright Bingo Test Project",
        "scripts": {
            "test": "cucumber-js",
            "test:report": "cucumber-js --format @cucumber/pretty-formatter --format allure-cucumberjs"
        },
        "dependencies": {
            "@cucumber/cucumber": "^11.2.0",
            "@playwright/test": "^1.52.0",
            "allure-cucumberjs": "^3.2.1",
            "allure-playwright": "^3.2.1",
            "playwright-bingo": "^1.0.17"
        }
    };

    fs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
}

function initializeProject() {
    try {
        console.log('🚀 Initializing Playwright Bingo project...');
        const templateDir = path.join(__dirname, '..', 'templates');
        const targetDir = process.cwd();

        // Check if target directory is empty
        const files = fs.readdirSync(targetDir);
        if (files.length > 0 && !files.includes('package.json')) {
            console.error('❌ Error: Target directory is not empty. Please initialize in an empty directory or a directory with package.json.');
            process.exit(1);
        }

        // Create necessary directories
        createDirectories(targetDir);

        // Copy template files
        if (!fs.existsSync(templateDir)) {
            console.error('❌ Error: Template directory not found. Please ensure playwright-bingo is properly installed.');
            process.exit(1);
        }
        copyDir(templateDir, targetDir);

        // Create .env file with random BINGO_MASK_SALT
        ensureEnvFile(targetDir);
        console.log('✓ Created .env file with random BINGO_MASK_SALT');

        // Create default locators and actions
        createDefaultFiles(targetDir);
        console.log('✓ Project files created successfully!');

        // Create or update package.json
        if (!fs.existsSync(path.join(targetDir, 'package.json'))) {
            createPackageJson(targetDir);
            console.log('✓ Created package.json');
        }

        console.log('\n📦 Installing dependencies...');
        try {
            execSync('npm install', { stdio: 'inherit' });
        } catch (error) {
            console.error('\n⚠️ Warning: Failed to install dependencies automatically.');
            console.log('Please run the following commands manually:');
            console.log('npm install');
            console.log('npx playwright install');
        }

        console.log('\n🌐 Installing Playwright browsers...');
        try {
            execSync('npx playwright install', { stdio: 'inherit' });
        } catch (error) {
            console.error('\n⚠️ Warning: Failed to install Playwright browsers automatically.');
            console.log('Please run the following command manually:');
            console.log('npx playwright install');
        }

        console.log('\n✨ Project setup completed successfully!');
        console.log('\n🎯 Next steps:');
        console.log('1. Review your .env file for the generated BINGO_MASK_SALT');
        console.log('2. Start writing your tests in the features directory');
        console.log('3. Run your tests with: npm test');
        console.log('\n🎮 Happy and Easy testing with Bingo! 🎲');
        console.log('   Documentation: https://playwright-bingo.netlify.app/');

    } catch (error) {
        console.error('❌ Error initializing project:', error);
        process.exit(1);
    }
}

// Only run if this file is being executed directly
if (require.main === module) {
    initializeProject();
}

module.exports = { initializeProject }; 