const properties = require('../lib/properties');

function printSection(title) {
    console.log('\n' + '━'.repeat(50));
    console.log(title);
    console.log('━'.repeat(50));
}

async function testPropertiesMasking() {
    try {
        // Load properties with masking enabled
        printSection('Loading Properties with Masking');
        properties.load('./config/test.properties', true);

        // Test regular properties
        printSection('Regular Properties (Should Not Be Masked)');
        console.log('app.name:', properties.get('app.name'));
        console.log('app.version:', properties.get('app.version'));
        console.log('server.port:', properties.get('server.port'));

        // Test sensitive properties (masked)
        printSection('Sensitive Properties (Should Be Masked)');
        console.log('db.password:', properties.get('db.password'));
        console.log('api.secret:', properties.get('api.secret'));
        console.log('auth.token:', properties.get('auth.token'));
        console.log('user.credential:', properties.get('user.credential'));
        console.log('private.key:', properties.get('private.key'));
        console.log('apiKey:', properties.get('apiKey'));

        // Test getting unmasked values
        printSection('Unmasked Values (For Sensitive Properties)');
        console.log('db.password (unmasked):', properties.get('db.password', true));
        console.log('api.secret (unmasked):', properties.get('api.secret', true));
        console.log('auth.token (unmasked):', properties.get('auth.token', true));

        // Save properties to a new file
        printSection('Saving Properties');
        const outputPath = './config/test.masked.properties';
        properties.save(outputPath, true);
        console.log(`Properties saved to: ${outputPath}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the test
testPropertiesMasking(); 