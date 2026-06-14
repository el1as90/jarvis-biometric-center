/**
 * ADVANCED CHARTS - DYNAMIC VISUALIZATION
 */

class AdvancedCharts {
    constructor() {
        this.charts = {};
    }
    
    init() {
        this.createChartsPanel();
        this.updateCharts();
        setInterval(() => this.updateCharts(), 5000);
    }
    
    createChartsPanel() {
        const panel = document.getElementById('statistics');
        if (!panel) return;
        
        panel.innerHTML = `
            <div class="panel-header">
                <h2>SYSTEM STATISTICS & ANALYTICS</h2>
                <div class="panel-controls">
                    <select id="stats-period" class="sort-select">
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>
            
            <div class="stats-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-data">
                            <h3>TOTAL USERS</h3>
                            <p id="stat-total-users" class="stat-value">0</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">✓</div>
                        <div class="stat-data">
                            <h3>SUCCESSFUL RECOGNITIONS</h3>
                            <p id="stat-success-count" class="stat-value">0</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">✗</div>
                        <div class="stat-data">
                            <h3>FAILED RECOGNITIONS</h3>
                            <p id="stat-failed-count" class="stat-value">0</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">🎤</div>
                        <div class="stat-data">
                            <h3>VOICE COMMANDS</h3>
                            <p id="stat-voice-commands" class="stat-value">0</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">👆</div>
                        <div class="stat-data">
                            <h3>GESTURES DETECTED</h3>
                            <p id="stat-gestures" class="stat-value">0</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">👁️</div>
                        <div class="stat-data">
                            <h3>EYE TRACKING EVENTS</h3>
                            <p id="stat-eye-events" class="stat-value">0</p>
                        </div>
                    </div>
                </div>
                
                <div class="charts-container">
                    <div class="chart-wrapper">
                        <h3>RECOGNITION ACCURACY</h3>
                        <canvas id="accuracy-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-wrapper">
                        <h3>MODULE USAGE</h3>
                        <canvas id="usage-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-wrapper">
                        <h3>EVENT DISTRIBUTION</h3>
                        <canvas id="distribution-chart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-wrapper">
                        <h3>ACTIVITY TIMELINE</h3>
                        <canvas id="timeline-chart" width="800" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateCharts() {
        this.updateStats();
        this.drawAccuracyChart();
        this.drawUsageChart();
        this.drawDistributionChart();
        this.drawTimelineChart();
    }
    
    updateStats() {
        const users = storage.getUsers();
        const history = logger.getHistory();
        
        const facial = history.filter(e => e.type === 'facial');
        const successful = facial.filter(e => e.data.success).length;
        const voice = history.filter(e => e.type === 'voice').length;
        const gestures = history.filter(e => e.type === 'gesture').length;
        const eye = history.filter(e => e.type === 'eye').length;
        
        document.getElementById('stat-total-users').textContent = users.length;
        document.getElementById('stat-success-count').textContent = successful;
        document.getElementById('stat-failed-count').textContent = facial.length - successful;
        document.getElementById('stat-voice-commands').textContent = voice;
        document.getElementById('stat-gestures').textContent = gestures;
        document.getElementById('stat-eye-events').textContent = eye;
    }
    
    drawAccuracyChart() {
        const canvas = document.getElementById('accuracy-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const history = logger.getHistory('facial');
        const accuracies = history.slice(0, 10).reverse().map(e => e.data.confidence * 100);
        
        this.drawLineChart(ctx, accuracies, '#00ffc8', canvas.width, canvas.height);
    }
    
    drawUsageChart() {
        const canvas = document.getElementById('usage-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const history = logger.getHistory();
        const data = [
            history.filter(e => e.type === 'facial').length,
            history.filter(e => e.type === 'voice').length,
            history.filter(e => e.type === 'gesture').length,
            history.filter(e => e.type === 'eye').length
        ];
        
        this.drawBarChart(ctx, data, ['Facial', 'Voice', 'Gesture', 'Eye'], canvas.width, canvas.height);
    }
    
    drawDistributionChart() {
        const canvas = document.getElementById('distribution-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const history = logger.getHistory();
        const total = history.length;
        const data = [
            (history.filter(e => e.type === 'facial').length / total) * 100,
            (history.filter(e => e.type === 'voice').length / total) * 100,
            (history.filter(e => e.type === 'gesture').length / total) * 100,
            (history.filter(e => e.type === 'eye').length / total) * 100
        ];
        
        this.drawPieChart(ctx, data, ['Facial', 'Voice', 'Gesture', 'Eye'], canvas.width, canvas.height);
    }
    
    drawTimelineChart() {
        const canvas = document.getElementById('timeline-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 20);
        ctx.lineTo(40, canvas.height - 30);
        ctx.lineTo(canvas.width - 10, canvas.height - 30);
        ctx.stroke();
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.1)';
        for (let i = 0; i < canvas.width - 50; i += 50) {
            ctx.beginPath();
            ctx.moveTo(40 + i, 20);
            ctx.lineTo(40 + i, canvas.height - 30);
            ctx.stroke();
        }
    }
    
    drawLineChart(ctx, data, color, width, height) {
        if (data.length === 0) return;
        
        const maxValue = Math.max(...data, 100);
        const xStep = (width - 60) / (data.length - 1 || 1);
        const yStep = (height - 50) / maxValue;
        
        // Draw line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, i) => {
            const x = 30 + i * xStep;
            const y = height - 30 - value * yStep;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = color;
        data.forEach((value, i) => {
            const x = 30 + i * xStep;
            const y = height - 30 - value * yStep;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawBarChart(ctx, data, labels, width, height) {
        const maxValue = Math.max(...data, 10);
        const barWidth = (width - 60) / data.length;
        const yStep = (height - 50) / maxValue;
        
        data.forEach((value, i) => {
            const x = 30 + i * barWidth + 5;
            const barHeight = value * yStep;
            const y = height - 30 - barHeight;
            
            // Draw bar
            ctx.fillStyle = `rgba(0, ${255 - i * 40}, ${200 - i * 40}, 0.7)`;
            ctx.fillRect(x, y, barWidth - 10, barHeight);
            
            // Draw label
            ctx.fillStyle = 'rgba(0, 255, 200, 0.8)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x + barWidth / 2 - 5, height - 10);
        });
    }
    
    drawPieChart(ctx, data, labels, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        let currentAngle = 0;
        const colors = ['#00ffc8', '#0099ff', '#ff3366', '#ffaa00'];
        
        data.forEach((percentage, i) => {
            const sliceAngle = (percentage / 100) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(percentage)}%`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }
}

const advancedCharts = new AdvancedCharts();