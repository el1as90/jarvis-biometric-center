/**
 * DASHBOARD UI
 */

class DashboardUI {
    constructor() {
        this.startTime = Date.now();
        this.setupDashboard();
    }
    
    setupDashboard() {
        setInterval(() => this.updateDashboard(), 1000);
    }
    
    updateDashboard() {
        // Update time
        const now = new Date();
        const timeEl = document.getElementById('system-time');
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
        
        const dateEl = document.getElementById('system-date');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
            }).toUpperCase();
        }
        
        // Update uptime
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        const uptimeEl = document.getElementById('uptime');
        if (uptimeEl) {
            uptimeEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
        }
    }
}

const dashboardUI = new DashboardUI();