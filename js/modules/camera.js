/**
 * CAMERA MANAGER
 * Manages camera access and video streaming
 */

class CameraManager {
    constructor() {
        this.mediaStream = null;
        this.isActive = false;
    }
    
    async init(videoElement) {
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });
            
            videoElement.srcObject = this.mediaStream;
            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    this.isActive = true;
                    resolve(true);
                };
            });
        } catch (error) {
            console.error('Camera init error:', error);
            Notification.error('Camera access denied');
            return false;
        }
    }
    
    stop() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.isActive = false;
        }
    }
    
    captureFrame(videoElement, canvasElement) {
        if (!this.isActive) return null;
        const ctx = canvasElement.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        return canvasElement.toDataURL('image/jpeg');
    }
}

const camera = new CameraManager();