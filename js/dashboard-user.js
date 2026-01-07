/* ============================================
   DASHBOARD STATE
   --------------------------------------------
   This state is mainly used for rendering UI
   sections such as today's tasks and deadlines.
   Progress bars intentionally recalculate
   directly from localStorage to avoid stale data.
   ============================================ */
console.log('dashboard-user.js loaded');

const DashboardState = {
    tasks: []
};

/* =========================================
   DATE HELPERS
========================================= */
function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function normalizeDate(dateStr) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDate(dateStr) {
    if (!dateStr) return 'No due date';
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}

/* =========================================
   FETCH TASKS
========================================= */
async function fetchDashboardTasks() {
    try {
        const res = await fetch('tasks-actions.php', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'fetch' })
        });

        const data = await res.json();

        if (data.status === 'success') {
            DashboardState.tasks = data.tasks;

            // Render all sections after fetching
            renderTodayTasks();
            renderUpcomingDeadlines();
            renderProgress();
        } else {
            console.error('Fetch tasks error:', data.message);
        }
    } catch (err) {
        console.error('Dashboard fetch error:', err);
    }
}

/* =========================================
   RENDER TODAY'S TASKS
========================================= */
function renderTodayTasks() {
    const container = document.getElementById('todayTasksContainer');
    if (!container) return;

    container.innerHTML = '';
    const today = todayStr();

    // Filter today's tasks
    let todayTasks = DashboardState.tasks.filter(t => {
        return t.due_date && t.due_date.split(' ')[0] === today;
    });

    if (todayTasks.length === 0) {
        container.innerHTML = '<p style="padding:15px;">No tasks for today 🎉</p>';
        return;
    }

    // Map priority to number for sorting: high=1, medium=2, low=3
    const priorityMap = { 'high': 1, 'medium': 2, 'low': 3 };

    // Sort by priority
    todayTasks.sort((a, b) => priorityMap[a.priority.toLowerCase()] - priorityMap[b.priority.toLowerCase()]);

    // Take only first 5 tasks
    todayTasks = todayTasks.slice(0, 5);

    // Render tasks
    todayTasks.forEach(task => {
        const row = document.createElement('div');
        row.className = 'task-item';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px 15px';
        row.style.borderBottom = '1px solid #ddd';

        // Optional: color code by priority
        const color = task.priority.toLowerCase() === 'high' ? '#F44336' :
                      task.priority.toLowerCase() === 'medium' ? '#FFC107' : '#4CAF50';
        row.style.borderLeft = `4px solid ${color}`;

        row.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <img src="${task.completed ? 'images/check_icon.png' : 'images/pin_icon.png'}" width="20">
                <strong>${task.title}</strong>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <span>${formatDate(task.due_date)}</span>
                <button class="arrow-btn" onclick="location.href='tasks.php'">→</button>
            </div>
        `;

        container.appendChild(row);
    });
}


/* =========================================
   RENDER UPCOMING DEADLINES
========================================= */
function renderUpcomingDeadlines() {
    const container = document.getElementById('deadlinesContainer');
    if (!container) return;

    container.innerHTML = '';

    const today = normalizeDate(todayStr());

    const upcoming = DashboardState.tasks
        .filter(t => t.due_date)
        .map(t => {
            const due = normalizeDate(t.due_date);
            return {
                ...t,
                due,
                daysLeft: Math.ceil((due - today) / (1000 * 60 * 60 * 24))
            };
        })
        .filter(t => t.daysLeft >= 0)
        .sort((a, b) => a.due - b.due)
        .slice(0, 5);

    if (upcoming.length === 0) {
        container.innerHTML = '<p style="padding:15px;">No upcoming deadlines 🎉</p>';
        return;
    }

    upcoming.forEach(task => {
        const row = document.createElement('div');
        row.className = 'deadline-item';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px';

        row.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <img src="images/Dashboard/s_deadlines.png" width="26">
                <div>
                    <strong>${task.title}</strong> - ${task.daysLeft} day(s) left
                </div>
            </div>
            <button class="arrow-btn" onclick="location.href='tasks.php'">→</button>
        `;

        container.appendChild(row);
    });
}

/* =========================================
   RENDER PROGRESS
========================================= */
function renderProgress() {
    const total = DashboardState.tasks.length;
    const completed = DashboardState.tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const bar = document.getElementById('todayTaskProgress');
    const text = document.getElementById('taskPercent');

    if (bar && text) {
        bar.style.width = percent + '%';
        bar.style.backgroundColor =
            percent === 100 ? '#2e7d32' :
            percent >= 60 ? '#4CAF50' :
            percent >= 30 ? '#FFC107' :
            '#F44336';
        text.textContent = `${completed}/${total}`;
    }

    // Weekly progress
    const today = normalizeDate(todayStr());
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 1); // Monday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sunday

    const weeklyTasks = DashboardState.tasks.filter(t => {
        if (!t.due_date) return false;
        const due = normalizeDate(t.due_date);
        return due >= start && due <= end;
    });

    const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;
    const weeklyPercent = weeklyTasks.length === 0
        ? 0
        : Math.round((weeklyCompleted / weeklyTasks.length) * 100);

    const weeklyBar = document.getElementById('weeklyProgress');
    const weeklyText = document.getElementById('weeklyPercent');

    if (weeklyBar && weeklyText) {
        weeklyBar.style.width = weeklyPercent + '%';
        weeklyBar.style.backgroundColor = '#4CAF50';
        weeklyText.textContent = weeklyPercent + '%';
    }
}

/* =========================================
   INIT
========================================= */
document.addEventListener('DOMContentLoaded', fetchDashboardTasks);





