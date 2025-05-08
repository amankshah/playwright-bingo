module.exports = {
    default: {
        requireModule: [],
        require: ['features/**/*.js', 'step-definitions/**/*.js'],
        paths: ['features/**/*.feature'],
        format: ['progress-bar', 'html:cucumber-report.html'],
        parallel: 2
    }
}; 