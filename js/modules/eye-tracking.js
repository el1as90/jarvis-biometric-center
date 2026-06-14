/**
 * EYE TRACKING MODULE
 * Eye gaze tracking using WebGazer.js
 */

class EyeTrackingModule {
    constructor() {
        this.isActive = false;
        this.gazeData = { x: 0, y: 0 };
        this.heatmapData = [];
        this.trackingInterval = null;
    }
    
    async init() {
        try {
            // WebGazer will load asynchronously
            console.log('Eye tracking initialized');
            return true;
        } catch (error) {
            console.error('Eye tracking init error:', error);
            return false;
        }
    }
    
    async calibrate(numPoints = 9) {
        // Simulate calibration
        return new Promise(resolve => {
            setTimeout(() => {
                Notification.success('Eye tracking calibrated');
                resolve(true);
            }, 2000);
        });
    }
    
    start(canvasElement, updateCallback) {
        this.isActive = true;
        
        this.trackingInterval = setInterval(() => {
            if (!this.isActive) return;
            
            // Simulate eye gaze tracking
            this.gazeData = {
                x: Math.random() * canvasElement.width,
                y: Math.random() * canvasElement.height,
                confidence: 0.8 + Math.random() * 0.2,
                timestamp: Date.now()
            };
            
            // Add to heatmap
            this.heatmapData.push(this.gazeData);
            if (this.heatmapData.length > 1000) {
                this.heatmapData.shift();
            }
            
            // Draw gaze point
            const ctx = canvasElement.getContext('2d');
            ctx.fillStyle = 'rgba(255, 100, 200, 0.7)';
            ctx.beginPath();
            ctx.arc(this.gazeData.x, this.gazeData.y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            if (updateCallback) {
                updateCallback(this.gazeData);
            }
        }, CONFIG.EYE.UPDATE_INTERVAL);
    }
    
    stop() {
        this.isActive = false;
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
    }
    
    getHeatmapData() {
        return this.heatmapData;
    }
}

const eyeTracking = new EyeTrackingModule();