/**
 * AUDIO CONTEXT MANAGER
 * Manages audio input for voice recognition
 */

class AudioContextManager {
    constructor() {
        this.audioContext = null;
        this.mediaStream = null;
        this.analyser = null;
        this.dataArray = null;
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            source.connect(this.analyser);
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            return true;
        } catch (error) {
            console.error('Audio init error:', error);
            return false;
        }
    }
    
    getFrequencyData() {
        if (!this.analyser) return null;
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }
    
    getAverageFrequency() {
        const data = this.getFrequencyData();
        if (!data) return 0;
        const sum = data.reduce((a, b) => a + b, 0);
        return sum / data.length;
    }
    
    stop() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }
    }
}

const audioManager = new AudioContextManager();