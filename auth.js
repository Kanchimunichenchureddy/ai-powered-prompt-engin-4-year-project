// Authentication Management System
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Tab switching
        document.getElementById('login-tab').addEventListener('click', () => this.showLoginForm());
        document.getElementById('register-tab').addEventListener('click', () => this.showRegisterForm());

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

        // Password visibility toggles
        document.getElementById('toggle-login-password').addEventListener('click', () => this.togglePasswordVisibility('login-password'));
        document.getElementById('toggle-register-password').addEventListener('click', () => this.togglePasswordVisibility('register-password'));

        // Real-time validation
        document.getElementById('register-password').addEventListener('input', () => this.validatePassword());
        document.getElementById('register-confirm-password').addEventListener('input', () => this.validatePasswordMatch());
    }

    showLoginForm() {
        document.getElementById('login-tab').classList.add('bg-white', 'text-gray-800', 'shadow-sm');
        document.getElementById('login-tab').classList.remove('text-gray-600');
        document.getElementById('register-tab').classList.remove('bg-white', 'text-gray-800', 'shadow-sm');
        document.getElementById('register-tab').classList.add('text-gray-600');

        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');

        anime({
            targets: '#login-form',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    showRegisterForm() {
        document.getElementById('register-tab').classList.add('bg-white', 'text-gray-800', 'shadow-sm');
        document.getElementById('register-tab').classList.remove('text-gray-600');
        document.getElementById('login-tab').classList.remove('bg-white', 'text-gray-800', 'shadow-sm');
        document.getElementById('login-tab').classList.add('text-gray-600');

        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');

        anime({
            targets: '#register-form',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(`toggle-${inputId}`);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>`;
        } else {
            input.type = 'password';
            button.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
        }
    }

    validatePassword() {
        const password = document.getElementById('register-password').value;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password)
        };

        Object.keys(checks).forEach(check => {
            const element = document.getElementById(`${check}-check`);
            const circle = element.querySelector('span');
            
            if (checks[check]) {
                element.classList.remove('text-gray-400');
                element.classList.add('text-green-500');
                circle.classList.remove('bg-gray-300');
                circle.classList.add('bg-green-500');
            } else {
                element.classList.remove('text-green-500');
                element.classList.add('text-gray-400');
                circle.classList.remove('bg-green-500');
                circle.classList.add('bg-gray-300');
            }
        });

        return Object.values(checks).every(Boolean);
    }

    validatePasswordMatch() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const matchIndicator = document.getElementById('password-match');

        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                matchIndicator.classList.add('hidden');
                return true;
            } else {
                matchIndicator.classList.remove('hidden');
                matchIndicator.innerHTML = '<span class="text-red-500">Passwords do not match</span>';
                return false;
            }
        }
        return false;
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        this.setButtonLoading('login-btn', 'login-btn-text', 'login-spinner', true);

        try {
            const response = await this.loginUser(email, password);
            
            if (response.success) {
                this.storeSession(response, rememberMe);
                this.showMessage(`Welcome back, ${response.user.firstName}!`, 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showMessage(response.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please check your credentials.', 'error');
        } finally {
            this.setButtonLoading('login-btn', 'login-btn-text', 'login-spinner', false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const firstName = document.getElementById('register-firstname').value;
        const lastName = document.getElementById('register-lastname').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        if (!this.validatePassword() || !this.validatePasswordMatch() || !agreeTerms) {
            this.showMessage('Please fill out the form correctly.', 'error');
            return;
        }

        this.setButtonLoading('register-btn', 'register-btn-text', 'register-spinner', true);

        try {
            const response = await this.registerUser({ firstName, lastName, email, password });

            if (response.success) {
                this.showMessage('Account created successfully! Please log in.', 'success');
                this.showLoginForm();
            } else {
                this.showMessage(response.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage('Network error. Please check your connection.', 'error');
        } finally {
            this.setButtonLoading('register-btn', 'register-btn-text', 'register-spinner', false);
        }
    }

    async loginUser(email, password) {
        try {
            const apiResponse = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });
            
            if (apiResponse.ok) {
                const data = await apiResponse.json();
                // The backend is returning user info nested under 'user'
                const user = data.user || data; 
                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    },
                    token: data.access_token
                };
            }
            const errorData = await apiResponse.json();
            return { success: false, message: errorData.detail || 'Invalid email or password' };
        } catch (e) {
            console.error("Login API error:", e);
            return { success: false, message: 'Could not connect to the backend. Please ensure the backend server is running and accessible.' };
        }
    }
    
    async registerUser(userData) {
        try {
            const apiResponse = await fetch('http://127.0.0.1:8000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (apiResponse.ok) {
                const data = await apiResponse.json();
                return {
                    success: true,
                    user: data.user
                };
            }
            const errorData = await apiResponse.json();
            return { success: false, message: errorData.detail || 'Registration failed' };
        } catch (e) {
            console.error("Registration API error:", e);
            return { success: false, message: 'Could not connect to the backend. Please ensure the backend server is running.' };
        }
    }

    storeSession(response, rememberMe) {
        const authData = {
            user: response.user,
            token: response.token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        };

        if (rememberMe) {
            localStorage.setItem('promptengine_auth', JSON.stringify(authData));
        } else {
            sessionStorage.setItem('promptengine_auth', JSON.stringify(authData));
        }
    }

    async simulateLogin(email, password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const users = JSON.parse(localStorage.getItem('promptengine_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            return {
                success: true,
                user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
                token: 'simulated_jwt_' + Math.random().toString(36).substr(2, 9)
            };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    async simulateRegister(userData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const users = JSON.parse(localStorage.getItem('promptengine_users') || '[]');
        
        if (users.find(user => user.email === userData.email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            ...userData,
            role: 'user'
        };
        users.push(newUser);
        localStorage.setItem('promptengine_users', JSON.stringify(users));

        return {
            success: true,
            user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, role: newUser.role },
            token: 'simulated_jwt_' + Math.random().toString(36).substr(2, 9)
        };
    }

    setButtonLoading(btnId, textId, spinnerId, loading) {
        const button = document.getElementById(btnId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(spinnerId);

        if (loading) {
            button.disabled = true;
            text.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            text.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    showMessage(message, type) {
        const container = document.getElementById('message-container');
        const messageElement = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        messageElement.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-2 transform translate-x-full`;
        messageElement.innerHTML = `<div>${message}</div>`;
        container.appendChild(messageElement);

        anime({
            targets: messageElement,
            translateX: [400, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });

        setTimeout(() => {
            anime({
                targets: messageElement,
                translateX: [0, 400],
                opacity: [1, 0],
                duration: 300,
                complete: () => messageElement.remove()
            });
        }, 5000);
    }

    setupFormValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });
        });
    }

    initializeAnimations() {
        anime({
            targets: '.auth-card',
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutQuart'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});