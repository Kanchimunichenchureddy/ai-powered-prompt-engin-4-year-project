/**
 * Session-Based Dynamic Navigation Manager for PromptEngine
 * Handles menu visibility, user authentication state, and JWT token management
 * 
 * Author: PromptEngine Development Team
 * Version: 1.0.0
 */

class SessionNavigationManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.tokenExpiry = null;
        this.isInitialized = false;
        
        // Storage keys for consistency
        this.storageKeys = {
            token: 'promptengine_token',
            user: 'promptengine_user',
            expiry: 'promptengine_token_expiry',
            refreshToken: 'promptengine_refresh_token'
        };
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the session manager
     * Sets up event listeners and checks existing session
     */
    init() {
        try {
            console.log('SessionNavigationManager: Initializing...');
            
            // Check for existing session
            this.checkUserSession();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup dropdown functionality
            this.setupDropdownToggle();
            
            // Render the appropriate menu
            this.renderMenuBasedOnUser();
            
            // Setup periodic token validation
            this.setupTokenValidation();
            
            this.isInitialized = true;
            console.log('SessionNavigationManager: Initialization complete');
            
        } catch (error) {
            console.error('SessionNavigationManager: Initialization failed:', error);
        }
    }

    /**
     * Check for existing user session in localStorage/cookies
     * Validates JWT token and loads user data if valid
     */
    checkUserSession() {
        try {
            console.log('SessionNavigationManager: Checking user session...');
            
            // Try to get stored session data
            const storedToken = localStorage.getItem(this.storageKeys.token);
            const storedUser = localStorage.getItem(this.storageKeys.user);
            const storedExpiry = localStorage.getItem(this.storageKeys.expiry);
            
            if (!storedToken || !storedUser) {
                console.log('SessionNavigationManager: No stored session found');
                this.clearSession();
                return false;
            }
            
            // Parse user data
            try {
                this.currentUser = JSON.parse(storedUser);
            } catch (parseError) {
                console.error('SessionNavigationManager: Invalid user data in storage');
                this.clearSession();
                return false;
            }
            
            // Validate token
            if (!this.validateJWT(storedToken)) {
                console.log('SessionNavigationManager: Invalid or expired token');
                this.clearSession();
                return false;
            }
            
            // Set session data
            this.token = storedToken;
            this.tokenExpiry = storedExpiry ? new Date(storedExpiry) : null;
            
            console.log('SessionNavigationManager: Valid session found for:', this.currentUser.firstName);
            return true;
            
        } catch (error) {
            console.error('SessionNavigationManager: Session check failed:', error);
            this.clearSession();
            return false;
        }
    }

    /**
     * Decode JWT token safely
     * @param {string} token - JWT token to decode
     * @returns {object|null} - Decoded payload or null if invalid
     */
    decodeJWT(token) {
        try {
            if (!token || typeof token !== 'string') {
                console.error('SessionNavigationManager: Invalid token provided');
                return null;
            }
            
            // Split token into parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('SessionNavigationManager: Invalid JWT format');
                return null;
            }
            
            // Decode the payload (second part)
            const payload = parts[1];
            
            // Add padding if necessary (JWT base64 encoding)
            const paddedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayload = atob(paddedPayload);
            
            return JSON.parse(decodedPayload);
            
        } catch (error) {
            console.error('SessionNavigationManager: JWT decode failed:', error);
            return null;
        }
    }

    /**
     * Validate JWT token (format and expiration)
     * @param {string} token - JWT token to validate
     * @returns {boolean} - True if token is valid, false otherwise
     */
    validateJWT(token) {
        try {
            const decoded = this.decodeJWT(token);
            if (!decoded) {
                return false;
            }
            
            // Check if token has expiration
            if (decoded.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                if (decoded.exp < currentTime) {
                    console.log('SessionNavigationManager: Token has expired');
                    return false;
                }
            }
            
            // Check if token has required fields
            if (!decoded.sub && !decoded.user_id) {
                console.log('SessionNavigationManager: Token missing user identifier');
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('SessionNavigationManager: Token validation failed:', error);
            return false;
        }
    }

    /**
     * Extract user information from JWT token
     * @param {string} token - JWT token
     * @returns {object|null} - User data or null if extraction fails
     */
    getUserFromToken(token) {
        try {
            const decoded = this.decodeJWT(token);
            if (!decoded) {
                return null;
            }
            
            return {
                id: decoded.sub || decoded.user_id,
                email: decoded.email,
                firstName: decoded.first_name || decoded.firstName,
                lastName: decoded.last_name || decoded.lastName,
                role: decoded.role || 'user',
                exp: decoded.exp,
                iat: decoded.iat
            };
            
        } catch (error) {
            console.error('SessionNavigationManager: User extraction failed:', error);
            return null;
        }
    }

    /**
     * Render navigation menu based on user authentication state
     * Shows/hides menu items and updates user interface
     */
    renderMenuBasedOnUser() {
        try {
            console.log('SessionNavigationManager: Rendering menu for user state...');
            
            const isAuthenticated = this.isAuthenticated();
            
            if (isAuthenticated) {
                this.showAuthenticatedMenu();
                this.updateUserInterface();
            } else {
                this.showUnauthenticatedMenu();
            }
            
            // Update page title based on auth state
            this.updatePageTitle();
            
        } catch (error) {
            console.error('SessionNavigationManager: Menu rendering failed:', error);
        }
    }

    /**
     * Show authenticated user menu (hide Sign In/Up, show Profile/Settings/Logout)
     */
    showAuthenticatedMenu() {
        // Hide navigation items for authenticated users and add specific IDs/classes
        const navItems = document.querySelectorAll('.hidden.md\\:flex.items-center.space-x-8 a');
        navItems.forEach((item, index) => {
            const href = item.getAttribute('href');
            if (href) {
                // Add visibility control classes
                if (href.includes('index.html')) {
                    item.classList.add('auth-required');
                    item.id = 'optimizer-nav';
                } else if (href.includes('templates.html')) {
                    item.classList.add('auth-required');
                    item.id = 'templates-nav';
                } else if (href.includes('analytics.html')) {
                    item.classList.add('auth-required');
                    item.id = 'analytics-nav';
                } else if (href.includes('history.html')) {
                    item.classList.add('auth-required');
                    item.id = 'history-nav';
                }
                
                // Show the item
                item.style.display = 'block';
            }
        });
        
        // Show navigation container
        const navContainer = document.querySelector('.hidden.md\\:flex.items-center.space-x-8');
        if (navContainer) {
            navContainer.classList.remove('hidden');
            navContainer.classList.add('flex');
            navContainer.id = 'authenticated-navigation';
        }
        
        // Hide any sign in/sign up buttons that might exist in the navigation area
        this.hideSignInButtons();
        
        // Show user menu
        this.showUserMenu();
        
        console.log('SessionNavigationManager: Authenticated menu shown');
    }

    /**
     * Show unauthenticated menu (show Sign In/Up, hide authenticated items)
     */
    showUnauthenticatedMenu() {
        // Hide authenticated navigation items
        const authRequiredItems = document.querySelectorAll('.auth-required');
        authRequiredItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Hide navigation container if all items are hidden
        const navContainer = document.querySelector('#authenticated-navigation, .hidden.md\\:flex.items-center.space-x-8');
        if (navContainer) {
            // Check if we should show any public navigation
            const visibleItems = Array.from(navContainer.children).some(child => 
                child.style.display !== 'none' && !child.classList.contains('auth-required')
            );
            
            if (!visibleItems) {
                navContainer.classList.add('hidden');
                navContainer.classList.remove('flex');
            }
        }
        
        // Show sign in buttons
        this.showSignInButtons();
        
        // Hide user menu
        this.hideUserMenu();
        
        console.log('SessionNavigationManager: Unauthenticated menu shown');
    }

    /**
     * Hide authentication buttons
     */
    hideSignInButtons() {
        // Find user menu container
        const userMenuContainer = document.querySelector('.flex.items-center.space-x-4:last-child');
        if (userMenuContainer) {
            // Look for existing authentication buttons and hide them
            const authButtons = userMenuContainer.querySelectorAll('.signin-button, .signup-button, .auth-button, button[onclick*="auth.html"]');
            authButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
    }

    /**
     * Show single authentication button (combines sign in/sign up)
     */
    showSignInButtons() {
        // Find user menu container
        const userMenuContainer = document.querySelector('.flex.items-center.space-x-4:last-child');
        if (!userMenuContainer) {
            console.log('SessionNavigationManager: User menu container not found');
            return;
        }
        
        // Remove any existing authentication buttons first
        const existingButtons = userMenuContainer.querySelectorAll('.signin-button, .signup-button, .auth-button');
        existingButtons.forEach(button => button.remove());
        
        // Create single authentication button
        const authButton = document.createElement('button');
        authButton.className = 'auth-button bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium';
        authButton.textContent = 'Get Started';
        authButton.onclick = () => window.location.href = 'auth.html';
        
        // Add button to container
        userMenuContainer.appendChild(authButton);
        
        console.log('SessionNavigationManager: Single authentication button added');
    }

    /**
     * Show user menu with profile, settings, logout
     */
    showUserMenu() {
        // Find or create user menu button
        let userMenuBtn = document.getElementById('user-menu-btn');
        if (!userMenuBtn) {
            userMenuBtn = this.createUserMenu();
        }
        
        if (userMenuBtn) {
            userMenuBtn.style.display = 'flex';
            
            // Update user menu with actual user data
            this.updateUserMenuData(userMenuBtn);
        }
    }

    /**
     * Hide user menu
     */
    hideUserMenu() {
        const userMenuBtn = document.getElementById('user-menu-btn');
        if (userMenuBtn) {
            userMenuBtn.style.display = 'none';
        }
        
        const userDropdown = document.getElementById('user-dropdown');
        if (userDropdown) {
            userDropdown.classList.add('hidden');
        }
    }

    /**
     * Create user menu if it doesn't exist
     */
    createUserMenu() {
        const userMenuContainer = document.querySelector('.flex.items-center.space-x-4:last-child');
        if (!userMenuContainer) {
            console.error('SessionNavigationManager: Cannot find user menu container');
            return null;
        }
        
        // Create user menu HTML
        const userMenuHTML = `
            <div class="relative">
                <button id="user-menu-btn" class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors">
                    <div id="user-avatar" class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        U
                    </div>
                    <span id="user-display-name" class="hidden md:block text-gray-700 font-medium">User</span>
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                
                <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden z-50">
                    <a href="#" id="profile-link" class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <span class="flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span>Profile</span>
                        </span>
                    </a>
                    <a href="#" id="settings-link" class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <span class="flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>Settings</span>
                        </span>
                    </a>
                    <hr class="my-1">
                    <button id="logout-btn" class="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors">
                        <span class="flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            <span>Logout</span>
                        </span>
                    </button>
                </div>
            </div>
        `;
        
        // Insert user menu
        userMenuContainer.insertAdjacentHTML('beforeend', userMenuHTML);
        
        return document.getElementById('user-menu-btn');
    }

    /**
     * Update user interface with current user data
     */
    updateUserInterface() {
        if (!this.currentUser) {
            console.log('SessionNavigationManager: No user data to display');
            return;
        }
        
        // Update user avatar initials
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            const initials = (this.currentUser.firstName?.charAt(0) || '') + 
                           (this.currentUser.lastName?.charAt(0) || '');
            userAvatar.textContent = initials || this.currentUser.email?.charAt(0).toUpperCase() || 'U';
        }
        
        // Update display name
        const displayName = document.getElementById('user-display-name');
        if (displayName) {
            displayName.textContent = this.currentUser.firstName || this.currentUser.email || 'User';
        }
        
        // Add welcome message to page
        this.addWelcomeMessage();
        
        console.log('SessionNavigationManager: User interface updated');
    }

    /**
     * Update user menu button with user data
     */
    updateUserMenuData(userMenuBtn) {
        if (!this.currentUser || !userMenuBtn) {
            return;
        }
        
        // Update avatar
        const avatar = userMenuBtn.querySelector('#user-avatar');
        if (avatar) {
            const initials = (this.currentUser.firstName?.charAt(0) || '') + 
                           (this.currentUser.lastName?.charAt(0) || '');
            avatar.textContent = initials || 'U';
        }
        
        // Update display name
        const displayName = userMenuBtn.querySelector('#user-display-name');
        if (displayName) {
            displayName.textContent = this.currentUser.firstName || 'User';
        }
    }

    /**
     * Add welcome message to the page
     */
    addWelcomeMessage() {
        // Remove existing welcome message
        const existingWelcome = document.getElementById('welcome-message-banner');
        if (existingWelcome) {
            existingWelcome.remove();
        }
        
        // Find a good place to add welcome message (after navigation)
        const nav = document.querySelector('nav');
        if (nav && this.currentUser) {
            const welcomeBanner = document.createElement('div');
            welcomeBanner.id = 'welcome-message-banner';
            welcomeBanner.className = 'bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 py-3';
            
            const timeOfDay = this.getTimeOfDay();
            
            welcomeBanner.innerHTML = `
                <div class="container mx-auto px-6">
                    <div class="flex items-center justify-between">
                        <p class="text-orange-800 font-medium">
                            Good ${timeOfDay}, ${this.currentUser.firstName || 'User'}! 
                            <span class="text-orange-600">Welcome back to PromptEngine.</span>
                        </p>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                class="text-orange-400 hover:text-orange-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            nav.insertAdjacentElement('afterend', welcomeBanner);
        }
    }

    /**
     * Get time of day for welcome message
     */
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    /**
     * Update page title based on authentication state
     */
    updatePageTitle() {
        const baseTitle = 'PromptEngine - AI-Powered Prompt Optimization Studio';
        
        if (this.isAuthenticated() && this.currentUser) {
            document.title = `Welcome back, ${this.currentUser.firstName}! - ${baseTitle}`;
        } else {
            document.title = baseTitle;
        }
    }

    /**
     * Setup event listeners for user interactions
     */
    setupEventListeners() {
        // Setup logout functionality
        document.addEventListener('click', (event) => {
            if (event.target.id === 'logout-btn' || event.target.closest('#logout-btn')) {
                event.preventDefault();
                this.logoutUser();
            }
        });
        
        // Setup profile/settings links (placeholder functionality)
        document.addEventListener('click', (event) => {
            if (event.target.id === 'profile-link' || event.target.closest('#profile-link')) {
                event.preventDefault();
                this.showProfile();
            }
            
            if (event.target.id === 'settings-link' || event.target.closest('#settings-link')) {
                event.preventDefault();
                this.showSettings();
            }
        });
        
        console.log('SessionNavigationManager: Event listeners setup complete');
    }

    /**
     * Setup dropdown toggle functionality
     */
    setupDropdownToggle() {
        document.addEventListener('click', (event) => {
            const userMenuBtn = document.getElementById('user-menu-btn');
            const userDropdown = document.getElementById('user-dropdown');
            
            if (!userMenuBtn || !userDropdown) {
                return;
            }
            
            // Toggle dropdown if user menu button is clicked
            if (userMenuBtn.contains(event.target)) {
                event.stopPropagation();
                userDropdown.classList.toggle('hidden');
            } else {
                // Close dropdown if clicked outside
                userDropdown.classList.add('hidden');
            }
        });
    }

    /**
     * Setup periodic token validation
     */
    setupTokenValidation() {
        // Check token every 5 minutes
        setInterval(() => {
            if (this.token && !this.validateJWT(this.token)) {
                console.log('SessionNavigationManager: Token expired during session');
                this.logoutUser();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Logout user and clear session
     */
    logoutUser() {
        try {
            console.log('SessionNavigationManager: Logging out user...');
            
            // Confirm logout
            if (this.currentUser) {
                const confirmLogout = confirm(`Are you sure you want to logout, ${this.currentUser.firstName}?`);
                if (!confirmLogout) {
                    return;
                }
            }
            
            // Clear session data
            this.clearSession();
            
            // Update UI
            this.renderMenuBasedOnUser();
            
            // Show logout message
            this.showLogoutMessage();
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('SessionNavigationManager: Logout failed:', error);
        }
    }

    /**
     * Clear all session data
     */
    clearSession() {
        // Clear memory
        this.currentUser = null;
        this.token = null;
        this.tokenExpiry = null;
        
        // Clear localStorage
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Clear any session storage as well
        sessionStorage.removeItem('promptengine_auth');
        
        console.log('SessionNavigationManager: Session cleared');
    }

    /**
     * Show logout confirmation message
     */
    showLogoutMessage() {
        // Remove any existing logout message
        const existingMessage = document.getElementById('logout-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create logout message
        const logoutMessage = document.createElement('div');
        logoutMessage.id = 'logout-message';
        logoutMessage.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        logoutMessage.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Successfully logged out! Redirecting...</span>
            </div>
        `;
        
        document.body.appendChild(logoutMessage);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            logoutMessage.remove();
        }, 3000);
    }

    /**
     * Show profile modal/page (placeholder)
     */
    showProfile() {
        if (!this.currentUser) {
            return;
        }
        
        alert(`Profile Information:\n\nName: ${this.currentUser.firstName} ${this.currentUser.lastName}\nEmail: ${this.currentUser.email}\nRole: ${this.currentUser.role}\n\nFull profile functionality coming soon!`);
    }

    /**
     * Show settings modal/page (placeholder)
     */
    showSettings() {
        alert('Settings functionality coming soon!\n\nThis will include:\n• Account preferences\n• Notification settings\n• Privacy controls\n• Theme selection');
    }

    /**
     * Check if user is currently authenticated
     */
    isAuthenticated() {
        return !!(this.currentUser && this.token && this.validateJWT(this.token));
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get current auth token
     */
    getAuthToken() {
        return this.token;
    }

    /**
     * Manually refresh the UI (useful for external calls)
     */
    refreshUI() {
        this.checkUserSession();
        this.renderMenuBasedOnUser();
    }

    /**
     * Save user session data to localStorage
     * @param {object} userData - User data object
     * @param {string} token - JWT token
     * @param {number} expiresIn - Token expiry in seconds
     */
    saveSession(userData, token, expiresIn = 3600) {
        try {
            const expiryTime = new Date(Date.now() + (expiresIn * 1000));
            
            localStorage.setItem(this.storageKeys.user, JSON.stringify(userData));
            localStorage.setItem(this.storageKeys.token, token);
            localStorage.setItem(this.storageKeys.expiry, expiryTime.toISOString());
            
            this.currentUser = userData;
            this.token = token;
            this.tokenExpiry = expiryTime;
            
            console.log('SessionNavigationManager: Session saved for user:', userData.firstName);
            
        } catch (error) {
            console.error('SessionNavigationManager: Failed to save session:', error);
        }
    }
}

// Global utility functions for external access
window.SessionNavigationManager = SessionNavigationManager;

// Create global instance
window.sessionNavManager = new SessionNavigationManager();

// Export functions for external use
window.SessionNavAPI = {
    isAuthenticated: () => window.sessionNavManager.isAuthenticated(),
    getCurrentUser: () => window.sessionNavManager.getCurrentUser(),
    getAuthToken: () => window.sessionNavManager.getAuthToken(),
    logout: () => window.sessionNavManager.logoutUser(),
    refreshUI: () => window.sessionNavManager.refreshUI(),
    saveSession: (userData, token, expiresIn) => window.sessionNavManager.saveSession(userData, token, expiresIn)
};

console.log('SessionNavigationManager: Script loaded successfully');