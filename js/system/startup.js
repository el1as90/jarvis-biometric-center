/**
 * STARTUP SEQUENCE
 */

class Startup {
    constructor() {
        this.progress = 0;
        this.modules = [
            { name: 'INITIALIZING SYSTEM', time: 1000 },
            { name: 'LOADING MODULES', time: 1000 },
            { name: 'CONNECTING DEVICES', time: 1000 },
            { name: 'ACTIVATING SENSORS', time: 1000 },
            { name: 'CALIBRATING BIOMETRICS', time: 1000 }
        ];
    }
    
    async start() {
        const startupScreen = document.getElementById('startup-screen');
        const mainApp = document.getElementById('main-app');
        
        for (let i = 0; i < this.modules.length; i++) {
            await this.updateProgress(i);
        }
        
        // Complete
        this.progress = 100;
        this.updateProgressBar();
        
        await new Promise(r => setTimeout(r, 500));
        
        // Hide startup, show app
        if (startupScreen) startupScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        Notification.success('JARVIS System Online');
    }
    
    async updateProgress(step) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.progress = ((step + 1) / this.modules.length) * 100;
                this.updateProgressBar();
                resolve();
            }, this.modules[step].time);
        });
    }
    
    updateProgressBar() {
        const fill = document.getElementById('startup-progress-fill');
        const percent = document.getElementById('overall-percent');
        
        if (fill) fill.style.width = this.progress + '%';
        if (percent) percent.textContent = Math.round(this.progress) + '%';
    }
}

const startup = new Startup();