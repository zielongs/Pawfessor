/* =========================================================
   ADD TASK PAGE – JAVASCRIPT
   ---------------------------------------------------------
   Author: Siti Norlie Yana
   Date: 31 December 2025
   Tested by:
   Updated by:
   Description:
   This script handles the functionality of the Add Task
   page, including:
   - Task creation and validation
   - Subscription-based reminder access
   - Toggle switches for reminders
   - Saving tasks to localStorage

   The script simulates subscription logic for demo purposes
   and does not use a backend API.
========================================================= */

/* =========================================================
   USER SUBSCRIPTION STATE
   ---------------------------------------------------------
   Stores the current user's subscription level and
   reminder permissions.
========================================================= */

const UserSubscription = {
    type: 'free', // Possible values: 'free', 'standard', 'premium'
    reminders: {
        default: false,
        hourly: false,
        custom: false
    }
};


/* =========================================================
   ADD TASK PAGE STATE
   ---------------------------------------------------------
   Used to manage form submission and prevent duplicates.
========================================================= */

const AddTaskState = {
    taskData: {},
    isSubmitting: false
};


/* =========================================================
   SUBSCRIPTION MANAGEMENT
========================================================= */

/**
 * Check user's subscription level
 * In a real application, this would retrieve data
 * from a database or API.
 */
function checkSubscription() {
    const storedSubscription = localStorage.getItem('userSubscription');

    if (storedSubscription) {
        UserSubscription.type = storedSubscription;
    }

    console.log('Current subscription:', UserSubscription.type);

    // Update UI based on subscription level
    updateReminderAccess();
}

/**
 * Enable or restrict reminder options based on subscription
 */
function updateReminderAccess() {
    const customReminderOption = document.getElementById('customReminderOption');
    const toggleCustom = document.getElementById('toggleCustom');
    const premiumMessage = document.getElementById('premiumMessage');

    if (!customReminderOption || !toggleCustom) return;

    const hasAccess =
        UserSubscription.type === 'standard' ||
        UserSubscription.type === 'premium';

    if (hasAccess) {
        // Unlock custom reminder feature
        customReminderOption.classList.remove('locked');
        toggleCustom.classList.remove('locked');

        // Remove lock icon if exists
        const lockIcon = customReminderOption.querySelector('.lock-icon');
        if (lockIcon) lockIcon.remove();

        // Hide premium message
        if (premiumMessage) premiumMessage.classList.remove('show');

        console.log('Custom reminders unlocked');
    } else {
        // Keep feature locked for free users
        customReminderOption.classList.add('locked');
        toggleCustom.classList.add('locked');

        console.log('Custom reminders locked (free user)');
    }
}

/**
 * Simulate upgrading a subscription (for testing only)
 * @param {string} plan - Subscription plan
 */
function upgradeSubscription(plan) {
    UserSubscription.type = plan;
    localStorage.setItem('userSubscription', plan);

    updateReminderAccess();
    showToast(`Subscription upgraded to ${plan.toUpperCase()}!`, 'success');
}


/* =========================================================
   TOGGLE SWITCH HANDLING
========================================================= */

/**
 * Attach toggle behaviour to reminder switches
 * @param {string} toggleId - Toggle element ID
 * @param {Function} callback - Function to execute on toggle
 */
function setupToggle(toggleId, callback) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;

    toggle.addEventListener('click', function () {
        // Prevent interaction if toggle is locked
        if (toggle.classList.contains('locked')) {
            const premiumMessage = document.getElementById('premiumMessage');
            if (premiumMessage) {
                premiumMessage.classList.add('show');
                setTimeout(() => premiumMessage.classList.remove('show'), 5000);
            }
            return;
        }

        // Toggle active state
        const isActive = toggle.classList.toggle('active');

        if (callback) callback(isActive);
    });
}

/**
 * Handle default reminder toggle
 */
function handleDefaultReminder(isActive) {
    UserSubscription.reminders.default = isActive;
    console.log('Default reminder:', isActive ? 'ON' : 'OFF');
}

/**
 * Handle 1-hour reminder toggle
 */
function handleHourlyReminder(isActive) {
    UserSubscription.reminders.hourly = isActive;
    console.log('1-hour reminder:', isActive ? 'ON' : 'OFF');
}

