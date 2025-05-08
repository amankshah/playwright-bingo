/**
 * Cucumber HTML Report Generator
 * This script generates an HTML report from Cucumber JSON results
 */

const reporter = require('cucumber-html-reporter');

// Report generation options
const options = {
    theme: 'bootstrap',
    jsonFile: './test-results/cucumber-report.json',
    output: './test-results/cucumber-report.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome",
        "Platform": "Windows 10",
        "Parallel": "Scenarios",
        "Executed": "Remote"
    }
};

// Generate the report
reporter.generate(options); 