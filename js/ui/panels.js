/**
 * PANEL MANAGEMENT
 */

class PanelManager {
    constructor() {
        this.currentPanel = 'dashboard';
        this.setupNavigation();
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const panelName = item.getAttribute('data-panel');
                this.showPanel(panelName);
            });
        });
    }
    
    showPanel(panelName) {
        // Hide all panels
        const panels = document.querySelectorAll('.panel');
        panels.forEach(p => p.classList.remove('active'));
        
        // Remove active from nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        // Show selected panel
        const panel = document.getElementById(panelName);
        if (panel) {
            panel.classList.add('active');
        }
        
        // Set active nav item
        const activeNav = document.querySelector(`[data-panel="${panelName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        this.currentPanel = panelName;
    }
}

const panelManager = new PanelManager();