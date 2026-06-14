/**
 * TERMINAL UI
 */

class Terminal {
    constructor() {
        this.output = [];
        this.setupTerminal();
    }
    
    setupTerminal() {
        const input = document.getElementById('terminal-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.executeCommand(input.value);
                    input.value = '';
                }
            });
        }
    }
    
    executeCommand(command) {
        const output = document.getElementById('terminal-output');
        
        // Add command line
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">$</span><span class="text">${command}</span>`;
        output.appendChild(line);
        
        // Process command
        const response = this.processCommand(command);
        
        // Add response
        const respLine = document.createElement('div');
        respLine.className = 'terminal-line';
        respLine.innerHTML = `<span class="text">${response}</span>`;
        output.appendChild(respLine);
        
        output.scrollTop = output.scrollHeight;
    }
    
    processCommand(cmd) {
        const commands = {
            'help': 'Available commands: status, users, facial, voice, gestures, eye, stats, clear, exit',
            'status': 'System ONLINE | All modules active',
            'users': `Registered users: ${storage.getUsers().length}`,
            'clear': () => this.clearTerminal(),
            'facial': 'Facial recognition module: ACTIVE',
            'voice': 'Voice recognition module: ACTIVE',
            'gestures': 'Gesture detection module: ACTIVE',
            'eye': 'Eye tracking module: ACTIVE',
            'stats': 'System Statistics: Normal operation',
        };
        
        const response = commands[cmd] || 'Command not found. Type "help" for available commands.';
        return typeof response === 'function' ? response() : response;
    }
    
    clearTerminal() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
    }
}

const terminal = new Terminal();