/**
 * Handle custom reminder toggle
 */
function handleCustomReminder(isActive) {
    if (UserSubscription.type === 'free') {
        console.log('Custom reminders require subscription');
        return;
    }

    UserSubscription.reminders.custom = isActive;
    console.log('Custom reminder:', isActive ? 'ON' : 'OFF');

    // Prompt user for custom reminder input (demo)
    if (isActive) {
        const customTime = prompt(
            'Enter custom reminder time (e.g., "2 hours before")'
        );
        if (customTime) {
            showToast(`Custom reminder set: ${customTime}`, 'success');
        }
    }
}


/* =========================================================
   FORM VALIDATION
========================================================= */

/**
 * Validate all required form inputs
 * @returns {boolean} - Validation result
 */
function validateForm() {
    const title = document.getElementById('taskTitle').value.trim();
    const subject = document.getElementById('taskSubject').value;
    const category = document.getElementById('taskCategory').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title || !subject || !category || !dueDate || !priority) {
        showToast('Please complete all required fields', 'error');
        return false;
    }

    // Ensure due date is not in the past
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showToast('Due date cannot be in the past', 'error');
        return false;
    }

    return true;
}


/* =========================================================
   FORM DATA COLLECTION
========================================================= */

/**
 * Gather validated form data into an object
 * @returns {Object} Task object
 */
function collectFormData() {
    return {
        id: Date.now(),
        title: validateInput(document.getElementById('taskTitle').value.trim()),
        subject: document.getElementById('taskSubject').value,
        category: document.getElementById('taskCategory').value,
        dueDate: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        notes: validateInput(document.getElementById('taskNotes').value.trim()),
        reminders: { ...UserSubscription.reminders },
        completed: false,
        createdAt: new Date().toISOString()
    };
}


/* =========================================================
   FORM SUBMISSION
========================================================= */

/**
 * Handle Add Task form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();

    if (AddTaskState.isSubmitting || !validateForm()) return;

    AddTaskState.isSubmitting = true;

    const taskData = collectFormData();
    saveTaskToStorage(taskData);

    showToast('Task saved successfully', 'success');
    resetForm();

    // Redirect to tasks page
    setTimeout(() => {
        window.location.href = 'tasks.html';
    }, 1000);
}


/* =========================================================
   LOCAL STORAGE HANDLING
========================================================= */

/**
 * Save task data to localStorage
 * @param {Object} taskData
 */
function saveTaskToStorage(taskData) {
    try {
        const storedTasks = localStorage.getItem('userTasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];

        tasks.unshift(taskData);
        localStorage.setItem('userTasks', JSON.stringify(tasks));

        console.log('Task saved successfully');
    } catch (error) {
        console.error('Storage error:', error);
        showToast('Error saving task', 'error');
    }
}


/* =========================================================
   FORM RESET & UTILITIES
========================================================= */

/**
 * Reset the Add Task form and state
 */
function resetForm() {
    document.getElementById('addTaskForm').reset();

    document.querySelectorAll('.toggle-switch').forEach(toggle =>
        toggle.classList.remove('active')
    );

    UserSubscription.reminders = {
        default: false,
        hourly: false,
        custom: false
    };

    AddTaskState.isSubmitting = false;
}

/**
 * Restrict due date selection to today onwards
 */
function setMinDate() {
    const dateInput = document.getElementById('taskDueDate');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

/**
 * Initialize Add Task page functionality
 */
function initAddTaskPage() {
    console.log('Initializing Add Task page');

    checkSubscription();

    setupToggle('toggleDefault', handleDefaultReminder);
    setupToggle('toggleHour', handleHourlyReminder);
    setupToggle('toggleCustom', handleCustomReminder);

    const form = document.getElementById('addTaskForm');
    if (form) form.addEventListener('submit', handleFormSubmit);

    setMinDate();
}


/* =========================================================
   DEBUG / TEST FUNCTIONS
========================================================= */

window.testUpgrade = function (plan) {
    upgradeSubscription(plan);
};

window.resetSubscription = function () {
    upgradeSubscription('free');
};


/* =========================================================
   PAGE LOAD EVENT
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('add-task.html')) {
        initAddTaskPage();
    }
});
