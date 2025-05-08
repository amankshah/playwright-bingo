#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure random salt
const salt = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated Secure Salt:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(salt);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📝 Usage:');
console.log('1. Add to your .env file:');
console.log(`BINGO_MASK_SALT=${salt}`);
console.log('\n2. Or set as an environment variable:');
console.log(`export BINGO_MASK_SALT=${salt}`);
console.log('\n⚠️  Important:');
console.log('- Keep this salt secure and never commit it to version control');
console.log('- Use the same salt across all environments that need to share masked values');
console.log('- If you lose the salt, you won\'t be able to unmask previously masked values');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'); 