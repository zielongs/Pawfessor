/* =========================================================
   MAIN JAVASCRIPT - SHARED FUNCTIONS
   ---------------------------------------------------------
   Author: Siti Norlie Yana
   Date: 31 December 2025
   Tested by:
   Updated by:
   Description:
   Common functions used across all pages
========================================================= */

// Global state management
const AppState = {
    currentUser: 'Yana',
    isMobileMenuOpen: false,
    notifications: [],
};

/* ============================================
   MOBILE MENU FUNCTIONS
   ============================================ */

/**
 * Toggles the mobile sidebar menu
 */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
        AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
    }
}

/**
 * Closes mobile menu when clicking outside
 */
function setupMobileMenuClose() {
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (!sidebar || !menuToggle) return;
        
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            AppState.isMobileMenuOpen = false;
        }
    });
}

/* ============================================
   NAVIGATION FUNCTIONS
   ============================================ */

/**
 * Handles page navigation and active menu highlighting
 * @param {Event} event - Click event
 * @param {string} page - Page name to navigate to
 */
function navigateTo(event, page) {
    if (event) {
        event.preventDefault();
    }
    
    const safePage = escapeHTML(page);
    
    // Update active menu item
    updateActiveMenuItem(event ? event.currentTarget : null);
    
    // Close mobile menu if open
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
            AppState.isMobileMenuOpen = false;
        }
    }
    
    console.log('Navigating to:', safePage);
}

/**
 * Updates the active menu item styling
 * @param {HTMLElement} clickedItem - The menu item that was clicked
 */
function updateActiveMenuItem(clickedItem) {
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current page or clicked item
    if (clickedItem) {
        clickedItem.classList.add('active');
    } else {
        // Find and activate the menu item matching current page
        document.querySelectorAll('.menu-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            }
        });
    }
}

/* ============================================
   GREETING FUNCTIONS
   ============================================ */

/**
 * Updates greeting based on current time of day
 */
function updateGreeting() {
    const greetingEl = document.querySelector('.greeting');
    const userNameEl = document.getElementById('userName');
    
    if (!greetingEl || !userNameEl) return;
    
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    
    if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
    } else if (hour >= 17) {
        greeting = 'Good evening';
    }
    
    const userName = escapeHTML(AppState.currentUser);
    greetingEl.innerHTML = greeting + ', <strong>' + userName + '</strong>';
    userNameEl.textContent = userName;
}

/* ============================================
   NOTIFICATION FUNCTIONS
   ============================================ */

/**
 * Shows notifications to the user
 */
function showNotifications() {
    // In a real app, this would fetch from a server
    const notifications = [
        'New assignment posted',
        'Quiz reminder: Biology Quiz tomorrow',
        'Progress update available',
        'Subscription renewal due in 3 days'
    ];
    
    const message = 'Notifications:\n• ' + notifications.join('\n• ');
    alert(message);
}

/**
 * Adds a notification to the system
 * @param {string} message - Notification message
 */
function addNotification(message) {
    const safeMessage = escapeHTML(message);
    AppState.notifications.push({
        message: safeMessage,
        timestamp: new Date().toISOString(),
        read: false
    });
}

/* ============================================
   USER PROFILE FUNCTIONS
   ============================================ */

/**
 * Shows user profile options
 */
function showProfile() {
    const options = [
        'View Profile',
        'Edit Settings',
        'Change Password',
        'Logout'
    ];
    
    const message = 'Profile Options:\n• ' + options.join('\n• ');
    alert(message);
}

/**
 * Updates user information
 * @param {Object} userData - User data object
 */
function updateUserData(userData) {
    if (!userData || typeof userData !== 'object') {
        console.error('Invalid user data');
        return false;
    }
    
    // Sanitize user data
    if (userData.name) {
        AppState.currentUser = escapeHTML(userData.name);
        updateGreeting();
    }
    
    return true;
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Formats a date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

/**
 * Calculates days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} - Number of days between dates
 */
function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Shows a custom toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
    const safeMessage = escapeHTML(message);
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = safeMessage;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize common functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js initialized');
    
    // Setup mobile menu close functionality
    setupMobileMenuClose();
    
    // Update greeting
    updateGreeting();
    
    // Update active menu item based on current page
    updateActiveMenuItem();
    
    // Setup menu toggle button
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Setup notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }
    
    // Setup profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', showProfile);
    }
    
    console.log('Page loaded successfully');
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);