/* ============================================
   MY TASKS PAGE - JAVASCRIPT
-----------------------------------------------
    Author: Siti Norlie Yana
    Date: 31 December 2025
    Tested by:
    Updated by:
    Description:
        Handles task management for the user, including:
        - Displaying task lists
        - Adding, editing, deleting tasks
        - Filtering by category and search
        - Marking tasks as completed
        - Persisting tasks in localStorage
   ============================================ */

/* ============================================
   GLOBAL STATE
   ============================================ */
let TasksState = {
    tasks: [],
    filteredTasks: [],
    selectedCategories: ['all'],
    searchQuery: ''
};

/* =========================================
   INIT TASKS FROM PHP DATA
========================================= */
function initTasksData() {
    const tasksEl = document.getElementById('taskList');
    if (!tasksEl || !tasksEl.dataset.tasks) return;

    try {
        const phpTasks = JSON.parse(tasksEl.dataset.tasks);
        TasksState.tasks = phpTasks.map(t => ({
            ...t,
            completed: t.completed == 1
        }));
        applyFilters();
    } catch (e) {
        console.error('Error parsing tasks JSON from PHP:', e);
        tasksEl.innerHTML = '<p style="text-align:center">No tasks found</p>';
    }
}

/* =========================================
   APPLY FILTERS
========================================= */
function applyFilters() {
    let filtered = [...TasksState.tasks];

    // Search filter
    if (TasksState.searchQuery) {
        const q = TasksState.searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.title.toLowerCase().includes(q));
    }

    // Category filter
    if (!TasksState.selectedCategories.includes('all')) {
        filtered = filtered.filter(t =>
            TasksState.selectedCategories
                .map(c => c.toLowerCase())
                .includes(t.category.toLowerCase())
        );
    }

    TasksState.filteredTasks = filtered;
    renderTasks();
}

/* =========================================
   RENDER TASKS
========================================= */
function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (TasksState.filteredTasks.length === 0) {
        list.innerHTML = '<p style="text-align:center">No tasks found</p>';
        return;
    }

    TasksState.filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'completed' : ''}`;
        card.dataset.taskId = task.id;

        // Checkbox
        const checkbox = document.createElement('div');
        checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.textContent = task.completed ? '✓' : '';
        checkbox.onclick = e => { e.stopPropagation(); toggleComplete(task.id); };

        // Priority badge
        const priorityClass = task.priority.trim().toLowerCase();
        const priorityBadge = `<span class="priority-badge priority-${priorityClass}">
            ${task.priority.toUpperCase()}
        </span>`;

        // Normalize to lowercase for class, but display original for text
const categoryClass = task.category ? task.category.toLowerCase() : 'other';
const categoryText = task.category
    ? task.category.charAt(0).toUpperCase() + task.category.slice(1)
    : 'Other';

const categoryBadge = `<span class="category-badge category-${categoryClass}">
    ${categoryText}
</span>`;





        // Content
        const content = document.createElement('div');
        content.className = 'task-content';
        content.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                <span>Due: ${task.due_date}</span>
                ${priorityBadge}
                ${categoryBadge}
            </div>
            <p><strong>Subject:</strong> ${task.subject}</p>
            <p><strong>Notes:</strong> ${task.notes || ''}</p>
            <p><small>Created at: ${task.created_at}</small></p>
        `;

        // Edit & Delete buttons
        const editBtn = document.createElement('button');
        editBtn.className = 'task-edit-btn';
        editBtn.innerHTML = '<img src="images/edit_icon.png" width="40">';
        editBtn.onclick = e => { e.stopPropagation(); editTask(task.id); };

        const delBtn = document.createElement('button');
        delBtn.className = 'task-delete-btn';
        delBtn.innerHTML = '<img src="images/delete_icon.png" width="20">';
        delBtn.onclick = e => { e.stopPropagation(); deleteTask(task.id); };

        // Append to card
        card.appendChild(checkbox);
        card.appendChild(content);
        card.appendChild(editBtn);
        card.appendChild(delBtn);
        list.appendChild(card);
    });
}


/* =========================================
   TASK ACTIONS
========================================= */
function toggleComplete(id) {
    const task = TasksState.tasks.find(t => t.id == id);
    if (!task) return;
    task.completed = !task.completed;
    applyFilters();
}

function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    fetch('tasks-actions.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', task_id: id })
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            TasksState.tasks = TasksState.tasks.filter(t => t.id != id);
            applyFilters();
        } else {
            alert('Error deleting task: ' + res.message);
        }
    })
    .catch(err => console.error('AJAX error:', err));
}


function editTask(id) {
    window.location.href = `edit-task.php?id=${id}`;
}


function toggleComplete(id) {
    const task = TasksState.tasks.find(t => t.id == id);
    if (!task) return;

    const newStatus = task.completed ? 0 : 1;

    fetch('tasks-actions.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'complete',
            task_id: id,
            completed: newStatus
        })
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            task.completed = !task.completed;
            applyFilters();
        } else {
            alert('Error updating task: ' + res.message);
        }
    })
    .catch(err => console.error('AJAX error:', err));
}




/* =========================================
   EVENTS
========================================= */
function setupEvents() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            TasksState.searchQuery = e.target.value;
            applyFilters();
        });
    }

    document.querySelectorAll('.category-checkboxes input').forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = [...document.querySelectorAll('.category-checkboxes input:checked')]
                .map(c => c.dataset.category);
            TasksState.selectedCategories = checked.includes('all') ? ['all'] : checked;
            applyFilters();
        });
    });
}

/* =========================================
   INIT
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initTasksData();
    setupEvents();
});


