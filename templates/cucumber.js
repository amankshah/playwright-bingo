module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['step-definitions/**/*.js', 'support/**/*.js'],
        paths: ['features/**/*.feature'],
        format: [
            'progress-bar',
            'html:cucumber-report.html',
            'allure-cucumberjs'
        ],
        parallel: 2
    }
}; 