const env = require('../../lib/env-handler');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Debug function to check environment variables
function debugEnv() {
    console.log('\n🔍 Environment Variables Check:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST_EMAIL:', process.env.TEST_EMAIL);
    console.log('TEST_PASSWORD:', process.env.TEST_PASSWORD);
    console.log('BINGO_MASK_SALT:', process.env.BINGO_MASK_SALT);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Set up environment variables before tests
before(async function() {
    // Debug current environment
    debugEnv();

    // Set up masked values if they don't exist
    if (!process.env.TEST_EMAIL) {
        console.log('⚠️  TEST_EMAIL not found in environment, setting default...');
        process.env.TEST_EMAIL = 'test@example.com';
    }
    if (!process.env.TEST_PASSWORD) {
        console.log('⚠️  TEST_PASSWORD not found in environment, setting default...');
        process.env.TEST_PASSWORD = 'secret123';
    }
    if (!process.env.BINGO_MASK_SALT) {
        console.log('⚠️  BINGO_MASK_SALT not found in environment, setting default...');
        process.env.BINGO_MASK_SALT = 'default-salt';
    }

    // Debug after setup
    debugEnv();
});

// Clean up after tests
after(async function() {
    // You can add cleanup logic here if needed
}); 