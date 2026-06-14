/**
 * SYSTEM MANAGER
 * Manages all system modules and their states
 */

class SystemManager {
    constructor() {
        this.modules = {
            facial: { enabled: true, active: false },
            voice: { enabled: true, active: false },
            gesture: { enabled: true, active: false },
            eye: { enabled: true, active: false },
        };
    }
    
    async initializeModules() {
        // Initialize facial recognition
        const facialInit = await facialRecognition.init();
        if (facialInit) {
            this.updateModuleStatus('facial', 'ready');
        }
        
        // Initialize gesture recognition
        const gestureInit = await gestureRecognition.init();
        if (gestureInit) {
            this.updateModuleStatus('gesture', 'ready');
        }
        
        // Initialize eye tracking
        const eyeInit = await eyeTracking.init();
        if (eyeInit) {
            this.updateModuleStatus('eye', 'ready');
        }
        
        return true;
    }
    
    updateModuleStatus(moduleName, status) {
        const statusEl = document.getElementById(`${moduleName}-status`);
        if (statusEl) {
            statusEl.textContent = status.toUpperCase();
            statusEl.parentElement.parentElement.classList.add('active');
        }
    }
    
    getModuleStatus(moduleName) {
        return this.modules[moduleName];
    }
}

const systemManager = new SystemManager();