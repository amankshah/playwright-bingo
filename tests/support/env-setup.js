const { Before, After } = require('@cucumber/cucumber');
const { env } = require('../../lib/mask');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Debug function to check environment variables
function debugEnv() {
    console.log('\n🔍 Environment Variables Check:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('BINGO_MASK_SALT:', process.env.BINGO_MASK_SALT);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Set up environment variables before tests
Before(async function() {
    // Debug current environment
    // debugEnv();

    // Set up masked values if they don't exist

    if (!process.env.BINGO_MASK_SALT) {
        console.log('⚠️  BINGO_MASK_SALT not found in environment, setting default...');
        process.env.BINGO_MASK_SALT = 'default-salt';
    }

    // Debug after setup
    // debugEnv();
});

// Clean up after tests
After(async function() {
    // You can add cleanup logic here if needed
}); 