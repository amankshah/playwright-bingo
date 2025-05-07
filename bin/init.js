#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
    'features',
    'pages/actions',
    'pages/locators',
    'step-definitions',
    'support',
    'tests'
  ];

  directories.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

function initializeProject() {
  const templateDir = path.join(__dirname, '..', 'templates');
  const targetDir = process.cwd();

  // Check if target directory is empty
  const files = fs.readdirSync(targetDir);
  if (files.length > 0 && !files.includes('package.json')) {
    console.log('Warning: Target directory is not empty. Skipping initialization.');
    return;
  }

  // Create necessary directories
  createDirectories(targetDir);

  // Copy template files
  copyDir(templateDir, targetDir);

  // Update package.json with required dependencies
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@cucumber/cucumber": "^11.2.0",
      "@playwright/test": "^1.52.0",
      "allure-cucumberjs": "^3.2.1",
      "allure-playwright": "^3.2.1"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  console.log('Project initialized successfully!');
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npx playwright install');
  console.log('3. Start creating your tests using: bingo add page <pagename>');
}

// Only run if this file is being executed directly
if (require.main === module) {
  initializeProject();
}

module.exports = { initializeProject }; 