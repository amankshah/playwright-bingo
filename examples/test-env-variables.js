const { env, mask: maskData, getOriginalValue, debug } = require('../lib/mask');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// Load environment variables
dotenv.config();

async function testEnvVariables() {
    try {
        // Test value
        const value = "aman";
        
        // First mask the value
        const maskedValue = maskData(value);
        console.log('Original value:', value);
        console.log('Masked value:', maskedValue);
        
        // Set it in environment
        process.env.TEST_VALUE = maskedValue;
        
        // Get value through env proxy
        const retrievedValue = env.TEST_VALUE;
        console.log('Retrieved value:', retrievedValue);
        
        // Compare values
        const isMatch = value === retrievedValue;
        console.log('Test result:', isMatch ? '✅ PASS' : '❌ FAIL');
        
        // Show all current mappings
        console.log('\nCurrent mappings:');
        debug();
        
    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

// Run the test
testEnvVariables(); 