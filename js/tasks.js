/* ============================================
   TASKS.JS - Enhanced Task Management
-----------------------------------------------
Author: Siti Norlie Yana
Date: 08 January 2026
Features:
    - Card-based task display
    - Inline complete/edit/delete
    - Advanced filtering
    - Task statistics
    - Modal for task details
============================================ */

let TasksState = {
    tasks: [],
    filteredTasks: [],
    searchQuery: '',
    statusFilter: 'all',
    categoryFilter: 'all'
};

/* =====================================
   INITIALIZE
===================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTasksData();
    setupEventListeners();
    console.log('✨ Tasks page initialized');
});

/* =====================================
   LOAD TASKS FROM PHP
===================================== */
function initTasksData() {
    const tasksEl = document.getElementById('taskList');
    if (!tasksEl || !tasksEl.dataset.tasks) return;

    try {
        const phpTasks = JSON.parse(tasksEl.dataset.tasks);
        TasksState.tasks = phpTasks.map(t => ({
            ...t,
            completed: parseInt(t.completed) === 1
        }));
        
        applyFilters();
        updateStatistics();
        
        console.log(`📋 Loaded ${TasksState.tasks.length} tasks`);
    } catch (e) {
        console.error('Error parsing tasks:', e);
        showEmptyState();
    }
}

/* =====================================
   APPLY FILTERS
===================================== */
function applyFilters() {
    let filtered = [...TasksState.tasks];
    
    // Search filter
    if (TasksState.searchQuery) {
        const query = TasksState.searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(query) ||
            (t.category && t.category.toLowerCase().includes(query))
        );
    }
    
    // Status filter
    const today = new Date().toISOString().split('T')[0];
    if (TasksState.statusFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (TasksState.statusFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    } else if (TasksState.statusFilter === 'overdue') {
        filtered = filtered.filter(t => !t.completed && t.due_date < today);
    }
    
    // Category filter
    if (TasksState.categoryFilter !== 'all') {
        filtered = filtered.filter(t => 
            t.category && t.category.toLowerCase() === TasksState.categoryFilter.toLowerCase()
        );
    }
    
    TasksState.filteredTasks = filtered;
    renderTasks();
}

