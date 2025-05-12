const reporter = require('cucumber-html-reporter');
reporter.generate({
  theme: 'bootstrap',
  jsonFile: './test-results/cucumber-report.json', // Ensure this file exists
  output: './test-results/cucumber-report.html', // Specify the correct output path
  reportSuiteAsScenarios: true
});
