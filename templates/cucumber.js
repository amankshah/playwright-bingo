// Cucumber.js configuration for test execution
module.exports = {
    default: {
        // Paths to step definitions and support files
        require: ['tests/step-definitions/**/*.js', 'tests/support/**/*.js'],
        // Paths to feature files
        paths: ['tests/features/**/*.feature'],
        // Output formats for test results
        format: [
            'progress-bar',
            ['html', 'reports/cucumber-report.html']
        ],
        // Use async/await in generated snippets
        formatOptions: { 
            snippetInterface: 'async-await'
        }
    }
}; 