/**
 * USER MANAGEMENT - COMPLETE CRUD OPERATIONS
 */

class UserManagement {
    constructor() {
        this.users = storage.getUsers();
        this.selectedUser = null;
    }
    
    init() {
        this.createPanelHTML();
        this.setupEventListeners();
        this.renderUsersList();
    }
    
    createPanelHTML() {
        const panel = document.getElementById('users');
        panel.innerHTML = `
            <div class="panel-header">
                <h2>USER MANAGEMENT CENTER</h2>
                <div class="panel-controls">
                    <button id="new-user-btn" class="action-btn">NEW USER</button>
                    <button id="export-users-btn" class="action-btn">EXPORT DATA</button>
                </div>
            </div>
            
            <div class="users-content">
                <div class="users-list-container">
                    <div class="users-filters">
                        <input type="text" id="user-search" placeholder="Search users..." class="search-input">
                        <select id="user-sort" class="sort-select">
                            <option value="date">Sort by Date</option>
                            <option value="name">Sort by Name</option>
                            <option value="accesses">Sort by Accesses</option>
                        </select>
                    </div>
                    
                    <div id="users-list" class="users-list">
                        <p class="empty-message">No registered users</p>
                    </div>
                </div>
                
                <div id="user-detail" class="user-detail hidden">
                    <div class="detail-header">
                        <button class="back-btn">&larr; BACK</button>
                        <h3 id="detail-name">User Details</h3>
                    </div>
                    
                    <div class="detail-content">
                        <div class="detail-info">
                            <div class="info-section">
                                <h4>BIOMETRIC DATA</h4>
                                <div class="info-group">
                                    <label>User ID:</label>
                                    <span id="detail-id"></span>
                                </div>
                                <div class="info-group">
                                    <label>Full Name:</label>
                                    <span id="detail-fullname"></span>
                                </div>
                                <div class="info-group">
                                    <label>Created:</label>
                                    <span id="detail-created"></span>
                                </div>
                                <div class="info-group">
                                    <label>Last Access:</label>
                                    <span id="detail-last"></span>
                                </div>
                            </div>
                            
                            <div class="info-section">
                                <h4>STATISTICS</h4>
                                <div class="info-group">
                                    <label>Total Accesses:</label>
                                    <span id="detail-accesses">0</span>
                                </div>
                                <div class="info-group">
                                    <label>Success Rate:</label>
                                    <span id="detail-success">0%</span>
                                </div>
                                <div class="info-group">
                                    <label>Average Confidence:</label>
                                    <span id="detail-confidence">0%</span>
                                </div>
                            </div>
                            
                            <div class="detail-actions">
                                <button id="delete-user-btn" class="action-btn danger">DELETE USER</button>
                                <button id="close-detail-btn" class="action-btn">CLOSE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Search
        document.getElementById('user-search')?.addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });
        
        // Sort
        document.getElementById('user-sort')?.addEventListener('change', (e) => {
            this.sortUsers(e.target.value);
        });
        
        // Buttons
        document.getElementById('new-user-btn')?.addEventListener('click', () => {
            panelManager.showPanel('facial');
            setTimeout(() => facialPanel.openRegisterModal(), 500);
        });
        
        document.getElementById('export-users-btn')?.addEventListener('click', () => {
            this.exportUsers();
        });
        
        document.getElementById('back-btn')?.addEventListener('click', () => {
            this.closeUserDetail();
        });
        
        document.getElementById('close-detail-btn')?.addEventListener('click', () => {
            this.closeUserDetail();
        });
        
        document.getElementById('delete-user-btn')?.addEventListener('click', () => {
            this.deleteUser(this.selectedUser.id);
        });
    }
    
    renderUsersList() {
        const list = document.getElementById('users-list');
        if (!list) return;
        
        if (this.users.length === 0) {
            list.innerHTML = '<p class="empty-message">No registered users</p>';
            return;
        }
        
        list.innerHTML = this.users.map(user => `
            <div class="user-list-item" data-user-id="${user.id}">
                <div class="user-name">${user.name}</div>
                <div class="user-info">
                    <span>ID: ${user.id}</span>
                    <span>Accesses: ${user.accesses || 0}</span>
                </div>
                <button class="view-btn">VIEW</button>
            </div>
        `).join('');
        
        // Event handlers
        list.querySelectorAll('.user-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = item.getAttribute('data-user-id');
                this.showUserDetail(userId);
            });
        });
    }
    
    showUserDetail(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.selectedUser = user;
        
        document.getElementById('detail-name').textContent = user.name;
        document.getElementById('detail-id').textContent = user.id;
        document.getElementById('detail-fullname').textContent = user.name;
        document.getElementById('detail-created').textContent = new Date(user.timestamp).toLocaleDateString();
        document.getElementById('detail-last').textContent = user.lastAccess ? new Date(user.lastAccess).toLocaleDateString() : 'Never';
        document.getElementById('detail-accesses').textContent = user.accesses || 0;
        document.getElementById('detail-success').textContent = Math.round((user.successRate || 0) * 100) + '%';
        document.getElementById('detail-confidence').textContent = Math.round((user.avgConfidence || 0) * 100) + '%';
        
        document.getElementById('users-list-container')?.classList.add('hidden');
        document.getElementById('user-detail')?.classList.remove('hidden');
    }
    
    closeUserDetail() {
        this.selectedUser = null;
        document.getElementById('users-list-container')?.classList.remove('hidden');
        document.getElementById('user-detail')?.classList.add('hidden');
    }
    
    filterUsers(query) {
        const items = document.querySelectorAll('.user-list-item');
        items.forEach(item => {
            const name = item.querySelector('.user-name').textContent.toLowerCase();
            item.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
        });
    }
    
    sortUsers(by) {
        if (by === 'date') {
            this.users.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else if (by === 'name') {
            this.users.sort((a, b) => a.name.localeCompare(b.name));
        } else if (by === 'accesses') {
            this.users.sort((a, b) => (b.accesses || 0) - (a.accesses || 0));
        }
        storage.saveUsers(this.users);
        this.renderUsersList();
    }
    
    deleteUser(userId) {
        if (!confirm('Delete this user?')) return;
        
        this.users = this.users.filter(u => u.id !== userId);
        storage.saveUsers(this.users);
        
        logger.log('user_deleted', { userId });
        Notification.success('User deleted');
        
        this.closeUserDetail();
        this.renderUsersList();
    }
    
    exportUsers() {
        const data = storage.exportData();
        const json = JSON.stringify(data, null, 2);
        
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jarvis-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        Notification.success('Data exported');
    }
}

const userManagement = new UserManagement();