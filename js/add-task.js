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
    type: 'free', // 'free', 'standard', 'premium'
    reminders: { default: false, hourly: false, custom: false }
};

/* =========================================================
   ADD TASK PAGE STATE
========================================================= */
const AddTaskState = { isSubmitting: false };

/* =========================================================
   SUBSCRIPTION MANAGEMENT
========================================================= */
function checkSubscription() {
    const storedSubscription = localStorage.getItem('userSubscription');
    if (storedSubscription) UserSubscription.type = storedSubscription;
    updateReminderAccess();
}

function updateReminderAccess() {
    const customOption = document.getElementById('customReminderOption');
    const toggleCustom = document.getElementById('toggleCustom');
    const premiumMsg = document.getElementById('premiumMessage');
    if (!customOption || !toggleCustom) return;

    const hasAccess = UserSubscription.type === 'standard' || UserSubscription.type === 'premium';

    if (hasAccess) {
        customOption.classList.remove('locked');
        toggleCustom.classList.remove('locked');
        const lockIcon = customOption.querySelector('.lock-icon');
        if (lockIcon) lockIcon.remove();
        if (premiumMsg) premiumMsg.classList.remove('show');
    } else {
        customOption.classList.add('locked');
        toggleCustom.classList.add('locked');
    }
}

function upgradeSubscription(plan) {
    UserSubscription.type = plan;
    localStorage.setItem('userSubscription', plan);
    updateReminderAccess();
    showToast(`Subscription upgraded to ${plan.toUpperCase()}!`, 'success');
}

/* =========================================================
   TOGGLE HANDLING
========================================================= */
function setupToggle(toggleId, callback) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        if (toggle.classList.contains('locked')) {
            const premiumMsg = document.getElementById('premiumMessage');
            if (premiumMsg) {
                premiumMsg.classList.add('show');
                setTimeout(() => premiumMsg.classList.remove('show'), 5000);
            }
            return;
        }
        const isActive = toggle.classList.toggle('active');
        if (callback) callback(isActive);
    });
}

function handleDefaultReminder(isActive) { UserSubscription.reminders.default = isActive; }
function handleHourlyReminder(isActive) { UserSubscription.reminders.hourly = isActive; }
function handleCustomReminder(isActive) {
    if (UserSubscription.type === 'free') return;
    UserSubscription.reminders.custom = isActive;
    if (isActive) {
        const customTime = prompt('Enter custom reminder time (e.g., "2 hours before")');
        if (customTime) showToast(`Custom reminder set: ${customTime}`, 'success');
    }
}

/* =========================================================
   FORM VALIDATION & COLLECTION
========================================================= */
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

    const selectedDate = new Date(dueDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (selectedDate < today) { showToast('Due date cannot be in the past', 'error'); return false; }

    return true;
}

function collectFormData() {
    return {
        title: document.getElementById('taskTitle').value.trim(),
        subject: document.getElementById('taskSubject').value,
        category: document.getElementById('taskCategory').value,
        due_date: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        notes: document.getElementById('taskNotes').value.trim(),
        reminders: { ...UserSubscription.reminders }
    };
}

/* =========================================================
   FORM SUBMISSION (DATABASE)
========================================================= */
function handleFormSubmit(e) {
    e.preventDefault();
    if (AddTaskState.isSubmitting || !validateForm()) return;

    AddTaskState.isSubmitting = true;
    const taskData = collectFormData();

    fetch('tasks-actions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', task: taskData })
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === 'success') {
            showToast('Task saved successfully', 'success');
            setTimeout(() => { window.location.href = 'tasks.php'; }, 500);
        } else {
            showToast('Error saving task', 'error');
            AddTaskState.isSubmitting = false;
        }
    })
    .catch(err => { console.error(err); showToast('Error saving task', 'error'); AddTaskState.isSubmitting = false; });
}

/* =========================================================
   FORM RESET & UTILITIES
========================================================= */
function resetForm() {
    document.getElementById('addTaskForm').reset();
    document.querySelectorAll('.toggle-switch').forEach(t => t.classList.remove('active'));
    UserSubscription.reminders = { default: false, hourly: false, custom: false };
    AddTaskState.isSubmitting = false;
}

function setMinDate() {
    const dateInput = document.getElementById('taskDueDate');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}

/* =========================================================
   INITIALIZATION
========================================================= */
function initAddTaskPage() {
    checkSubscription();

    setupToggle('toggleDefault', handleDefaultReminder);
    setupToggle('toggleHour', handleHourlyReminder);
    setupToggle('toggleCustom', handleCustomReminder);

    const form = document.getElementById('addTaskForm');
    if (form) form.addEventListener('submit', handleFormSubmit);

    setMinDate();
}

/* =========================================================
   PAGE LOAD
========================================================= */
document.addEventListener('DOMContentLoaded', initAddTaskPage);
