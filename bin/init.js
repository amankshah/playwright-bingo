#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
        copyDir(templateDir, targetDir);

        // Create .env file with random BINGO_MASK_SALT
        ensureEnvFile(targetDir);
        console.log('✓ Created .env file with random BINGO_MASK_SALT');

        // Create default locators and actions
        createDefaultFiles(targetDir);
        console.log('✓ Project files created successfully!');

        // Update package.json with required dependencies
        const packageJsonPath = path.join(targetDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = require(packageJsonPath);
            packageJson.dependencies = {
                ...packageJson.dependencies,
                "@cucumber/cucumber": "^11.2.0",
                "@playwright/test": "^1.52.0",
                "allure-cucumberjs": "^3.2.1",
                "allure-playwright": "^3.2.1",
                "playwright-bingo": "latest"
            };
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        }

        console.log('\n📦 Installing dependencies...');
        require('child_process').execSync('npm install', { stdio: 'inherit' });

        console.log('\n🌐 Installing Playwright browsers...');
        require('child_process').execSync('npx playwright install', { stdio: 'inherit' });

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