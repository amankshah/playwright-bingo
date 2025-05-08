const { execSync } = require('child_process');

try {
    execSync('allure generate allure-results --clean', { stdio: 'inherit' });
    console.log('✅ Allure report generated successfully!');
} catch (error) {
    console.error('❌ Error generating Allure report:', error);
    process.exit(1);
} 