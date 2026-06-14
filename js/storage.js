/**
 * STORAGE MANAGEMENT
 * Handle all localStorage operations
 */

class StorageManager {
    constructor() {
        this.prefix = CONFIG.STORAGE.PREFIX;
    }
    
    // Set item
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }
    
    // Get item
    get(key, defaultValue = null) {
        try {
            const storageKey = this.prefix + key;
            const item = localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }
    
    // Remove item
    remove(key) {
        try {
            const storageKey = this.prefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
    
    // Clear all
    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
    
    // Get users
    getUsers() {
        return this.get(CONFIG.STORAGE.USERS_KEY, []);
    }
    
    // Save users
    saveUsers(users) {
        return this.set(CONFIG.STORAGE.USERS_KEY, users);
    }
    
    // Get history
    getHistory() {
        return this.get(CONFIG.STORAGE.HISTORY_KEY, []);
    }
    
    // Save history
    saveHistory(history) {
        return this.set(CONFIG.STORAGE.HISTORY_KEY, history);
    }
    
    // Get statistics
    getStatistics() {
        return this.get(CONFIG.STORAGE.STATS_KEY, {
            recognitions: 0,
            successfulRecognitions: 0,
            failedRecognitions: 0,
            voiceCommands: 0,
            gesturesDetected: 0,
            eyeTrackingEvents: 0,
            sessionStartTime: Date.now(),
        });
    }
    
    // Save statistics
    saveStatistics(stats) {
        return this.set(CONFIG.STORAGE.STATS_KEY, stats);
    }
    
    // Export data
    exportData() {
        return {
            users: this.getUsers(),
            history: this.getHistory(),
            statistics: this.getStatistics(),
            settings: this.get(CONFIG.STORAGE.SETTINGS_KEY, {}),
            exportDate: new Date().toISOString(),
        };
    }
    
    // Import data
    importData(data) {
        try {
            if (data.users) this.saveUsers(data.users);
            if (data.history) this.saveHistory(data.history);
            if (data.statistics) this.saveStatistics(data.statistics);
            if (data.settings) this.set(CONFIG.STORAGE.SETTINGS_KEY, data.settings);
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}

// Create global instance
const storage = new StorageManager();