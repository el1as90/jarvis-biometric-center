/**
 * EYE TRACKING CALIBRATION
 * Complete eye tracking setup and calibration
 */

class EyeTrackingCalibration {
    constructor() {
        this.calibrationPoints = 9;
        this.currentPoint = 0;
        this.isCalibrating = false;
        this.gazeData = [];
    }
    
    init() {
        this.createPanelHTML();
        this.setupEventListeners();
    }
    
    createPanelHTML() {
        const panel = document.getElementById('eye-tracking');
        panel.innerHTML = `
            <div class="panel-header">
                <h2>EYE TRACKING MODULE</h2>
                <div class="panel-controls">
                    <button id="start-eye-btn" class="action-btn">START CALIBRATION</button>
                    <button id="eye-settings-btn" class="action-btn">SETTINGS</button>
                </div>
            </div>
            
            <div class="eye-content">
                <div class="eye-video">
                    <video id="eye-video" width="800" height="600" playsinline style="display:none;"></video>
                    <canvas id="eye-canvas" width="800" height="600"></canvas>
                    <div id="calibration-overlay" class="calibration-overlay" style="display:none;">
                        <div id="calibration-point" class="calibration-point"></div>
                        <div id="calibration-text" class="calibration-text">Look at the point</div>
                    </div>
                </div>
                
                <div class="eye-stats">
                    <div class="eye-panel">
                        <h3>CALIBRATION STATUS</h3>
                        <div class="calibration-status">
                            <div class="status-row">
                                <label>Status:</label>
                                <span id="calibration-status">IDLE</span>
                            </div>
                            <div class="status-row">
                                <label>Progress:</label>
                                <span id="calibration-progress">0/9</span>
                            </div>
                            <div class="status-row">
                                <label>Accuracy:</label>
                                <span id="calibration-accuracy">0%</span>
                            </div>
                            <div class="status-row">
                                <label>Quality:</label>
                                <span id="tracking-quality">N/A</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="eye-panel">
                        <h3>GAZE ANALYSIS</h3>
                        <div class="gaze-data">
                            <div class="data-row">
                                <label>X Coordinate:</label>
                                <span id="gaze-x">0px</span>
                            </div>
                            <div class="data-row">
                                <label>Y Coordinate:</label>
                                <span id="gaze-y">0px</span>
                            </div>
                            <div class="data-row">
                                <label>Gaze Distance:</label>
                                <span id="gaze-distance">0px</span>
                            </div>
                            <div class="data-row">
                                <label>Dwell Time:</label>
                                <span id="dwell-time">0ms</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="eye-panel">
                        <h3>HEATMAP</h3>
                        <canvas id="heatmap-canvas" width="300" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        document.getElementById('start-eye-btn').addEventListener('click', () => this.startCalibration());
        document.getElementById('eye-settings-btn').addEventListener('click', () => this.showSettings());
    }
    
    async startCalibration() {
        if (this.isCalibrating) {
            this.stopCalibration();
            return;
        }
        
        this.isCalibrating = true;
        this.currentPoint = 0;
        this.gazeData = [];
        
        document.getElementById('start-eye-btn').textContent = 'STOP CALIBRATION';
        document.getElementById('calibration-status').textContent = 'CALIBRATING';
        
        // Show calibration overlay
        document.getElementById('calibration-overlay').style.display = 'flex';
        
        await this.runCalibration();
    }
    
    async runCalibration() {
        const points = this.generateCalibrationPoints(9);
        const overlay = document.getElementById('calibration-overlay');
        const point = document.getElementById('calibration-point');
        const text = document.getElementById('calibration-text');
        
        for (const calibPoint of points) {
            if (!this.isCalibrating) break;
            
            // Position point
            point.style.left = calibPoint.x + 'px';
            point.style.top = calibPoint.y + 'px';
            
            // Wait for user to look at point
            await new Promise(r => setTimeout(r, 1500));
            
            // Record gaze data
            this.recordCalibrationPoint(calibPoint);
            
            this.currentPoint++;
            document.getElementById('calibration-progress').textContent = `${this.currentPoint}/9`;
        }
        
        // Calibration complete
        this.completeCalibration();
    }
    
    generateCalibrationPoints(count) {
        const canvas = document.getElementById('eye-canvas');
        const points = [];
        
        if (count === 9) {
            // 3x3 grid
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    points.push({
                        x: (canvas.width / 4) + (i * canvas.width / 3),
                        y: (canvas.height / 4) + (j * canvas.height / 3)
                    });
                }
            }
        }
        
        return points;
    }
    
    recordCalibrationPoint(point) {
        // Simulate gaze point recording
        const gazePoint = {
            targetX: point.x,
            targetY: point.y,
            gazeX: point.x + (Math.random() - 0.5) * 50,
            gazeY: point.y + (Math.random() - 0.5) * 50,
            timestamp: Date.now()
        };
        
        this.gazeData.push(gazePoint);
    }
    
    completeCalibration() {
        this.isCalibrating = false;
        document.getElementById('start-eye-btn').textContent = 'START CALIBRATION';
        document.getElementById('calibration-status').textContent = 'COMPLETE';
        document.getElementById('calibration-overlay').style.display = 'none';
        
        // Calculate accuracy
        const accuracy = this.calculateAccuracy();
        document.getElementById('calibration-accuracy').textContent = Math.round(accuracy) + '%';
        
        Notification.success('Eye tracking calibration complete');
        
        // Start tracking
        this.startTracking();
    }
    
    calculateAccuracy() {
        if (this.gazeData.length === 0) return 0;
        
        let totalError = 0;
        this.gazeData.forEach(point => {
            const dx = point.gazeX - point.targetX;
            const dy = point.gazeY - point.targetY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            totalError += distance;
        });
        
        const avgError = totalError / this.gazeData.length;
        return Math.max(0, 100 - (avgError / 10));
    }
    
    startTracking() {
        const canvas = document.getElementById('eye-canvas');
        const ctx = canvas.getContext('2d');
        
        const trackingInterval = setInterval(() => {
            if (!this.isCalibrating) {
                // Simulate eye gaze
                const gazeX = Math.random() * canvas.width;
                const gazeY = Math.random() * canvas.height;
                
                // Update display
                document.getElementById('gaze-x').textContent = Math.round(gazeX) + 'px';
                document.getElementById('gaze-y').textContent = Math.round(gazeY) + 'px';
                
                // Draw on canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw gaze point
                ctx.fillStyle = 'rgba(255, 0, 200, 0.8)';
                ctx.beginPath();
                ctx.arc(gazeX, gazeY, 15, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw crosshair
                ctx.strokeStyle = 'rgba(255, 0, 200, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(gazeX - 20, gazeY);
                ctx.lineTo(gazeX + 20, gazeY);
                ctx.moveTo(gazeX, gazeY - 20);
                ctx.lineTo(gazeX, gazeY + 20);
                ctx.stroke();
            }
        }, 100);
    }
    
    stopCalibration() {
        this.isCalibrating = false;
        document.getElementById('start-eye-btn').textContent = 'START CALIBRATION';
        document.getElementById('calibration-status').textContent = 'STOPPED';
        document.getElementById('calibration-overlay').style.display = 'none';
    }
    
    showSettings() {
        Notification.info('Eye tracking settings - Coming soon');
    }
}

const eyeTrackingCalibration = new EyeTrackingCalibration();