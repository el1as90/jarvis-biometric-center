/**
 * FACIAL RECOGNITION PANEL - COMPLETE IMPLEMENTATION
 * Register, identify, and match faces in real-time
 */

class FacialPanel {
    constructor() {
        this.videoElement = null;
        this.canvasElement = null;
        this.isRunning = false;
        this.registeredFaces = storage.get('registered_faces', []);
        this.detectionCount = 0;
        this.matchHistory = [];
    }
    
    init() {
        this.createPanelHTML();
        this.setupEventListeners();
        this.loadRegisteredFaces();
    }
    
    createPanelHTML() {
        const panel = document.getElementById('facial');
        panel.innerHTML = `
            <div class="panel-header">
                <h2>FACIAL RECOGNITION MODULE</h2>
                <div class="panel-controls">
                    <button id="start-camera-btn" class="action-btn">START CAMERA</button>
                    <button id="register-face-btn" class="action-btn">REGISTER USER</button>
                </div>
            </div>
            
            <div class="facial-content">
                <div class="camera-section">
                    <div class="video-container">
                        <video id="facial-video" width="640" height="480" playsinline></video>
                        <canvas id="facial-canvas" width="640" height="480"></canvas>
                        <div class="video-overlay">
                            <div id="confidence-display" class="confidence-display" style="display:none;">
                                <span>CONFIDENCE: <strong id="conf-value">0%</strong></span>
                            </div>
                            <div id="user-display" class="user-display" style="display:none;">
                                <span>USER: <strong id="user-detected">UNKNOWN</strong></span>
                            </div>
                            <div id="detection-status-display" class="detection-status-display">
                                Camera OFF
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="facial-info">
                    <div class="info-panel">
                        <h3>DETECTION STATUS</h3>
                        <div class="detection-info">
                            <div class="info-row">
                                <label>Status:</label>
                                <span id="detection-status">IDLE</span>
                            </div>
                            <div class="info-row">
                                <label>Faces Detected:</label>
                                <span id="faces-count">0</span>
                            </div>
                            <div class="info-row">
                                <label>Confidence:</label>
                                <span id="detection-confidence">0%</span>
                            </div>
                            <div class="info-row">
                                <label>Last Match:</label>
                                <span id="last-match">NONE</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="registered-faces">
                        <h3>REGISTERED USERS (${this.registeredFaces.length})</h3>
                        <div id="registered-list" class="registered-list">
                            ${this.registeredFaces.length === 0 ? '<p class="empty-message">No registered users</p>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.videoElement = document.getElementById('facial-video');
        this.canvasElement = document.getElementById('facial-canvas');
    }
    
    setupEventListeners() {
        document.getElementById('start-camera-btn').addEventListener('click', () => this.toggleCamera());
        document.getElementById('register-face-btn').addEventListener('click', () => this.openRegisterModal());
    }
    
    async toggleCamera() {
        if (this.isRunning) {
            this.stopCamera();
        } else {
            await this.startCamera();
        }
    }
    
    async startCamera() {
        try {
            const success = await camera.init(this.videoElement);
            if (success) {
                this.isRunning = true;
                document.getElementById('start-camera-btn').textContent = 'STOP CAMERA';
                document.getElementById('detection-status').textContent = 'RUNNING';
                document.getElementById('detection-status-display').textContent = 'DETECTING FACES...';
                
                // Start detection loop
                this.detectFacesLoop();
                Notification.success('Camera started');
            }
        } catch (error) {
            console.error('Camera error:', error);
            Notification.error('Camera access denied');
        }
    }
    
    stopCamera() {
        camera.stop();
        this.isRunning = false;
        document.getElementById('start-camera-btn').textContent = 'START CAMERA';
        document.getElementById('detection-status').textContent = 'IDLE';
        document.getElementById('detection-status-display').textContent = 'Camera OFF';
        Notification.info('Camera stopped');
    }
    
    async detectFacesLoop() {
        while (this.isRunning) {
            const faces = await facialRecognition.detectFaces(this.videoElement);
            
            // Draw faces
            const ctx = this.canvasElement.getContext('2d');
            ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            
            document.getElementById('faces-count').textContent = faces.length;
            
            faces.forEach((face, index) => {
                // Draw rectangle
                ctx.strokeStyle = '#00ffc8';
                ctx.lineWidth = 3;
                ctx.strokeRect(face.x, face.y, face.width, face.height);
                
                // Draw confidence
                ctx.fillStyle = '#00ffc8';
                ctx.font = 'bold 14px monospace';
                const confidence = Math.round(face.confidence * 100);
                ctx.fillText(`${confidence}%`, face.x + 10, face.y - 10);
                
                // Try to match
                if (index === 0) {
                    this.matchFace(face);
                }
            });
            
            await new Promise(r => setTimeout(r, 100));
        }
    }
    
    matchFace(faceData) {
        const result = facialRecognition.matchFace(faceData);
        
        document.getElementById('detection-confidence').textContent = Math.round(result.confidence * 100) + '%';
        
        if (result.match) {
            document.getElementById('last-match').textContent = result.user;
            document.getElementById('user-detected').textContent = result.user;
            document.getElementById('confidence-display').style.display = 'block';
            document.getElementById('user-display').style.display = 'block';
            document.getElementById('conf-value').textContent = Math.round(result.confidence * 100) + '%';
            
            logger.logFacialRecognition(result.user, result.confidence, true);
        } else {
            document.getElementById('user-detected').textContent = 'UNKNOWN';
            document.getElementById('last-match').textContent = 'UNKNOWN';
        }
    }
    
    loadRegisteredFaces() {
        const list = document.getElementById('registered-list');
        if (!list) return;
        
        if (this.registeredFaces.length === 0) {
            list.innerHTML = '<p class="empty-message">No registered users</p>';
            return;
        }
        
        list.innerHTML = this.registeredFaces.map(face => `
            <div class="registered-face-item">
                <img src="${face.photo}" alt="${face.name}">
                <div class="face-info">
                    <h4>${face.name}</h4>
                    <p>ID: ${face.id}</p>
                    <p>Registered: ${new Date(face.timestamp).toLocaleDateString()}</p>
                </div>
                <button class="delete-face-btn" data-id="${face.id}">DELETE</button>
            </div>
        `).join('');
        
        // Delete handlers
        list.querySelectorAll('.delete-face-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.deleteFace(id);
            });
        });
    }
    
    openRegisterModal() {
        const modal = document.getElementById('register-modal');
        const backdrop = document.getElementById('modal-backdrop');
        
        if (modal && backdrop) {
            modal.classList.remove('hidden');
            backdrop.classList.remove('hidden');
            
            // Setup modal
            this.setupRegisterModal();
        }
    }
    
    setupRegisterModal() {
        const video = document.getElementById('register-video');
        const canvas = document.getElementById('register-canvas');
        const captureBtn = document.getElementById('capture-photo-btn');
        const saveBtn = document.getElementById('save-user-btn');
        const cancelBtn = document.getElementById('cancel-register-btn');
        const closeBtn = document.querySelector('.close-modal');
        
        // Start camera in modal
        camera.init(video).then(() => {
            video.play();
        });
        
        captureBtn.addEventListener('click', () => this.capturePhoto(video, canvas));
        saveBtn.addEventListener('click', () => this.saveNewUser());
        cancelBtn.addEventListener('click', () => this.closeModal());
        closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    capturePhoto(video, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const photoData = canvas.toDataURL('image/jpeg');
        const preview = document.getElementById('photo-preview');
        const img = document.getElementById('captured-photo');
        
        img.src = photoData;
        preview.classList.remove('hidden');
        
        document.getElementById('capture-photo-btn').textContent = 'RECAPTURE';
        Notification.success('Photo captured');
    }
    
    saveNewUser() {
        const name = document.getElementById('register-name').value;
        const photoEl = document.getElementById('captured-photo');
        const photoData = photoEl.src;
        
        if (!name) {
            Notification.error('Please enter a name');
            return;
        }
        
        if (!photoData || photoData === '') {
            Notification.error('Please capture a photo');
            return;
        }
        
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            photo: photoData,
            timestamp: new Date().toISOString(),
            accesses: 0,
            successRate: 0,
            avgConfidence: 0
        };
        
        this.registeredFaces.push(newUser);
        facialRecognition.registerFace(photoData, name);
        
        storage.set('registered_faces', this.registeredFaces);
        
        logger.log('user_registered', { user: name });
        
        this.loadRegisteredFaces();
        this.closeModal();
        
        Notification.success(`User '${name}' registered successfully`);
    }
    
    closeModal() {
        const modal = document.getElementById('register-modal');
        const backdrop = document.getElementById('modal-backdrop');
        
        modal.classList.add('hidden');
        backdrop.classList.add('hidden');
        
        // Reset form
        document.getElementById('register-name').value = '';
        document.getElementById('photo-preview').classList.add('hidden');
        document.getElementById('captured-photo').src = '';
        document.getElementById('capture-photo-btn').textContent = 'CAPTURE PHOTO';
        
        camera.stop();
    }
    
    deleteFace(id) {
        if (confirm('Delete this user?')) {
            this.registeredFaces = this.registeredFaces.filter(f => f.id !== id);
            storage.set('registered_faces', this.registeredFaces);
            this.loadRegisteredFaces();
            Notification.success('User deleted');
        }
    }
}

const facialPanel = new FacialPanel();