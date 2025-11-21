// Role-Based UI Authentication Manager
class RoleBasedAuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check authentication status on page load
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logoutUser());
        }

        // User menu dropdown toggle
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.add('hidden');
            });
        }
    }

    // Check if user is authenticated
    checkAuthStatus() {
        try {
            const authData = this.getStoredAuth();
            
            if (authData && authData.token && !this.isTokenExpired(authData)) {
                // Validate token by calling backend or decoding JWT
                this.validateToken(authData.token)
                    .then(isValid => {
                        if (isValid) {
                            this.currentUser = authData.user;
                            this.isAuthenticated = true;
                            this.renderAuthenticatedUI();
                        } else {
                            this.clearAuthData();
                            this.renderGuestUI();
                        }
                    })
                    .catch(() => {
                        this.clearAuthData();
                        this.renderGuestUI();
                    });
            } else {
                this.renderGuestUI();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.renderGuestUI();
        }
    }

    // Get stored authentication data
    getStoredAuth() {
        let authData = localStorage.getItem('promptengine_auth');
        if (!authData) {
            authData = sessionStorage.getItem('promptengine_auth');
        }
        
        if (authData) {
            try {
                const parsedData = JSON.parse(authData);
                // Assuming the token is stored within this object
                if (parsedData.token && parsedData.user) {
                    return parsedData;
                }
            } catch (e) {
                console.error("Error parsing auth data from storage", e);
                return null;
            }
        }
        
        // Fallback for token-only storage for backward compatibility
        const token = localStorage.getItem('jwt_token');
        if (token) {
            const user = this.getUserFromToken(token);
            if (user) {
                return { token, user };
            }
        }
        
        return null;
    }

    // Check if token is expired
    isTokenExpired(authData) {
        if (!authData.token) return true;
        const decoded = this.decodeJWT(authData.token);
        if (!decoded || !decoded.exp) return true;
        return (Date.now() / 1000) > decoded.exp;
    }

    // Validate token (can call backend endpoint or decode JWT)
    async validateToken(token) {
        try {
            // Option 1: Call backend validation endpoint
            const response = await fetch('http://127.0.0.1:8000/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const user = await response.json();
                this.currentUser = user;
                return true;
            }
            return false;
        } catch (error) {
            // Option 2: Fallback to JWT decoding for offline validation
            const decoded = this.decodeJWT(token);
            if (decoded && decoded.exp && (Date.now() / 1000) < decoded.exp) {
                this.currentUser = this.getUserFromToken(token);
                return true;
            }
            return false;
        }
    }

    // Simple JWT decoder (for client-side validation)
    decodeJWT(token) {
        try {
            if (!token) return null;
            
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            const payload = parts[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            
            return decoded;
        } catch (error) {
            console.error('JWT decode error:', error);
            return null;
        }
    }
    
    getUserFromToken(token) {
        const decoded = this.decodeJWT(token);
        if (!decoded) return null;
        return {
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            role: decoded.role
            // Add other user properties as needed
        };
    }

    renderAuthenticatedUI() {
        const authenticatedNav = document.getElementById('authenticated-nav-center');
        const guestNav = document.getElementById('guest-nav');
        const navbarLeftLogo = document.getElementById('navbar-left-logo');

        if (authenticatedNav) authenticatedNav.classList.remove('hidden');
        if (guestNav) guestNav.classList.add('hidden');
        if (navbarLeftLogo) navbarLeftLogo.classList.add('hidden'); // Hide the left logo

        this.populateUserInfo();
    }

    // Render UI for guest users
    renderGuestUI() {
        const authenticatedNav = document.getElementById('authenticated-nav-center');
        const guestNav = document.getElementById('guest-nav');
        const navbarLeftLogo = document.getElementById('navbar-left-logo');

        if (authenticatedNav) authenticatedNav.classList.add('hidden');
        if (guestNav) guestNav.classList.remove('hidden');
        if (navbarLeftLogo) navbarLeftLogo.classList.remove('hidden'); // Show the left logo

        // No need to populate user info for guests
    }

    // Populate user information in the UI
    populateUserInfo() {
        if (!this.currentUser) return;

        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');

        if (userName) {
            userName.textContent = `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim() || this.currentUser.email;
        }

        if (userRole) {
            userRole.textContent = this.currentUser.role || 'User';
        }
    }

    // Logout user
    logoutUser() {
        // Clear authentication data
        this.clearAuthData();
        
        // Reset state
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Update UI
        this.renderGuestUI();
        
        // Show logout message
        this.showNotification('You have been logged out successfully', 'info');
        
        // Optional: Redirect to auth page after a delay
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
    }

    // Clear stored authentication data
    clearAuthData() {
        localStorage.removeItem('promptengine_auth');
        sessionStorage.removeItem('promptengine_auth');
        localStorage.removeItem('jwt_token'); // For backward compatibility
    }

    // Show notification (you can customize this based on your notification system)
    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Initialize the authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new RoleBasedAuthManager();
});

// Export functions for global access
window.AuthManager = {
    getCurrentUser: () => window.authManager?.getCurrentUser(),
    isAuthenticated: () => window.authManager?.isUserAuthenticated(),
    hasRole: (role) => window.authManager?.hasRole(role),
    logout: () => window.authManager?.logoutUser(),
    checkAuth: () => window.authManager?.checkAuthStatus()
};