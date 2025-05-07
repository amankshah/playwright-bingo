const { test, expect } = require('@playwright/test');
const env = require('../../lib/env-handler');

test('example of using environment variables with automatic masking', async ({ page }) => {
    // Set values directly like process.env
    env.TEST_EMAIL = 'test@example.com';  // Will be automatically masked
    env.TEST_PHONE = '+1234567890';      // Will be automatically masked
    env.REGULAR_VALUE = 'not-sensitive';  // Won't be masked

    // Get values directly like process.env
    const email = env.TEST_EMAIL;         // Will be automatically decrypted
    const phone = env.TEST_PHONE;         // Will be automatically decrypted
    const regular = env.REGULAR_VALUE;    // Will be as is

    // The sensitive values will be automatically decrypted
    console.log('Email:', email);         // Will show original email
    console.log('Phone:', phone);         // Will show original phone
    console.log('Regular:', regular);     // Will show as is

    // Use the values in your test
    await page.fill('#email', email);
    await page.fill('#phone', phone);
    await page.fill('#regular', regular);
});

test('example of using masked values from .env file', async ({ page }) => {
    // Values from .env file will be automatically decrypted
    const email = env.MASKED_EMAIL;       // Will be automatically decrypted
    const phone = env.MASKED_PHONE;       // Will be automatically decrypted
    
    // Use the decrypted values
    await page.fill('#email', email);
    await page.fill('#phone', phone);
}); 