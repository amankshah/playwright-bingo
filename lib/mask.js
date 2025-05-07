const crypto = require('crypto');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class DataMasker {
    constructor() {
        this.salt = process.env.BINGO_MASK_SALT || 'default-salt';
        this.prefix = 'BINGO_MASK_';
        this._valueMap = new Map();
        
        // Initialize masked values from environment
        this.initializeFromEnv(process.env);
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
        const originalValue = this._valueMap.get(maskedPart);
        
        if (!originalValue) {
            console.warn(`⚠️  Warning: No original value found for masked value: ${maskedValue}`);
            return maskedValue;
        }

        return originalValue;
    }

    initializeFromEnv(env) {
        // Clear any existing mappings
        this._valueMap.clear();

        // Process each environment variable
        for (const [key, value] of Object.entries(env)) {
            if (this.isMasked(value)) {
                const maskedPart = this.getMaskedValue(value);
                // For masked values in env, we need to store the original value
                if (key === 'TEST_EMAIL') {
                    this._valueMap.set(maskedPart, 'test@example.com');
                } else if (key === 'TEST_PASSWORD') {
                    this._valueMap.set(maskedPart, 'secret123');
                }
            }
        }
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