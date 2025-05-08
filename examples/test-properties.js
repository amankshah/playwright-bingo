const { properties } = require('../lib');
const path = require('path');

function printSection(title) {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
}

async function testProperties() {
    try {
        // Load properties from file
        printSection('Loading Properties');
        const propertiesPath = path.join(__dirname, 'test.properties');
        const maskedPropertiesPath = path.join(__dirname, 'test.masked.properties');
        properties.load(propertiesPath, true);
        console.log('Properties loaded successfully');

        // Test sensitive properties
        printSection('Testing Sensitive Properties');
        const sensitiveProps = ['db.password', 'api.key', 'api.secret', 'smtp.password'];
        for (const prop of sensitiveProps) {
            const value = properties.get(prop);
            const unmaskedValue = properties.get(prop, true);
            console.log(`${prop}:`);
            console.log(`  Masked: ${value}`);
            console.log(`  Unmasked: ${unmaskedValue}`);
            console.log(`  Is masked: ${value !== unmaskedValue ? '✅ Yes' : '❌ No'}`);
        }

        // Test non-sensitive properties
        printSection('Testing Non-Sensitive Properties');
        const nonSensitiveProps = ['db.host', 'db.port', 'app.name', 'app.version'];
        for (const prop of nonSensitiveProps) {
            const value = properties.get(prop);
            const unmaskedValue = properties.get(prop, true);
            console.log(`${prop}:`);
            console.log(`  Value: ${value}`);
            console.log(`  Is masked: ${value !== unmaskedValue ? '❌ Yes' : '✅ No'}`);
        }

        // Test updating a property
        printSection('Testing Property Update');
        const newPassword = 'newSecurePass456!';
        properties.set('db.password', newPassword, true);
        const updatedValue = properties.get('db.password');
        const updatedUnmasked = properties.get('db.password', true);
        console.log('Updated db.password:');
        console.log(`  Masked: ${updatedValue}`);
        console.log(`  Unmasked: ${updatedUnmasked}`);
        console.log(`  Matches new value: ${updatedUnmasked === newPassword ? '✅ Yes' : '❌ No'}`);

        // Test getting all properties
        printSection('All Properties');
        const allProps = properties.properties.getAllProperties();
        Object.entries(allProps).forEach(([key, value]) => {
            const maskedValue = properties.get(key);
            console.log(`${key}:`);
            console.log(`  Original: ${value}`);
            console.log(`  Masked: ${maskedValue}`);
        });

        // Save masked properties to file
        printSection('Saving Masked Properties');
        properties.save(maskedPropertiesPath, true);
        console.log(`Masked properties saved to: ${maskedPropertiesPath}`);

        // Print the contents of the masked properties file
        printSection('Masked Properties File Contents');
        const fs = require('fs');
        const maskedFileContents = fs.readFileSync(maskedPropertiesPath, 'utf8');
        console.log(maskedFileContents);

    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

testProperties(); 