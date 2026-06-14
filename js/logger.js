/**
 * EVENT LOGGER
 */

class EventLogger {
    constructor() {
        this.history = storage.getHistory();
    }
    
    log(type, data = {}) {
        const event = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            timestamp: new Date().toISOString(),
            data: data,
        };
        
        this.history.unshift(event);
        
        if (this.history.length > 1000) {
            this.history = this.history.slice(0, 1000);
        }
        
        storage.saveHistory(this.history);
        return event;
    }
    
    logFacialRecognition(userName, confidence, success = true) {
        return this.log('facial', { user: userName, confidence, success });
    }
    
    logVoiceCommand(command, success = true) {
        return this.log('voice', { command, success });
    }
    
    getHistory(filter = null) {
        if (filter) {
            return this.history.filter(e => e.type === filter);
        }
        return this.history;
    }
}

const logger = new EventLogger();