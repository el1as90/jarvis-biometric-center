/**
 * VOICE RECOGNITION MODULE
 * Real voice recognition using Web Speech API
 */

class VoiceRecognitionModule {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.isListening = false;
        this.transcript = '';
        this.finalTranscript = '';
        this.setupRecognition();
    }
    
    setupRecognition() {
        this.recognition.language = CONFIG.VOICE.LANGUAGE;
        this.recognition.continuous = CONFIG.VOICE.CONTINUOUS;
        this.recognition.interimResults = CONFIG.VOICE.INTERIM_RESULTS;
        
        this.recognition.onstart = () => {
            this.isListening = true;
        };
        
        this.recognition.onresult = (event) => {
            this.transcript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';
                } else {
                    this.transcript += transcript;
                }
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
        };
    }
    
    start(onResultCallback) {
        this.finalTranscript = '';
        this.transcript = '';
        this.recognition.start();
        
        // Simulate results for demo
        this.simulationInterval = setInterval(() => {
            if (this.isListening && onResultCallback) {
                onResultCallback({
                    interim: this.transcript,
                    final: this.finalTranscript,
                    isFinal: Math.random() > 0.7
                });
            }
        }, 100);
    }
    
    stop() {
        this.recognition.stop();
        if (this.simulationInterval) clearInterval(this.simulationInterval);
    }
    
    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
    }
    
    processCommand(command) {
        const commands = {
            'open facial': 'facial',
            'open gesture': 'gestures',
            'show statistics': 'statistics',
            'show history': 'history',
            'help': 'terminal',
            'settings': 'settings'
        };
        
        const lowerCommand = command.toLowerCase();
        for (const [key, panel] of Object.entries(commands)) {
            if (lowerCommand.includes(key)) {
                return panel;
            }
        }
        
        return null;
    }
}

const voiceRecognition = new VoiceRecognitionModule();