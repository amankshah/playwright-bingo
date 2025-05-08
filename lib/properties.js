const PropertiesReader = require('properties-reader');
const { mask: maskData } = require('./mask');

class Properties {
    constructor() {
        this.properties = null;
        this.maskedProperties = new Map();
    }

    /**
     * Load properties from a .properties file
     * @param {string} filePath - Path to the properties file
     * @param {boolean} maskSensitive - Whether to mask sensitive values
     */
    load(filePath, maskSensitive = true) {
        try {
            this.properties = PropertiesReader(filePath);
            
            // Process all properties for masking
            const allProps = this.properties.getAllProperties();
            Object.entries(allProps).forEach(([key, value]) => {
                if (maskSensitive && this.isSensitiveProperty(key)) {
                    const maskedValue = maskData(value);
                    this.maskedProperties.set(key, maskedValue);
                }
            });
        } catch (error) {
            console.error(`Error loading properties file: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if a property key indicates sensitive data
     * @param {string} key - Property key to check
     * @returns {boolean}
     */
    isSensitiveProperty(key) {
        const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key/i,
            /token/i,
            /credential/i,
            /auth/i
        ];

        return sensitivePatterns.some(pattern => pattern.test(key));
    }

    /**
     * Get a property value
     * @param {string} key - Property key
     * @param {boolean} unmasked - Whether to return the unmasked value
     * @returns {string|undefined}
     */
    get(key, unmasked = false) {
        if (!this.properties) {
            throw new Error('Properties not loaded. Call load() first.');
        }

        const value = this.properties.get(key);
        
        if (unmasked || !this.maskedProperties.has(key)) {
            return value;
        }
        
        return this.maskedProperties.get(key);
    }

    /**
     * Set a property value
     * @param {string} key - Property key
     * @param {string} value - Property value
     * @param {boolean} mask - Whether to mask the value
     */
    set(key, value, mask = false) {
        if (!this.properties) {
            throw new Error('Properties not loaded. Call load() first.');
        }

        this.properties.set(key, value);
        
        if (mask || this.isSensitiveProperty(key)) {
            const maskedValue = maskData(value);
            this.maskedProperties.set(key, maskedValue);
        }
    }

    /**
     * Save properties to a file
     * @param {string} filePath - Path to save the properties file
     * @param {boolean} saveMasked - Whether to save masked values
     */
    save(filePath, saveMasked = true) {
        if (!this.properties) {
            throw new Error('Properties not loaded. Call load() first.');
        }

        const content = [];
        const allProps = this.properties.getAllProperties();
        
        Object.entries(allProps).forEach(([key, value]) => {
            if (saveMasked && this.maskedProperties.has(key)) {
                content.push(`${key}=${this.maskedProperties.get(key)}`);
            } else {
                content.push(`${key}=${value}`);
            }
        });

        require('fs').writeFileSync(filePath, content.join('\n'), 'utf8');
    }
}

module.exports = new Properties(); 