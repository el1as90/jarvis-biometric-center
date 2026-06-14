/**
 * COMPLETE TERMINAL WITH FULL COMMAND SUPPORT
 */

class CompleteTerminal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.setupTerminal();
    }
    
    setupTerminal() {
        const input = document.getElementById('terminal-input');
        if (!input) return;
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(input.value);
                input.value = '';
            }
        });
        
        // Arrow keys for history
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
                input.value = this.commandHistory[this.historyIndex] || '';
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.historyIndex = Math.max(this.historyIndex - 1, -1);
                input.value = this.commandHistory[this.historyIndex] || '';
            }
        });
        
        // Clear button
        const clearBtn = document.getElementById('clear-terminal-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearTerminal());
        }
    }
    
    executeCommand(command) {
        const output = document.getElementById('terminal-output');
        if (!output) return;
        
        // Add command to history
        if (command.trim()) {
            this.commandHistory.unshift(command);
            this.historyIndex = -1;
        }
        
        // Display command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="prompt">$</span><span class="text">${this.escapeHtml(command)}</span>`;
        output.appendChild(cmdLine);
        
        // Process command
        const response = this.processCommand(command);
        
        // Display response
        if (Array.isArray(response)) {
            response.forEach(line => {
                const respLine = document.createElement('div');
                respLine.className = 'terminal-line';
                respLine.innerHTML = `<span class="text">${line}</span>`;
                output.appendChild(respLine);
            });
        } else {
            const respLine = document.createElement('div');
            respLine.className = 'terminal-line';
            respLine.innerHTML = `<span class="text">${response}</span>`;
            output.appendChild(respLine);
        }
        
        output.scrollTop = output.scrollHeight;
    }
    
    processCommand(cmd) {
        const args = cmd.trim().split(' ');
        const command = args[0].toLowerCase();
        
        switch(command) {
            case 'help':
                return this.cmdHelp(args);
            case 'status':
                return this.cmdStatus();
            case 'users':
                return this.cmdUsers();
            case 'history':
                return this.cmdHistory(args);
            case 'stats':
                return this.cmdStats();
            case 'clear':
                return this.cmdClear();
            case 'facial':
                return this.cmdFacial(args);
            case 'voice':
                return this.cmdVoice(args);
            case 'gesture':
                return this.cmdGesture(args);
            case 'eye':
                return this.cmdEye(args);
            case 'echo':
                return args.slice(1).join(' ');
            case 'time':
                return new Date().toString();
            case 'uptime':
                return this.cmdUptime();
            case 'export':
                return this.cmdExport();
            case 'demo':
                return this.cmdDemo();
            case 'version':
                return `JARVIS v${CONFIG.APP_VERSION}`;
            case 'exit':
                return 'Use browser close button to exit';
            default:
                return `Command not found: '${command}'. Type 'help' for available commands.`;
        }
    }
    
    cmdHelp(args) {
        return [
            '',
            '╔════════════════════════════════════════════════════════════╗',
            '║         JARVIS BIOMETRIC CENTER - COMMAND REFERENCE        ║',
            '╚════════════════════════════════════════════════════════════╝',
            '',
            'SYSTEM COMMANDS:',
            '  help              Show this help message',
            '  status            Show system status',
            '  version           Show system version',
            '  time              Show current time',
            '  uptime            Show system uptime',
            '  clear             Clear terminal',
            '',
            'MODULE COMMANDS:',
            '  facial start      Start facial recognition',
            '  facial stop       Stop facial recognition',
            '  facial list       List registered faces',
            '  voice start       Start voice recognition',
            '  gesture start     Start gesture detection',
            '  eye start         Start eye tracking',
            '',
            'DATA COMMANDS:',
            '  users             List all registered users',
            '  history [type]    Show event history (optional: facial/voice/gesture)',
            '  stats             Show system statistics',
            '  export            Export all data',
            '  demo              Load demo data',
            '',
            'UTILITY:',
            '  echo <text>       Echo text',
            '  exit              Exit system',
            ''
        ];
    }
    
    cmdStatus() {
        const users = storage.getUsers().length;
        return [
            'System Status Report:',
            `  Status: ONLINE`,
            `  Uptime: ${this.getUptime()}`,
            `  Users: ${users}`,
            `  Memory: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(2)}MB`,
            `  Facial Recognition: ${CONFIG.FACIAL.ENABLED ? 'ENABLED' : 'DISABLED'}`,
            `  Voice Recognition: ${CONFIG.VOICE.ENABLED ? 'ENABLED' : 'DISABLED'}`,
            `  Gesture Detection: ${CONFIG.GESTURE.ENABLED ? 'ENABLED' : 'DISABLED'}`,
            `  Eye Tracking: ${CONFIG.EYE.ENABLED ? 'ENABLED' : 'DISABLED'}`,
        ];
    }
    
    cmdUsers() {
        const users = storage.getUsers();
        if (users.length === 0) {
            return 'No registered users';
        }
        
        const lines = ['Registered Users:'];
        users.forEach((user, index) => {
            lines.push(`  ${index + 1}. ${user.name} (ID: ${user.id})`);
        });
        return lines;
    }
    
    cmdHistory(args) {
        const history = logger.getHistory(args[1] || null);
        if (history.length === 0) {
            return 'No history records';
        }
        
        const lines = [`Event History (Last ${Math.min(10, history.length)} events):`];
        history.slice(0, 10).forEach(event => {
            const time = new Date(event.timestamp).toLocaleTimeString();
            lines.push(`  ${time} [${event.type.toUpperCase()}] ${JSON.stringify(event.data)}`);
        });
        return lines;
    }
    
    cmdStats() {
        const stats = storage.get('statistics', {});
        return [
            'System Statistics:',
            `  Total Users: ${storage.getUsers().length}`,
            `  Total Events: ${logger.getHistory().length}`,
            `  Facial Recognitions: ${stats.recognitions || 0}`,
            `  Successful: ${stats.successfulRecognitions || 0}`,
            `  Failed: ${stats.failedRecognitions || 0}`,
            `  Voice Commands: ${stats.voiceCommands || 0}`,
            `  Gestures Detected: ${stats.gesturesDetected || 0}`,
            `  Eye Tracking Events: ${stats.eyeTrackingEvents || 0}`,
        ];
    }
    
    cmdFacial(args) {
        const action = args[1] || 'status';
        switch(action) {
            case 'start':
                panelManager.showPanel('facial');
                return 'Facial recognition panel opened';
            case 'list':
                const faces = storage.get('registered_faces', []);
                if (faces.length === 0) return 'No registered faces';
                return faces.map((f, i) => `  ${i+1}. ${f.name} (ID: ${f.id})`);
            default:
                return `Facial Recognition Status: ${CONFIG.FACIAL.ENABLED ? 'ENABLED' : 'DISABLED'}`;
        }
    }
    
    cmdVoice(args) {
        const action = args[1] || 'status';
        if (action === 'start') {
            panelManager.showPanel('voice');
            return 'Voice recognition panel opened';
        }
        return `Voice Recognition Status: ${CONFIG.VOICE.ENABLED ? 'ENABLED' : 'DISABLED'}`;
    }
    
    cmdGesture(args) {
        const action = args[1] || 'status';
        if (action === 'start') {
            panelManager.showPanel('gestures');
            return 'Gesture recognition panel opened';
        }
        return `Gesture Recognition Status: ${CONFIG.GESTURE.ENABLED ? 'ENABLED' : 'DISABLED'}`;
    }
    
    cmdEye(args) {
        const action = args[1] || 'status';
        if (action === 'start') {
            panelManager.showPanel('eye-tracking');
            return 'Eye tracking panel opened';
        }
        return `Eye Tracking Status: ${CONFIG.EYE.ENABLED ? 'ENABLED' : 'DISABLED'}`;
    }
    
    cmdClear() {
        this.clearTerminal();
        return '';
    }
    
    clearTerminal() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
    }
    
    cmdUptime() {
        return this.getUptime();
    }
    
    getUptime() {
        const uptimeMs = Date.now() - (window.startTime || Date.now());
        const hours = Math.floor(uptimeMs / 3600000);
        const minutes = Math.floor((uptimeMs % 3600000) / 60000);
        const seconds = Math.floor((uptimeMs % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    cmdExport() {
        const data = storage.exportData();
        const json = JSON.stringify(data, null, 2);
        console.log(json);
        return `Data exported to console. Size: ${(json.length / 1024).toFixed(2)}KB`;
    }
    
    cmdDemo() {
        // Load demo data
        const demoUsers = [
            { id: '001', name: 'Alice Johnson', photo: '', timestamp: new Date().toISOString() },
            { id: '002', name: 'Bob Smith', photo: '', timestamp: new Date().toISOString() },
            { id: '003', name: 'Charlie Davis', photo: '', timestamp: new Date().toISOString() },
        ];
        storage.saveUsers(demoUsers);
        return 'Demo data loaded: 3 users';
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

const completeTerminal = new CompleteTerminal();