/**
 * NOTIFICATION SYSTEM
 */

class Notification {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        const timeout = setTimeout(() => {
            notification.classList.add('notification-removing');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            notification.classList.add('notification-removing');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    static success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }
    
    static error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }
    
    static warning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    }
    
    static info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

const styles = `
    .notifications-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
        padding: 15px 20px;
        border-radius: 4px;
        border-left: 4px solid;
        background: rgba(10, 14, 39, 0.95);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    }
    
    .notification-success {
        border-left-color: #00ff88;
        background: rgba(0, 255, 136, 0.1);
    }
    
    .notification-error {
        border-left-color: #ff3366;
        background: rgba(255, 51, 102, 0.1);
    }
    
    .notification-warning {
        border-left-color: #ffaa00;
        background: rgba(255, 170, 0, 0.1);
    }
    
    .notification-info {
        border-left-color: #0099ff;
        background: rgba(0, 153, 255, 0.1);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0;
    }
    
    .notification-removing {
        animation: slideOutRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;

const styleEl = document.createElement('style');
styleEl.textContent = styles;
if (document.head) document.head.appendChild(styleEl);