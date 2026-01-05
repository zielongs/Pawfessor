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

// ================= UTILITY FUNCTIONS =================
function formatDate(date) {
    if (!date) return 'No due date';
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function getProgressColor(percent) {
    if (percent === 100) return '#2e7d32';
    if (percent >= 60) return '#4CAF50';
    if (percent >= 30) return '#FFC107';
    return '#F44336';
}

function getTodayDate() {
    const today = new Date();
    today.setHours(0,0,0,0);
    return today;
}

// ================= LOAD TASKS =================
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
    const today = getTodayDate();

    DashboardState.tasks = storedTasks;

    // Filter tasks due today
    DashboardState.todayTasks = storedTasks.filter(task => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        due.setHours(0,0,0,0);
        return due.getTime() === today.getTime();
    });

    // Sort today's tasks by priority (high → low)
    const priorities = { high: 3, medium: 2, low: 1 };
    DashboardState.todayTasks.sort((a,b) => (priorities[b.priority]||0) - (priorities[a.priority]||0));
}

// ================= RENDER TODAY'S TASKS =================
function renderTodayTasks() {
    const container = document.getElementById('todayTasksContainer');
    if (!container) return;

    container.innerHTML = '';

    if (DashboardState.todayTasks.length === 0) {
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
        item.style.borderBottom = '1px solid #ddd'; // optional for separation

        // LEFT SIDE: icon + title
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        const icon = document.createElement('img');
        icon.src = task.completed
            ? 'images/check_icon.png'
            : 'images/pin_icon.png';
        icon.alt = task.completed ? 'Completed' : 'Pending';
        icon.width = 20;
        icon.height = 20;

        const title = document.createElement('strong');
        title.textContent = task.title;

        left.appendChild(icon);
        left.appendChild(title);

        // RIGHT SIDE: due date + arrow
        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.alignItems = 'center';
        right.style.gap = '10px';

        const due = document.createElement('span');
        due.textContent = formatDate(task.dueDate);

        const arrow = document.createElement('button');
        arrow.className = 'arrow-btn';
        arrow.textContent = '→';
        arrow.onclick = () => {
    window.location.href = 'tasks.html';
};

        right.appendChild(due);
        right.appendChild(arrow);

        // Combine left + right
        item.appendChild(left);
        item.appendChild(right);

        container.appendChild(item);
    });
}


// ================= PROGRESS BARS =================
function updateProgressBars() {
    const tasks = DashboardState.tasks || [];

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overallPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const overallBar = document.getElementById('todayTaskProgress');
    const overallText = document.getElementById('taskPercent');
    if (overallBar && overallText) {
        overallBar.style.width = overallPercent + '%';
        overallBar.style.backgroundColor = getProgressColor(overallPercent);
        overallText.textContent = `${completed}/${total}`;
    }

    // Weekly Progress
    const today = getTodayDate();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weeklyTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        due.setHours(0,0,0,0);
        return due >= startOfWeek && due <= endOfWeek;
    });

    const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;
    const weeklyPercent = weeklyTasks.length === 0 ? 0 : Math.round((weeklyCompleted / weeklyTasks.length) * 100);

    const weeklyBar = document.getElementById('weeklyProgress');
    const weeklyText = document.getElementById('weeklyPercent');
    if (weeklyBar && weeklyText) {
        weeklyBar.style.width = weeklyPercent + '%';
        weeklyBar.style.backgroundColor = getProgressColor(weeklyPercent);
        weeklyText.textContent = weeklyPercent + '%';
    }
}

// ================= DEADLINES =================
function loadDeadlines() {
    const tasks = DashboardState.tasks;
    const today = getTodayDate();

    DashboardState.deadlines = tasks
        .filter(t => t.dueDate && new Date(t.dueDate) >= today)
        .map(t => {
            const due = new Date(t.dueDate);
            due.setHours(0,0,0,0);
            return {
                id: t.id,
                title: t.title,
                date: due,
                daysUntil: Math.ceil((due - today)/(1000*60*60*24))
            };
        })
        .sort((a,b) => a.date - b.date)
        .slice(0,5);
}

function renderDeadlines() {
    const container = document.getElementById('deadlinesContainer');
    if (!container) return;

    container.innerHTML = '';
    if (DashboardState.deadlines.length === 0) {
        container.innerHTML = '<p style="padding:15px;">No upcoming deadlines 🎉</p>';
        return;
    }

    DashboardState.deadlines.forEach(d => {
        const item = document.createElement('div');
        item.className = 'deadline-item';
        // Use flex: space-between
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '10px';

        // LEFT: icon + title
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        const fire = document.createElement('img');
        fire.src = 'images/Dashboard/s_deadlines.png';
        fire.alt = 'Urgent';
        fire.style.width = '26px';
        fire.style.height = '26px';

        const info = document.createElement('div');
        info.style.textAlign = 'left';  // <--- ensure text stays left
        info.innerHTML = `<strong>${d.title}</strong> - ${d.daysUntil} days left`;

        left.appendChild(fire);
        left.appendChild(info);

        // RIGHT: arrow button
        const arrow = document.createElement('button');
        arrow.className = 'arrow-btn';
        arrow.textContent = '→';
        arrow.onclick = () => {
    window.location.href = 'tasks.html';
};


        item.appendChild(left);
        item.appendChild(arrow);

        container.appendChild(item);
    });
}


// ================= INIT DASHBOARD =================
function initDashboard() {
    loadTasks();
    loadDeadlines();
    renderTodayTasks();
    renderDeadlines();
    updateProgressBars();
}

// Refresh dashboard when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        initDashboard();
    }
});

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();

    const weeklyBtn = document.getElementById('weeklyViewBtn');
    if (weeklyBtn) {
        weeklyBtn.style.cursor = 'pointer';
        weeklyBtn.addEventListener('click', () => {
            window.location.href = 'weekly-view.html';
        });
    }
});



