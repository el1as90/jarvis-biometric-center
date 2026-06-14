/**
 * HUD INTERFACE
 */

class HUDInterface {
    constructor() {
        this.radarBlip = null;
        this.setupHUD();
    }
    
    setupHUD() {
        this.radarBlip = document.getElementById('radar-blip');
        this.animateRadar();
    }
    
    animateRadar() {
        setInterval(() => {
            if (!this.radarBlip) return;
            
            const angle = Math.random() * 360;
            const distance = 30 + Math.random() * 30;
            
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            this.radarBlip.style.transform = `translate(${x}px, ${y}px)`;
        }, 2000);
    }
}

const hudInterface = new HUDInterface();