/* =====================================
   RENDER TASKS
===================================== */
function renderTasks() {
    const container = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    if (TasksState.filteredTasks.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    TasksState.filteredTasks.forEach(task => {
        const card = createTaskCard(task);
        container.appendChild(card);
    });
}

/* =====================================
   CREATE TASK CARD
===================================== */
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.dataset.taskId = task.id;
    
    // Determine task color based on priority
    const priorityColors = {
        'High': '#ff4757',
        'Medium': '#ffa502',
        'Low': '#2ed573'
    };
    card.style.setProperty('--task-color', priorityColors[task.priority] || '#667eea');
    
    // Check if overdue
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = !task.completed && task.due_date < today;
    const daysUntil = Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24));
    
    // Category emoji
    const categoryEmojis = {
        'Exam': '📝',
        'Assignment': '📄',
        'Project': '🎯',
        'Quiz': '❓',
        'Revision': '📚'
    };
    const emoji = categoryEmojis[task.category] || '📌';
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleComplete(${task.id}, event)"></div>
            <h3 class="task-title">${emoji} ${escapeHtml(task.title)}</h3>
            <div class="task-actions">
                <button class="task-action-btn" onclick="editTask(${task.id}, event)" title="Edit">
                    ✏️
                </button>
                <button class="task-action-btn" onclick="deleteTask(${task.id}, event)" title="Delete">
                    🗑️
                </button>
            </div>
        </div>
        
        <div class="task-meta">
            <span class="task-badge priority-${task.priority.toLowerCase()}">
                ${task.priority}
            </span>
            <span class="task-badge category">
                ${task.category}
            </span>
        </div>
        
        <div class="task-date ${isOverdue ? 'overdue' : ''}">
            <span>📅</span>
            <span>
                ${isOverdue ? 
                    `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}` :
                    daysUntil === 0 ? 'Due today' :
                    daysUntil === 1 ? 'Due tomorrow' :
                    `Due in ${daysUntil} days`
                }
            </span>
            <span style="margin-left: auto; color: #95a5a6;">
                ${formatDate(task.due_date)}
            </span>
        </div>
    `;
    
    // Click card to view details
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.task-checkbox') && 
            !e.target.closest('.task-action-btn')) {
            showTaskDetails(task);
        }
    });
    
    return card;
}

/* =====================================
   TOGGLE COMPLETE
===================================== */
async function toggleComplete(taskId, event) {
    event.stopPropagation();
    
    const task = TasksState.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = !task.completed;
    
    try {
        const response = await fetch('tasks-actions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'complete',
                task_id: taskId,
                completed: newStatus ? 1 : 0
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            task.completed = newStatus;
            applyFilters();
            updateStatistics();
            showToast(newStatus ? '✓ Task completed!' : '↩️ Task reopened', 'success');
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
function editTask(taskId, event) {
    event.stopPropagation();
    window.location.href = `edit-task.php?id=${taskId}`;
}

/* =====================================
   DELETE TASK
===================================== */
async function deleteTask(taskId, event) {
    event.stopPropagation();
    
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
            TasksState.tasks = TasksState.tasks.filter(t => t.id !== taskId);
            applyFilters();
            updateStatistics();
            showToast('🗑️ Task deleted', 'success');
        } else {
            showToast('❌ Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Network error', 'error');
    }
}

/* =====================================
   SHOW TASK DETAILS
===================================== */
function showTaskDetails(task) {
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
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${emoji} ${escapeHtml(task.title)}</h2>
        </div>
        <div class="modal-body">
            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Priority:</strong> <span class="task-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></p>
            <p><strong>Due Date:</strong> ${formatDate(task.due_date)}</p>
            <p><strong>Status:</strong> ${task.completed ? '✓ Completed' : '⏳ In Progress'}</p>
            <p><strong>Created:</strong> ${formatDate(task.created_at)}</p>
        </div>
        <div class="modal-footer">
            ${!task.completed ? 
                `<button class="modal-btn primary" onclick="toggleComplete(${task.id}, event); closeModal();">
                    ✓ Mark Complete
                </button>` : 
                `<button class="modal-btn" onclick="toggleComplete(${task.id}, event); closeModal();">
                    ↩️ Mark Incomplete
                </button>`
            }
            <button class="modal-btn" onclick="editTask(${task.id}, event)">
                ✏️ Edit
            </button>
            <button class="modal-btn danger" onclick="deleteTask(${task.id}, event); closeModal();">
                🗑️ Delete
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

/* =====================================
   CLOSE MODAL
===================================== */
function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('show');
}

/* =====================================
   UPDATE STATISTICS
===================================== */
function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        total: TasksState.tasks.length,
        active: TasksState.tasks.filter(t => !t.completed).length,
        completed: TasksState.tasks.filter(t => t.completed).length,
        overdue: TasksState.tasks.filter(t => !t.completed && t.due_date < today).length
    };
    
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('activeTasks').textContent = stats.active;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('overdueTasks').textContent = stats.overdue;
}

/* =====================================
   EVENT LISTENERS
===================================== */
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            TasksState.searchQuery = e.target.value;
            applyFilters();
        });
    }
    
    // Status filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            TasksState.statusFilter = this.dataset.filter;
            applyFilters();
        });
    });
    
    // Category filters
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            TasksState.categoryFilter = this.dataset.category;
            applyFilters();
        });
    });
    
    // Close modal
    document.querySelector('.close-modal')?.addEventListener('click', closeModal);
    document.getElementById('taskModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'taskModal') closeModal();
    });
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
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showEmptyState() {
    const container = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    container.style.display = 'none';
    emptyState.style.display = 'block';
}

console.log('📋 Tasks.js loaded successfully');