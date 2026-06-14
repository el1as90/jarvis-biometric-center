/**
 * JARVIS CONFIGURATION
 * Global configuration for all modules
 */

const CONFIG = {
    // System
    APP_NAME: 'JARVIS',
    APP_VERSION: '1.0.0',
    STARTUP_DURATION: 5000, // ms
    
    // Facial Recognition
    FACIAL: {
        ENABLED: true,
        MIN_CONFIDENCE: 0.5,
        MAX_FACES: 5,
        DETECTION_INTERVAL: 100, // ms
    },
    
    // Voice Recognition
    VOICE: {
        ENABLED: true,
        LANGUAGE: 'en-US',
        CONTINUOUS: true,
        INTERIM_RESULTS: true,
    },
    
    // Gesture Recognition
    GESTURE: {
        ENABLED: true,
        MIN_CONFIDENCE: 0.5,
        DETECTION_INTERVAL: 100, // ms
    },
    
    // Eye Tracking
    EYE: {
        ENABLED: true,
        CALIBRATION_POINTS: 9,
        UPDATE_INTERVAL: 50, // ms
    },
    
    // Storage
    STORAGE: {
        PREFIX: 'jarvis_',
        USERS_KEY: 'users',
        HISTORY_KEY: 'history',
        STATS_KEY: 'statistics',
        SETTINGS_KEY: 'settings',
    },
    
    // UI
    UI: {
        ANIMATION_SPEED: 1,
        EFFECT_INTENSITY: 80,
        THEME: 'dark',
    },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}