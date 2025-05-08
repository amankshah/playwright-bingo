const { properties } = require('../lib');

// Helper function to print section headers
function printSection(title) {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
}

// Load properties from file
printSection('Loading Properties');
try {
    properties.load('./config/application.properties');
    console.log('✅ Properties loaded successfully');
} catch (error) {
    console.error('❌ Error loading properties:', error.message);
    process.exit(1);
}

// Test regular properties
printSection('Regular Properties');
console.log('App Name:', properties.get('app.name'));
console.log('App Version:', properties.get('app.version'));
console.log('DB Host:', properties.get('db.host'));
console.log('DB Port:', properties.get('db.port'));

// Test sensitive properties (masked by default)
printSection('Sensitive Properties (Masked)');
console.log('DB Password:', properties.get('db.password'));
console.log('API Key:', properties.get('api.key'));
console.log('API Secret:', properties.get('api.secret'));

// Test sensitive properties (unmasked)
printSection('Sensitive Properties (Unmasked)');
console.log('DB Password:', properties.get('db.password', true));
console.log('API Key:', properties.get('api.key', true));
console.log('API Secret:', properties.get('api.secret', true));

// Test setting new properties
printSection('Setting New Properties');
try {
    // Set regular property
    properties.set('new.regular', 'regular value');
    console.log('✅ Set regular property:', properties.get('new.regular'));

    // Set sensitive property
    properties.set('new.sensitive', 'sensitive value', true);
    console.log('✅ Set sensitive property (masked):', properties.get('new.sensitive'));
    console.log('✅ Set sensitive property (unmasked):', properties.get('new.sensitive', true));
} catch (error) {
    console.error('❌ Error setting properties:', error.message);
}

// Test saving properties
printSection('Saving Properties');
try {
    const outputFile = './config/application.masked.properties';
    properties.save(outputFile);
    console.log(`✅ Properties saved to ${outputFile}`);
} catch (error) {
    console.error('❌ Error saving properties:', error.message);
}

// Test error handling
printSection('Error Handling');
try {
    // Try to get property before loading
    const newProps = require('../lib/properties');
    newProps.get('some.key');
} catch (error) {
    console.log('✅ Expected error when getting property before loading:', error.message);
}

// Print summary
printSection('Summary');
console.log('Total properties loaded:', Object.keys(properties.properties.getAllProperties()).length);
console.log('Total masked properties:', properties.maskedProperties.size); 