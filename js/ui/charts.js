/**
 * CHARTS UI
 */

class ChartManager {
    constructor() {
        this.charts = {};
    }
    
    createChart(canvasId, type, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        // Simple chart drawing without dependencies
        this.drawSimpleChart(ctx, data);
        return canvas;
    }
    
    drawSimpleChart(ctx, data) {
        // Draw axes
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(30, ctx.canvas.height - 30);
        ctx.lineTo(ctx.canvas.width - 10, ctx.canvas.height - 30);
        ctx.stroke();
        
        // Draw simple bars
        if (data && data.length > 0) {
            const barWidth = (ctx.canvas.width - 40) / data.length;
            data.forEach((value, i) => {
                const x = 30 + i * barWidth;
                const height = (value / 100) * (ctx.canvas.height - 40);
                
                ctx.fillStyle = 'rgba(0, 255, 200, 0.7)';
                ctx.fillRect(x + 5, ctx.canvas.height - 30 - height, barWidth - 10, height);
            });
        }
    }
}

const chartManager = new ChartManager();