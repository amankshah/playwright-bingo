module.exports = {
    default: {
        require: ['step-definitions/**/*.js', 'support/**/*.js'],
        paths: ['features/**/*.feature'],
        format: [
            'progress-bar',
            ['html', 'cucumber-report.html']
        ],
        formatOptions: { 
            snippetInterface: 'async-await'
        }
    }
}; 