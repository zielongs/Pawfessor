/* ============================================
   DASHBOARD PAGE - JAVASCRIPT
    Author: Siti Norlie Yana
    Date: 31 December 2025
    Tested by:
    Updated by:

   Description:
   - Displays today's tasks
   - Shows overall & weekly task progress
   - Shows upcoming deadlines with fire icon
   - Data source is localStorage (userTasks)
   ============================================ */


/* ============================================
   DASHBOARD STATE
   --------------------------------------------
   This state is mainly used for rendering UI
   sections such as today's tasks and deadlines.
   Progress bars intentionally recalculate
   directly from localStorage to avoid stale data.
   ============================================ */
const DashboardState = {
    tasks: [],
    todayTasks: [],
    deadlines: []
};


/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Formats a date into a readable short format
 * Example: Mon, 30 Dec
 */
function formatDate(date) {
    if (!date) return 'No due date';
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Returns progress bar color based on percentage
 */
function getProgressColor(percent) {
    if (percent === 100) return '#2e7d32'; // dark green
    if (percent >= 60) return '#4CAF50';  // green
    if (percent >= 30) return '#FFC107';  // yellow
    return '#F44336';                     // red
}

/**
 * Returns today's date with time normalized
 * Used to avoid timezone comparison issues
 */
function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}


/* ============================================
   LOAD TASKS
   --------------------------------------------
   Loads all tasks from localStorage and
   determines which tasks are due today.
   ============================================ */
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
    const today = getTodayDate();

    DashboardState.tasks = storedTasks;

    // Filter tasks due today only
    DashboardState.todayTasks = storedTasks.filter(task => {
        if (!task.dueDate) return false;

        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);

        return due.getTime() === today.getTime();
    });
}


/* ============================================
   RENDER TODAY'S TASKS
   --------------------------------------------
   Displays tasks that are due today only.
   ============================================ */
function renderTodayTasks() {
    const container = document.getElementById('todayTasksContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!DashboardState.todayTasks.length) {
        container.innerHTML = '<p style="padding:15px;">No tasks for today 🎉</p>';
        return;
    }

    DashboardState.todayTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '10px 15px';

        // Left side (icon + title)
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        const icon = document.createElement('span');
        icon.innerHTML = task.completed
        ? '<img src="images/check_icon.png" alt="Completed" width="20" height="20">'
        : '<img src="images/pin_icon.png" alt="Pending" width="20" height="20">';

        icon.style.fontSize = '22px';

        const title = document.createElement('strong');
        title.textContent = task.title;

        left.appendChild(icon);
        left.appendChild(title);

        // Right side (date + arrow)
        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.alignItems = 'center';
        right.style.gap = '10px';

        const due = document.createElement('span');
        due.textContent = formatDate(task.dueDate);

        const arrow = document.createElement('button');
        arrow.className = 'arrow-btn';
        arrow.textContent = '→';
        arrow.onclick = () => viewTaskDetails(task.id);

        right.appendChild(due);
        right.appendChild(arrow);

        item.appendChild(left);
        item.appendChild(right);

        container.appendChild(item);
    });
}


/* ============================================
   PROGRESS SUMMARY
   --------------------------------------------
   - Task Completed: ALL tasks (overall)
   - Weekly Progress: tasks due this week
   Progress is calculated directly from
   localStorage to ensure latest data.
   ============================================ */
function updateProgressBars() {
    const tasks = JSON.parse(localStorage.getItem('userTasks')) || [];

    /* ===== OVERALL TASK COMPLETION ===== */
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed === true).length;

    const overallPercent = totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const overallBar = document.getElementById('todayTaskProgress');
    const overallText = document.getElementById('taskPercent');

    overallBar.style.width = overallPercent + '%';
    overallBar.style.backgroundColor = getProgressColor(overallPercent);
    overallText.textContent = `${completedTasks}/${totalTasks}`;

    /* ===== WEEKLY PROGRESS ===== */
    const today = getTodayDate();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weeklyTasks = tasks.filter(task => {
        if (!task.dueDate) return false;

        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);

        return due >= startOfWeek && due <= endOfWeek;
    });

    const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;
    const weeklyPercent = weeklyTasks.length === 0
        ? 0
        : Math.round((weeklyCompleted / weeklyTasks.length) * 100);

    const weeklyBar = document.getElementById('weeklyProgress');
    const weeklyText = document.getElementById('weeklyPercent');

    weeklyBar.style.width = weeklyPercent + '%';
    weeklyBar.style.backgroundColor = getProgressColor(weeklyPercent);
    weeklyText.textContent = weeklyPercent + '%';
}


/* ============================================
   DEADLINES
   --------------------------------------------
   Loads upcoming tasks (today and future)
   and displays up to 5 nearest deadlines.
   ============================================ */
function loadDeadlines() {
    const tasks = JSON.parse(localStorage.getItem('userTasks') || []);
    const today = getTodayDate();

    DashboardState.deadlines = tasks
        .filter(task => {
            if (!task.dueDate) return false;

            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);

            return due >= today;
        })
        .map(task => {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            return {
                id: task.id,
                title: task.title,
                date: dueDate,
                daysUntil: Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
            };
        })
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);
}


/* ============================================
   RENDER DEADLINES
   --------------------------------------------
   Displays upcoming deadlines with fire icon
   to indicate urgency.
   ============================================ */
function renderDeadlines() {
    const container = document.getElementById('deadlinesContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!DashboardState.deadlines.length) {
        container.innerHTML = '<p style="padding:15px;">No upcoming deadlines 🎉</p>';
        return;
    }

    DashboardState.deadlines.forEach(d => {
        const item = document.createElement('div');
        item.className = 'deadline-item';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '10px';

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        // Fire icon image
        const fire = document.createElement('img');
        fire.src = 'images/Dashboard/s_deadlines.png';
        fire.alt = 'Urgent';
        fire.style.width = '26px';
        fire.style.height = '26px';

        const info = document.createElement('div');
        info.innerHTML = `
            <strong>${d.title}</strong><br>
            <small>${d.daysUntil} days left</small>
        `;

        left.appendChild(fire);
        left.appendChild(info);

        const arrow = document.createElement('button');
        arrow.className = 'arrow-btn';
        arrow.textContent = '→';
        arrow.onclick = () => viewTaskDetails(d.id);

        item.appendChild(left);
        item.appendChild(arrow);
        container.appendChild(item);
    });
}


/* ============================================
   TASK DETAILS (Simple Alert View)
   ============================================ */
function viewTaskDetails(taskId) {
    const tasks = JSON.parse(localStorage.getItem('userTasks') || []);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    alert(`
Task Details
──────────────
Title: ${task.title}
Due: ${formatDate(task.dueDate)}
Status: ${task.completed ? 'Completed' : 'Pending'}
`);
}


/* ============================================
   INITIALIZATION
   --------------------------------------------
   Loads data and renders all dashboard sections
   ============================================ */
function initDashboard() {
    loadTasks();
    loadDeadlines();
    renderTodayTasks();
    renderDeadlines();
    updateProgressBars();
}


/* ============================================
   RUN ON PAGE LOAD
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();
    if (page === 'dashboard.html' || page === '') {
        initDashboard();
    }
});
