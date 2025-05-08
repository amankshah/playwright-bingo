const { env, mask: maskData, getOriginalValue, debug } = require('../lib/mask');
const dotenv = require('dotenv');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function printSection(title) {
    console.log('\n' + '━'.repeat(50));
    console.log(title);
    console.log('━'.repeat(50));
}

async function testEnvDecryption() {
    try {
        // Test different types of sensitive data
        const testCases = [
            { name: 'Email', value: 'test@example.com' },
            { name: 'Password', value: 'SecurePass123!' },
            { name: 'API Key', value: 'sk_test_1234567890abcdef' },
            { name: 'Phone', value: '+1-555-123-4567' },
            { name: 'Custom Value', value: 'amanshah' }
        ];

        printSection('Test Setup');
        console.log('Testing multiple types of sensitive data:');
        testCases.forEach(tc => console.log(`- ${tc.name}: ${tc.value}`));

        // Test each case
        for (const tc of testCases) {
            printSection(`Testing ${tc.name}`);
            
            // 1. Mask the value
            const maskedValue = maskData(tc.value);
            console.log('Original:', tc.value);
            console.log('Masked:', maskedValue);

            // 2. Test bingo unmask command
            printSection(`1. Testing bingo unmask for ${tc.name}`);
            const bingoUnmaskOutput = execSync(`bingo unmask ${maskedValue}`, { encoding: 'utf8' });
            console.log(bingoUnmaskOutput);
            const bingoValue = bingoUnmaskOutput.match(/Original:\s+(.+)/)?.[1]?.trim();
            console.log('Value matches expected?', bingoValue === tc.value ? '✅ Yes' : '❌ No');

            // 3. Test env proxy
            printSection(`2. Testing env proxy for ${tc.name}`);
            process.env[`TEST_${tc.name.toUpperCase()}`] = maskedValue;
            const proxyValue = env[`TEST_${tc.name.toUpperCase()}`];
            console.log('Value from env proxy:', proxyValue);
            console.log('Value matches expected?', proxyValue === tc.value ? '✅ Yes' : '❌ No');

            // 4. Test getOriginalValue
            printSection(`3. Testing getOriginalValue for ${tc.name}`);
            const originalValue = getOriginalValue(maskedValue);
            console.log('Value from getOriginalValue:', originalValue);
            console.log('Value matches expected?', originalValue === tc.value ? '✅ Yes' : '❌ No');

            // 5. Verify consistency
            const allMatch = [bingoValue, proxyValue, originalValue]
                .every(val => val === tc.value);
            
            if (allMatch) {
                console.log('✅ SUCCESS: All methods return the correct value');
            } else {
                console.log('❌ ERROR: Inconsistent values detected');
                console.log('Expected:', tc.value);
                console.log('bingo unmask:', bingoValue);
                console.log('env proxy:', proxyValue);
                console.log('getOriginalValue:', originalValue);
            }
        }

        // Test error cases
        printSection('Testing Error Cases');
        
        // 1. Test unmasking non-masked value
        console.log('\n1. Testing unmasking non-masked value:');
        const nonMaskedValue = 'plain-text';
        const nonMaskedResult = getOriginalValue(nonMaskedValue);
        console.log('Input:', nonMaskedValue);
        console.log('Result:', nonMaskedResult);
        console.log('Correct?', nonMaskedResult === nonMaskedValue ? '✅ Yes' : '❌ No');

        // 2. Test unmasking invalid masked value
        console.log('\n2. Testing unmasking invalid masked value:');
        const invalidMasked = 'BINGO_MASK_invalid';
        const invalidResult = getOriginalValue(invalidMasked);
        console.log('Input:', invalidMasked);
        console.log('Result:', invalidResult);
        console.log('Correct?', invalidResult === invalidMasked ? '✅ Yes' : '❌ No');

        // Show all current mappings
        printSection('Current Mappings');
        debug();

    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

// Run the test
testEnvDecryption(); 