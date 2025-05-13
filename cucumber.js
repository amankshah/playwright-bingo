module.exports = {
    default: {
        require: ['tests/step-definitions/**/*.js', 'tests/support/**/*.js'],
        paths: ['tests/features/**/*.feature'],
        format: [
            'progress-bar',
            'json:reports/cucumber-report.json',
            'html:reports/cucumber-report.html'
            
        ],
        formatOptions: { 
            snippetInterface: 'async-await'
        }
    }
}; 