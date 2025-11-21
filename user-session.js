// Enhanced User Session Management for PromptEngine
class UserSessionManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        this.init();
    }

    init() {
        // Check for existing session on page load
        this.loadStoredSession();
        this.setupAuthEventListeners();
        this.updateUIBasedOnAuthState();
        
        // Set up periodic token refresh
        setInterval(() => this.checkTokenExpiry(), 60000); // Check every minute
    }

    loadStoredSession() {
        try {
            const storedToken = localStorage.getItem('promptengine_token');
            const storedRefreshToken = localStorage.getItem('promptengine_refresh_token');
            const storedUser = localStorage.getItem('promptengine_user');
            const storedExpiry = localStorage.getItem('promptengine_token_expiry');

            if (storedToken && storedUser && storedExpiry) {
                this.token = storedToken;
                this.refreshToken = storedRefreshToken;
                this.currentUser = JSON.parse(storedUser);
                this.tokenExpiry = new Date(storedExpiry);

                // Check if token is still valid
                if (new Date() < this.tokenExpiry) {
                    // Session restored successfully
                    this.updateUIBasedOnAuthState();
                } else {
                    // Token expired, refreshing...
                    this.refreshAccessToken();
                }
            }
        } catch (error) {
            console.error('Failed to load stored session:', error);
            this.clearSession();
        }
    }

    async refreshAccessToken() {
        if (!this.refreshToken) {
            this.logout();
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.refreshToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.access_token;
                this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
                
                // Update storage
                localStorage.setItem('promptengine_token', this.token);
                localStorage.setItem('promptengine_token_expiry', this.tokenExpiry.toISOString());
                
                // Token refreshed successfully
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
        }
    }

    checkTokenExpiry() {
        if (this.token && this.tokenExpiry) {
            const timeUntilExpiry = this.tokenExpiry.getTime() - Date.now();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
                // Token expiring soon, refreshing...
                this.refreshAccessToken();
            }
        }
    }

    async login(email, password) {
        try {
            const response = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store session data
                this.token = data.access_token;
                this.refreshToken = data.refresh_token;
                this.currentUser = data.user;
                this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));

                // Persist to localStorage
                localStorage.setItem('promptengine_token', this.token);
                localStorage.setItem('promptengine_refresh_token', this.refreshToken);
                localStorage.setItem('promptengine_user', JSON.stringify(this.currentUser));
                localStorage.setItem('promptengine_token_expiry', this.tokenExpiry.toISOString());

                // Login successful
                this.updateUIBasedOnAuthState();
                this.showWelcomeMessage();

                return { success: true, user: this.currentUser };
            } else {
                throw new Error(data.detail || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            if (this.token) {
                await fetch('http://127.0.0.1:8000/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearSession();
            this.updateUIBasedOnAuthState();
            // User logged out
        }
    }

    clearSession() {
        this.currentUser = null;
        this.token = null;
        this.refreshToken = null;
        this.tokenExpiry = null;

        // Clear localStorage
        localStorage.removeItem('promptengine_token');
        localStorage.removeItem('promptengine_refresh_token');
        localStorage.removeItem('promptengine_user');
        localStorage.removeItem('promptengine_token_expiry');
    }

    updateUIBasedOnAuthState() {
        if (this.isAuthenticated()) {
            this.showUserProfile();
            this.enableAuthenticatedFeatures();
        } else {
            this.hideUserProfile();
            this.disableAuthenticatedFeatures();
        }
    }

    showUserProfile() {
        // Create or update user profile display
        this.createUserProfileWidget();
        this.updateNavigationForAuthenticatedUser();
    }

    createUserProfileWidget() {
        // Remove existing profile widget if it exists
        const existingWidget = document.getElementById('user-profile-widget');
        if (existingWidget) {
            existingWidget.remove();
        }

        // Create new user profile widget
        const profileWidget = document.createElement('div');
        profileWidget.id = 'user-profile-widget';
        profileWidget.className = 'fixed top-4 right-4 bg-white rounded-xl shadow-lg p-4 z-50 max-w-sm border border-gray-200';
        
        const user = this.currentUser;
        const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
        
        const lastLoginText = user.lastLogin 
            ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'First login';

        profileWidget.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800 text-sm">${user.firstName} ${user.lastName}</h3>
                        <p class="text-xs text-gray-600">${user.email}</p>
                        <div class="flex items-center space-x-2 mt-1">
                            <span class="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                            <span class="text-xs text-gray-500">Online</span>
                        </div>
                    </div>
                </div>
                <button onclick="userSession.toggleProfileDetails()" class="text-gray-400 hover:text-gray-600 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>
            
            <div id="profile-details" class="hidden border-t pt-3 space-y-2">
                <div class="flex justify-between text-xs">
                    <span class="text-gray-500">Role:</span>
                    <span class="font-medium text-gray-700 capitalize flex items-center">
                        ${user.role === 'admin' ? '👑' : '👤'} ${user.role}
                    </span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-500">Member since:</span>
                    <span class="font-medium text-gray-700">${memberSince}</span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-500">Last login:</span>
                    <span class="font-medium text-gray-700">${lastLoginText}</span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-500">Session:</span>
                    <span class="font-medium text-green-600">Active</span>
                </div>
                
                <div class="pt-2 border-t space-y-2">
                    <button onclick="userSession.showUserStats()" class="w-full text-left text-xs text-orange-600 hover:text-orange-700 py-1">
                        📊 View Activity Stats
                    </button>
                    <button onclick="userSession.showSettings()" class="w-full text-left text-xs text-gray-600 hover:text-gray-700 py-1">
                        ⚙️ Account Settings
                    </button>
                    <button onclick="userSession.logout()" class="w-full text-left text-xs text-red-600 hover:text-red-700 py-1">
                        🚪 Sign Out
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(profileWidget);

        // Add entrance animation
        setTimeout(() => {
            profileWidget.style.transform = 'translateX(0)';
            profileWidget.style.opacity = '1';
        }, 100);

        // Auto-hide after 10 seconds, show again on hover
        setTimeout(() => {
            if (!profileWidget.matches(':hover')) {
                this.minimizeProfileWidget();
            }
        }, 10000);

        // Show on hover when minimized
        profileWidget.addEventListener('mouseenter', () => {
            this.expandProfileWidget();
        });
    }

    minimizeProfileWidget() {
        const widget = document.getElementById('user-profile-widget');
        if (widget) {
            widget.style.transform = 'translateX(calc(100% - 60px))';
            widget.style.transition = 'transform 0.3s ease-in-out';
        }
    }

    expandProfileWidget() {
        const widget = document.getElementById('user-profile-widget');
        if (widget) {
            widget.style.transform = 'translateX(0)';
            widget.style.transition = 'transform 0.3s ease-in-out';
        }
    }

    toggleProfileDetails() {
        const details = document.getElementById('profile-details');
        if (details) {
            details.classList.toggle('hidden');
        }
    }

    updateNavigationForAuthenticatedUser() {
        // Update main navigation to show user-specific options
        const nav = document.querySelector('nav, .navigation, header');
        if (nav) {
            // Add authenticated user navigation items
            const userNavHTML = `
                <div class="hidden md:flex items-center space-x-6 ml-auto">
                    <a href="/history.html" class="text-gray-600 hover:text-orange-600 transition-colors">History</a>
                    <a href="/analytics.html" class="text-gray-600 hover:text-orange-600 transition-colors">Analytics</a>
                    <a href="/templates.html" class="text-gray-600 hover:text-orange-600 transition-colors">Templates</a>
                    <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-medium">
                        ${this.currentUser.firstName.charAt(0)}
                    </div>
                </div>
            `;
            
            // Add to navigation if not already present
            if (!nav.querySelector('.user-nav')) {
                const userNavElement = document.createElement('div');
                userNavElement.className = 'user-nav';
                userNavElement.innerHTML = userNavHTML;
                nav.appendChild(userNavElement);
            }
        }
    }

    hideUserProfile() {
        const profileWidget = document.getElementById('user-profile-widget');
        if (profileWidget) {
            profileWidget.remove();
        }

        // Remove user navigation
        const userNav = document.querySelector('.user-nav');
        if (userNav) {
            userNav.remove();
        }
    }

    enableAuthenticatedFeatures() {
        // Enable features that require authentication
        document.querySelectorAll('[data-auth-required]').forEach(element => {
            element.style.display = 'block';
            element.removeAttribute('disabled');
        });

        // Update buttons and forms to use authenticated API calls
        this.updateAPICallsWithAuth();
    }

    disableAuthenticatedFeatures() {
        // Disable or hide features that require authentication
        document.querySelectorAll('[data-auth-required]').forEach(element => {
            element.style.display = 'none';
        });
    }

    updateAPICallsWithAuth() {
        // Override the global API client to include auth headers
        if (window.apiClient) {
            const originalPost = window.apiClient.post;
            const originalGet = window.apiClient.get;

            window.apiClient.post = async (endpoint, data) => {
                return this.authenticatedAPICall('POST', endpoint, data);
            };

            window.apiClient.get = async (endpoint) => {
                return this.authenticatedAPICall('GET', endpoint);
            };
        }
    }

    async authenticatedAPICall(method, endpoint, data = null) {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const config = {
                method: method,
                headers: headers
            };

            if (data) {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(`http://127.0.0.1:8000${endpoint}`, config);

            if (response.status === 401) {
                // Token expired, try to refresh
                await this.refreshAccessToken();
                
                // Retry with new token
                if (this.token) {
                    headers['Authorization'] = `Bearer ${this.token}`;
                    const retryResponse = await fetch(`http://127.0.0.1:8000${endpoint}`, config);
                    
                    if (!retryResponse.ok) {
                        throw new Error('API error after token refresh');
                    }
                    
                    return await retryResponse.json();
                } else {
                    throw new Error('Authentication required');
                }
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API error');
            }

            return await response.json();
        } catch (error) {
            console.error(`Authenticated API call failed: ${endpoint}`, error);
            throw error;
        }
    }

    showWelcomeMessage() {
        // Create a welcome toast notification
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300';
        welcomeToast.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    ✓
                </div>
                <div>
                    <div class="font-semibold">Welcome back, ${this.currentUser.firstName}!</div>
                    <div class="text-sm text-green-100">You're successfully logged in</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-green-200 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(welcomeToast);

        // Show toast
        setTimeout(() => {
            welcomeToast.style.transform = 'translateY(0)';
        }, 100);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            welcomeToast.style.transform = 'translateY(full)';
            setTimeout(() => welcomeToast.remove(), 300);
        }, 5000);
    }

    showUserStats() {
        // Create user statistics modal
        // Showing user statistics...
        // Implementation for user stats modal
        alert('User statistics feature coming soon!');
    }

    showSettings() {
        // Create settings modal
        // Showing user settings...
        // Implementation for settings modal
        alert('Settings feature coming soon!');
    }

    setupAuthEventListeners() {
        // Listen for login forms
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLoginForm(e.target);
            }
        });

        // Listen for logout buttons
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'logout') {
                e.preventDefault();
                this.logout();
            }
        });
    }

    async handleLoginForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        const result = await this.login(email, password);
        
        if (result.success) {
            // Redirect to main app or close modal
            const modal = form.closest('.modal, .auth-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Redirect to main app if on auth page
            if (window.location.pathname.includes('auth.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // Show error message
            const errorElement = form.querySelector('.error-message') || document.createElement('div');
            errorElement.className = 'error-message text-red-600 text-sm mt-2';
            errorElement.textContent = result.error;
            
            if (!form.querySelector('.error-message')) {
                form.appendChild(errorElement);
            }
        }
    }

    isAuthenticated() {
        return this.currentUser && this.token && (!this.tokenExpiry || new Date() < this.tokenExpiry);
    }

    getUserInfo() {
        return this.currentUser;
    }

    getAuthToken() {
        return this.token;
    }
}

// Initialize user session manager
const userSession = new UserSessionManager();

// Make it globally accessible
window.userSession = userSession;