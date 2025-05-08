module.exports = {
    dataMasking: {
        enabled: true,
        properties: {
            autoMask: true,
            sensitiveKeys: [
                'password',
                'secret',
                'key',
                'token',
                'credential',
                'apiKey',
                'auth',
                'private'
            ]
        }
    },
    selfHealing: {
        maxTimeout: 30000,    // Maximum time to wait for element (ms)
        retryInterval: 1000,  // Time between retries (ms)
        maxRetries: 3         // Maximum number of retry attempts
    }
}; 