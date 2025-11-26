// API Configuration
// Automatically detects environment and uses appropriate backend URL

const API_CONFIG = {
    // IMPORTANT: Replace 'YOUR-SERVICE-NAME' with your actual Render service name
    // Example: if your Render service is at finallayer-backend.onrender.com
    // then use: 'https://finallayer-backend.onrender.com'
    PRODUCTION_URL: 'https://ai-powered-prompt-engineering-backend.onrender.com/',

    // Local development URL
    LOCAL_URL: 'http://127.0.0.1:8000',

    // Auto-detect environment
    getBaseURL() {
        // Check if running on localhost or local IP
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '';

        return isLocal ? this.LOCAL_URL : this.PRODUCTION_URL;
    }
};

// Export the base URL
const API_BASE_URL = API_CONFIG.getBaseURL();

console.log('🔗 API Configuration:', {
    environment: window.location.hostname === 'localhost' ? 'Local' : 'Production',
    apiUrl: API_BASE_URL
});
