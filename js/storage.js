/**
 * STORAGE MANAGEMENT
 */

class StorageManager {
    constructor() {
        this.prefix = CONFIG.STORAGE.PREFIX;
    }
    
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        try {
            const storageKey = this.prefix + key;
            const item = localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    }
    
    remove(key) {
        const storageKey = this.prefix + key;
        localStorage.removeItem(storageKey);
    }
    
    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
    
    getUsers() {
        return this.get(CONFIG.STORAGE.USERS_KEY, []);
    }
    
    saveUsers(users) {
        return this.set(CONFIG.STORAGE.USERS_KEY, users);
    }
    
    getHistory() {
        return this.get(CONFIG.STORAGE.HISTORY_KEY, []);
    }
    
    saveHistory(history) {
        return this.set(CONFIG.STORAGE.HISTORY_KEY, history);
    }
}

const storage = new StorageManager();