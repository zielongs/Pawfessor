/* ===================================================
     WEEKLY VIEW JAVASCRIPT
     ---------------------------------------------------
    Author: Noraziela Binti Jepsin
    Updated: Noraziela Binti Jepsin
    
    Features:
    - Click empty slots to add tasks
    - Click tasks to view/edit/complete
    - Week navigation
    - Real-time updates
=================================================== */

let WeekData = {
    currentOffset: 0,
    tasks: {}
};

/* =====================================
   INITIALIZE
===================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadWeekData();
    highlightCurrentTime();
    console.log('📅 Weekly view initialized');
});

/* =====================================
   LOAD WEEK DATA
===================================== */
function loadWeekData() {
    const weekDataEl = document.getElementById('weekData');
    if (!weekDataEl) return;
    
    try {
        WeekData.currentOffset = parseInt(weekDataEl.dataset.offset) || 0;
        WeekData.tasks = JSON.parse(weekDataEl.dataset.tasks) || {};
        console.log('📊 Loaded week data:', WeekData);
    } catch (e) {
        console.error('Error loading week data:', e);
    }
}

/* =====================================
   NAVIGATION
===================================== */
function goToToday() {
    window.location.href = 'weekly-view.php';
}

function changeWeek(offset) {
    const newOffset = WeekData.currentOffset + offset;
    window.location.href = `weekly-view.php?week=${newOffset}`;
}

/* =====================================
   ADD TASK TO SLOT
===================================== */
function addTaskToSlot(date, hourLabel) {
    const time = convertHourToTime(hourLabel);
    window.location.href = `add-task.php?date=${date}&time=${time}`;
}

function convertHourToTime(hourLabel) {
    // Example: "7 AM", "12 PM", "3 PM"
    const [hourStr, period] = hourLabel.split(' ');
    let hour = parseInt(hourStr, 10);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return `${String(hour).padStart(2, '0')}:00`;
}


/* =====================================
   SHOW TASK DETAIL
===================================== */
async function showTaskDetail(taskId, event) {
    event.stopPropagation();
    
    try {
        // Fetch task details
        const response = await fetch('tasks-actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'fetch',
                task_id: taskId
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success' && data.tasks && data.tasks.length > 0) {
            const task = data.tasks[0];
            showTaskModal(task);
        } else {
            showToast('❌ Task not found', 'error');
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        showToast('❌ Network error', 'error');
    }
}

/* =====================================
   SHOW TASK MODAL
===================================== */
function showTaskModal(task) {
    const modal = document.getElementById('taskModal');
    const modalBody = document.getElementById('modalBody');
    
    const categoryEmojis = {
        'Exam': '📝',
        'Assignment': '📄',
        'Project': '🎯',
        'Quiz': '❓',
        'Revision': '📚'
    };
    const emoji = categoryEmojis[task.category] || '📌';
    
    const isCompleted = parseInt(task.completed) === 1;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${emoji} ${escapeHtml(task.title)}</h2>
        </div>
        <div class="modal-body">
            <p><strong>Category:</strong> <span class="task-badge category">${task.category}</span></p>
            <p><strong>Priority:</strong> <span class="task-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></p>
            <p><strong>Due Date:</strong> ${formatDate(task.due_date)}</p>
            <p><strong>Status:</strong> ${isCompleted ? '✅ Completed' : '⏳ In Progress'}</p>
            ${task.created_at ? `<p><strong>Created:</strong> ${formatDate(task.created_at)}</p>` : ''}
        </div>
        <div class="modal-footer">
            ${!isCompleted ? 
                `<button class="modal-btn success" onclick="toggleTaskComplete(${task.id})">
                    ✓ Mark Complete
                </button>` : 
                `<button class="modal-btn" onclick="toggleTaskComplete(${task.id})">
                    ↩️ Mark Incomplete
                </button>`
            }
            <button class="modal-btn primary" onclick="editTask(${task.id})">
                ✏️ Edit
            </button>
            <button class="modal-btn danger" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

/* =====================================
   TOGGLE TASK COMPLETE
===================================== */
async function toggleTaskComplete(taskId) {
    // Find task in current data
    let task = null;
    for (let date in WeekData.tasks) {
        const found = WeekData.tasks[date].find(t => t.id == taskId);
        if (found) {
            task = found;
            break;
        }
    }
    
    if (!task) return;
    
    const newStatus = parseInt(task.completed) === 1 ? 0 : 1;
    
    try {
        const response = await fetch('tasks-actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'complete',
                task_id: taskId,
                completed: newStatus
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showToast(newStatus ? '✅ Task completed!' : '↩️ Task reopened', 'success');
            closeModal();
            
            // Reload page to update display
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast('❌ Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Network error', 'error');
    }
}

/* =====================================
   EDIT TASK
===================================== */
function editTask(taskId) {
    window.location.href = `edit-task.php?id=${taskId}`;
}

/* =====================================
   DELETE TASK
===================================== */
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch('tasks-actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                task_id: taskId
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showToast('🗑️ Task deleted', 'success');
            closeModal();
            
            // Reload page to update display
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast('❌ Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Network error', 'error');
    }
}

/* =====================================
   CLOSE MODAL
===================================== */
function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('show');
}

/* =====================================
   HIGHLIGHT CURRENT TIME
===================================== */
function highlightCurrentTime() {
    const now = new Date();
    const currentHour = now.getHours();
    const todayDate = now.toISOString().split('T')[0];
    
    // Find today's column
    const todayCells = document.querySelectorAll(`.calendar-cell[data-date="${todayDate}"]`);
    
    // Highlight current hour
    if (currentHour >= 7 && currentHour <= 23) {
        const hourIndex = currentHour - 7;
        if (todayCells[hourIndex]) {
            todayCells[hourIndex].style.background = 'rgba(102, 126, 234, 0.1)';
            todayCells[hourIndex].style.border = '2px solid #667eea';
        }
    }
}

/* =====================================
   UTILITY FUNCTIONS
===================================== */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showToast(message, type = 'success') {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* =====================================
   KEYBOARD SHORTCUTS
===================================== */
document.addEventListener('keydown', (e) => {
    // Left arrow - previous week
    if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        changeWeek(-1);
    }
    
    // Right arrow - next week
    if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        changeWeek(1);
    }
    
    // T key - go to today
    if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.metaKey) {
            goToToday();
        }
    }
    
    // N key - add new task
    if (e.key === 'n' || e.key === 'N') {
        if (!e.ctrlKey && !e.metaKey) {
            window.location.href = 'add-task.php';
        }
    }
    
    // Escape key - close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

/* =====================================
   MODAL CLICK OUTSIDE TO CLOSE
===================================== */
document.getElementById('taskModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'taskModal') {
        closeModal();
    }
});

console.log('📅 Weekly view loaded successfully');

console.log('💡 Keyboard shortcuts: ← → (navigate), T (today), N (new task), ESC (close)');
