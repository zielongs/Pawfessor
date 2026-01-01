/* ============================================
   SECURITY FUNCTIONS
-----------------------------------------------
    Author: Siti Norlie Yana
    Date: 31 December 2025
    Tested by:
    Updated by:
    Description:
     Handles XSS Prevention and Input Validation
   ============================================ */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string safe for HTML insertion
 */
function escapeHTML(str) {
    if (typeof str !== 'string') {
        return '';
    }
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Validates and sanitizes user input
 * Removes potentially dangerous characters
 * @param {string} input - The input to validate
 * @returns {string} - The sanitized input
 */
function validateInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    
    // Remove potentially dangerous characters
    // Remove: < > " ' / \ and other special chars that could be used in attacks
    return input.replace(/[<>"'\/\\]/g, '');
}

/**
 * Sanitizes URLs to prevent javascript: and data: URI attacks
 * @param {string} url - The URL to sanitize
 * @returns {string|null} - The sanitized URL or null if invalid
 */
function sanitizeURL(url) {
    if (typeof url !== 'string') {
        return null;
    }
    
    // Convert to lowercase for checking
    const lowerURL = url.toLowerCase().trim();
    
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    for (let protocol of dangerousProtocols) {
        if (lowerURL.startsWith(protocol)) {
            console.warn('Blocked dangerous URL protocol:', protocol);
            return null;
        }
    }
    
    // Only allow http, https, and relative URLs
    if (lowerURL.startsWith('http://') || 
        lowerURL.startsWith('https://') || 
        lowerURL.startsWith('/') ||
        lowerURL.startsWith('./') ||
        lowerURL.startsWith('../') ||
        !lowerURL.includes(':')) {
        return url;
    }
    
    console.warn('Blocked invalid URL:', url);
    return null;
}

/**
 * Validates file paths to prevent directory traversal attacks
 * @param {string} path - The file path to validate
 * @returns {boolean} - True if path is safe, false otherwise
 */
function validateFilePath(path) {
    if (typeof path !== 'string') {
        return false;
    }
    
    // Block directory traversal attempts
    const dangerousPatterns = [
        '..',           // Parent directory
        '~/',           // Home directory
        '/etc/',        // System directories
        '/usr/',
        '/var/',
        'c:',           // Windows drives
        'd:',
        '\\\\',         // Network paths
    ];
    
    const lowerPath = path.toLowerCase();
    
    for (let pattern of dangerousPatterns) {
        if (lowerPath.includes(pattern)) {
            console.warn('Blocked dangerous file path pattern:', pattern);
            return false;
        }
    }
    
    return true;
}

/**
 * Sanitizes data before storing in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - True if stored successfully
 */
function secureLocalStorage(key, value) {
    try {
        const sanitizedKey = validateInput(key);
        const sanitizedValue = typeof value === 'string' ? 
            validateInput(value) : JSON.stringify(value);
        
        localStorage.setItem(sanitizedKey, sanitizedValue);
        return true;
    } catch (error) {
        console.error('Error storing data securely:', error);
        return false;
    }
}

/**
 * Retrieves and validates data from localStorage
 * @param {string} key - Storage key
 * @returns {string|null} - Retrieved value or null
 */
function secureGetStorage(key) {
    try {
        const sanitizedKey = validateInput(key);
        const value = localStorage.getItem(sanitizedKey);
        
        if (value === null) {
            return null;
        }
        
        // Return sanitized value
        return escapeHTML(value);
    } catch (error) {
        console.error('Error retrieving data securely:', error);
        return null;
    }
}

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates numeric input
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean} - True if valid number within range
 */
function validateNumber(value, min = null, max = null) {
    const num = Number(value);
    
    if (isNaN(num)) {
        return false;
    }
    
    if (min !== null && num < min) {
        return false;
    }
    
    if (max !== null && num > max) {
        return false;
    }
    
    return true;
}

/**
 * Creates a secure random token
 * @param {number} length - Length of the token
 * @returns {string} - Random token
 */
function generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return token;
}

// Export functions for use in other files (if using modules)
// For now, these are globally available
console.log('Security module loaded successfully');