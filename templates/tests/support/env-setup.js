const { setDefaultTimeout } = require('@cucumber/cucumber');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set default timeout for all steps
setDefaultTimeout(30000);

// Check for required environment variables
if (!process.env.BINGO_MASK_SALT) {
    console.error('❌ Error: BINGO_MASK_SALT environment variable is not set.');
    console.error('This is required for secure data masking.');
    console.error('\nPlease set it in your .env file:');
    console.error('BINGO_MASK_SALT=your-secure-random-salt');
    process.exit(1);
}

// Validate salt strength
if (process.env.BINGO_MASK_SALT.length < 32) {
    console.warn('⚠️  Warning: BINGO_MASK_SALT should be at least 32 characters long for better security.');
    console.warn('Consider using a longer, more random salt.');
} 