# Role-Based UI Implementation Guide

## Overview
This implementation provides a complete role-based UI system for PromptEngine that dynamically shows/hides navigation items and user interface elements based on authentication status.

## Files Modified/Created

### 1. `index.html` - Updated Navigation Structure
- Added authentication-based navigation items with proper IDs
- Added guest user buttons (Sign In/Sign Up)
- Enhanced user profile section with dropdown menu
- All navigation items now have proper visibility controls

### 2. `auth-manager.js` - Core Authentication Manager
A comprehensive JavaScript class that handles:
- JWT token validation and decoding
- Authentication status checking
- UI rendering based on login state
- User session management
- Logout functionality

## How It Works

### A. When User IS NOT Logged In (Guest UI)
**Hidden Elements:**
- `#nav-templates` - Templates link
- `#nav-analytics` - Analytics link  
- `#nav-history` - History link
- `#user-profile` - User profile section

**Visible Elements:**
- `#guest-nav` - Sign In and Sign Up buttons
- Optimizer link (always visible)

### B. When User IS Logged In (Authenticated UI)
**Visible Elements:**
- `#nav-templates` - Templates link
- `#nav-analytics` - Analytics link
- `#nav-history` - History link
- `#user-profile` - User profile with name, role, avatar
- Profile and Settings dropdown options
- Logout button

**Hidden Elements:**
- `#guest-nav` - Sign In/Sign Up buttons

## Key Functions

### Authentication Check Flow
```javascript
1. checkAuthStatus() → Called on page load
2. getStoredAuth() → Checks localStorage and sessionStorage
3. isTokenExpired() → Validates token expiration
4. validateToken() → Backend validation or JWT decode
5. renderAuthenticatedUI() or renderGuestUI() → Updates UI
```

### Core Functions Available

```javascript
// Global access functions
window.AuthManager.getCurrentUser()     // Get current user object
window.AuthManager.isAuthenticated()    // Check if user is logged in
window.AuthManager.hasRole(role)        // Check user role
window.AuthManager.logout()             // Logout user
window.AuthManager.checkAuth()          // Re-check authentication
```

## Integration with Existing Auth System

The system integrates with your existing `auth.js` authentication:

1. **Login Flow**: After successful login in `auth.js`, user is redirected to `index.html`
2. **Token Storage**: Uses existing localStorage/sessionStorage structure
3. **User Data**: Compatible with existing user object format
4. **Backend Integration**: Can call `/user/profile` endpoint for validation

## Token Storage Format

The system expects this format in localStorage/sessionStorage:
```javascript
{
    user: {
        id: "user_id",
        email: "user@example.com", 
        firstName: "John",
        lastName: "Doe",
        role: "user"
    },
    token: "jwt_token_string",
    expiresAt: "2024-01-01T00:00:00.000Z",
    rememberMe: true
}
```

## UI Elements Structure

### Navigation Items
```html
<!-- Always visible -->
<a href="index.html">Optimizer</a>

<!-- Auth-required (hidden by default) -->
<a href="templates.html" id="nav-templates" class="hidden">Templates</a>
<a href="analytics.html" id="nav-analytics" class="hidden">Analytics</a>  
<a href="history.html" id="nav-history" class="hidden">History</a>
```

### Authentication Section
```html
<!-- Guest buttons -->
<div id="guest-nav">
    <a href="auth.html">Sign In</a>
    <a href="auth.html">Sign Up</a>
</div>

<!-- User profile (hidden by default) -->
<div id="user-profile" class="hidden">
    <div id="user-name"></div>
    <div id="user-role"></div>
    <div id="user-avatar"></div>
    <!-- Dropdown menu with Profile, Settings, Logout -->
</div>
```

## Features

### 🔐 Security
- JWT token validation
- Token expiration checking
- Automatic logout on invalid tokens
- Secure token storage

### 🎨 UI/UX
- Smooth show/hide transitions
- User avatar with initials
- Dropdown menu for user actions
- Notification system for auth events

### 🔧 Flexibility
- Works with or without backend
- Fallback JWT decoding
- Compatible with existing auth system
- Easy to extend with new roles

### 📱 Responsive
- Mobile-friendly navigation
- Proper accessibility attributes
- Clean visual states

## Testing

Use the test file `tmp_rovodev_test_auth.html` to:
1. Simulate login/logout
2. Check authentication status
3. Verify UI state changes
4. Test token validation

## Backend Integration

### Required Endpoints
```javascript
// Login endpoint (existing)
POST /auth/login
Response: { user: {...}, access_token: "jwt_token" }

// Profile validation endpoint
GET /user/profile
Headers: { Authorization: "Bearer jwt_token" }
Response: { user: {...} }
```

## Usage Examples

### Check Authentication Status
```javascript
if (window.AuthManager.isAuthenticated()) {
    console.log('User is logged in:', window.AuthManager.getCurrentUser());
} else {
    console.log('User is not authenticated');
}
```

### Role-Based Features
```javascript
if (window.AuthManager.hasRole('admin')) {
    // Show admin features
}
```

### Manual Logout
```javascript
window.AuthManager.logout(); // Clears tokens and redirects
```

## Implementation Benefits

✅ **Complete Solution**: Handles all authentication UI states
✅ **Easy Integration**: Works with existing auth system  
✅ **Secure**: Proper token validation and expiration
✅ **User-Friendly**: Clean UI transitions and notifications
✅ **Maintainable**: Well-structured, documented code
✅ **Flexible**: Easy to customize and extend

## Next Steps

1. Test the implementation with your existing auth flow
2. Customize the UI styling to match your design
3. Add any additional role-based features as needed
4. Consider adding refresh token functionality
5. Implement backend profile validation endpoint

The system is now ready to provide a complete role-based UI experience for your PromptEngine application!