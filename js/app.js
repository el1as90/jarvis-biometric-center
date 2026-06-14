/**
 * MAIN APPLICATION
 * Initialize and run JARVIS system
 */

class JARVISApp {
    constructor() {
        this.startup = startup;
        this.panelManager = panelManager;
        this.systemManager = systemManager;
    }
    
    async init() {
        console.log('JARVIS System Initializing...');
        
        // Start startup sequence
        await this.startup.start();
        
        // Initialize modules
        await this.systemManager.initializeModules();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load saved data
        this.loadSavedData();
        
        console.log('JARVIS System Ready');
    }
    
    setupEventListeners() {
        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            });
        }
        
        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.panelManager.showPanel('settings');
            });
        }
        
        // Register user button
        const registerBtn = document.getElementById('register-face-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.openRegisterModal());
        }
    }
    
    openRegisterModal() {
        const modal = document.getElementById('register-modal');
        const backdrop = document.getElementById('modal-backdrop');
        
        if (modal && backdrop) {
            modal.classList.remove('hidden');
            backdrop.classList.remove('hidden');
        }
    }
    
    loadSavedData() {
        const users = storage.getUsers();
        console.log(`Loaded ${users.length} registered users`);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new JARVISApp();
        app.init();
    });
} else {
    const app = new JARVISApp();
    app.init();
}