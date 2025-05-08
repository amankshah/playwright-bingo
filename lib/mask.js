const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const PropertiesReader = require('properties-reader');

// Load environment variables
dotenv.config();

// Check if we're in CI/CD environment
const isCI = process.env.CI === 'true';

// Simple environment check
if (isCI && (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD)) {
    console.warn('⚠️  Warning: Test credentials not set in CI environment');
}

class DataMasker {
    constructor() {
        // Use a consistent salt from environment or default
        this.salt = process.env.BINGO_MASK_SALT || 'default-salt';
        this.prefix = 'BINGO_MASK_';
        this._valueMap = new Map();
        this.mappingsFile = path.join(process.cwd(), '.bingo-controller.enc');
        
        // Generate encryption key from salt
        this.encryptionKey = crypto.createHash('sha256')
            .update(this.salt)
            .digest('base64')
            .substr(0, 32);
        
        // Load existing mappings
        this.loadMappings();
    }

    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    decrypt(text) {
        const [ivHex, encrypted] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    loadMappings() {
        try {
            if (fs.existsSync(this.mappingsFile)) {
                const encryptedData = fs.readFileSync(this.mappingsFile, 'utf8');
                const decryptedData = this.decrypt(encryptedData);
                const data = JSON.parse(decryptedData);
                this._valueMap = new Map(Object.entries(data));
            }
        } catch (error) {
            console.warn('⚠️  Warning: Could not load mappings file:', error.message);
        }
    }

    saveMappings() {
        try {
            const data = Object.fromEntries(this._valueMap);
            const jsonData = JSON.stringify(data, null, 2);
            const encryptedData = this.encrypt(jsonData);
            fs.writeFileSync(this.mappingsFile, encryptedData);
        } catch (error) {
            console.warn('⚠️  Warning: Could not save mappings file:', error.message);
        }
    }

    mask(data) {
        if (!data) return data;
        
        // Create a hash using the data and salt
        const hash = crypto.createHmac('sha256', this.salt)
            .update(data.toString())
            .digest('hex')
            .substring(0, 8);
            
        const maskedValue = `${this.prefix}${hash}`;
        
        // Store the mapping between masked and original value
        this._valueMap.set(hash, data);
        this.saveMappings();
        
        return maskedValue;
    }

    isMasked(data) {
        return typeof data === 'string' && data.startsWith(this.prefix);
    }

    getMaskedValue(data) {
        if (!this.isMasked(data)) return null;
        return data.substring(this.prefix.length);
    }

    getOriginalValue(maskedValue) {
        if (!this.isMasked(maskedValue)) {
            return maskedValue;
        }

        const maskedPart = this.getMaskedValue(maskedValue);
        
        // Load latest mappings before lookup
        this.loadMappings();
        
        const originalValue = this._valueMap.get(maskedPart);
        
        if (!originalValue) {
            console.warn(`⚠️  Warning: No original value found for masked value: ${maskedValue}`);
            return maskedValue;
        }

        return originalValue;
    }

    debug() {
        console.log('\n🔍 Masked Values Map:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        for (const [masked, original] of this._valueMap.entries()) {
            console.log(`Masked: ${this.prefix}${masked}`);
            console.log(`Original: ${original}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
    }
}

// Create a single instance
const dataMasker = new DataMasker();

// Create a proxy for process.env
const envProxy = new Proxy(process.env, {
    get(target, prop) {
        const value = target[prop];
        
        if (value === undefined) {
            return undefined;
        }

        // Check if the value is masked
        if (dataMasker.isMasked(value)) {
            return dataMasker.getOriginalValue(value);
        }

        return value;
    },
    set(target, prop, value) {
        // If the value is already masked, store it as is
        if (dataMasker.isMasked(value)) {
            target[prop] = value;
            return true;
        }

        // If the value contains sensitive data, mask it
        if (isSensitiveData(value)) {
            console.log(`🔒 Detected sensitive data for ${prop}, masking...`);
            target[prop] = dataMasker.mask(value);
            return true;
        }

        target[prop] = value;
        return true;
    }
});

function isSensitiveData(value) {
    if (!value) return false;

    // Add patterns for sensitive data
    const sensitivePatterns = [
        // Email patterns
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Standard email
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, // Alternative email
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\.[A-Za-z]{2,}$/, // Email with subdomain
        
        // Credit Card patterns
        /^\d{16}$/, // 16-digit credit card
        /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/, // Credit card with spaces/dashes
        
        // Phone patterns
        /^\+?[\d\s-]{10,}$/, // International phone
        /^\d{3}[- ]?\d{3}[- ]?\d{4}$/, // US phone format
        
        // Social Security Number
        /^\d{3}[- ]?\d{2}[- ]?\d{4}$/, // SSN format
        
        // API Keys
        /^(sk|pk)_(test|live)_[a-zA-Z0-9]{24}$/, // Stripe-like API keys
        /^[a-zA-Z0-9]{32}$/, // 32-character API key
        
        // Passwords (basic check)
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, // Strong password pattern
        
        // Database credentials
        /^(mongodb|postgresql|mysql):\/\/[^:]+:[^@]+@/, // Database URLs
        
        // JWT tokens
        /^ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, // JWT format
    ];

    return sensitivePatterns.some(pattern => pattern.test(value));
}

// Export both the masker and the env proxy
module.exports = {
    mask: dataMasker.mask.bind(dataMasker),
    isMasked: dataMasker.isMasked.bind(dataMasker),
    getOriginalValue: dataMasker.getOriginalValue.bind(dataMasker),
    debug: dataMasker.debug.bind(dataMasker),
    env: envProxy
}; 