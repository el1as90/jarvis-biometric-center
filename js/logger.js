/**
 * EVENT LOGGER
 * Log all system events
 */

class EventLogger {
    constructor() {
        this.history = storage.getHistory();
    }
    
    // Log event
    log(type, data = {}) {
        const event = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            timestamp: new Date().toISOString(),
            data: data,
        };
        
        this.history.unshift(event);
        
        // Keep only last 1000 events
        if (this.history.length > 1000) {
            this.history = this.history.slice(0, 1000);
        }
        
        storage.saveHistory(this.history);
        return event;
    }
    
    // Log facial recognition
    logFacialRecognition(userName, confidence, success = true) {
        return this.log('facial', {
            user: userName,
            confidence: confidence,
            success: success,
        });
    }
    
    // Log voice command
    logVoiceCommand(command, success = true) {
        return this.log('voice', {
            command: command,
            success: success,
        });
    }
    
    // Log gesture
    logGesture(gesture, confidence) {
        return this.log('gesture', {
            gesture: gesture,
            confidence: confidence,
        });
    }
    
    // Log eye tracking
    logEyeTracking(x, y, duration) {
        return this.log('eye', {
            x: x,
            y: y,
            duration: duration,
        });
    }
    
    // Get history
    getHistory(filter = null) {
        if (filter) {
            return this.history.filter(e => e.type === filter);
        }
        return this.history;
    }
    
    // Clear history
    clearHistory() {
        this.history = [];
        storage.saveHistory([]);
    }
}

// Create global instance
const logger = new EventLogger();