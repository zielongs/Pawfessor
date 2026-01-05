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
const TasksState = {
    tasks: [],
    filteredTasks: [],
    selectedCategories: ['all'],
    searchQuery: ''
};

/* ============================================
   INITIAL DATA LOAD
   ============================================ */
function initTasksData() {
    try {
        const stored = localStorage.getItem('userTasks');

        if (stored) {
            TasksState.tasks = JSON.parse(stored);
        } else {
            TasksState.tasks = [
                {
                    id: Date.now(),
                    title: 'Math - Chapter 3 Revision',
                    dueDate: '2025-11-11',
                    priority: 'high',
                    category: 'Revision',
                    completed: false
                }
            ];
            saveTasksToStorage();
        }

        TasksState.tasks = TasksState.tasks.map(task => ({
    id: task.id,
    title: task.title || 'Untitled Task',
    dueDate: task.dueDate || 'No date',
    priority: (task.priority || 'low').toLowerCase(),
    category: (task.category || 'General').trim(),
    completed: Boolean(task.completed)
}));

       applyFilters();

    } catch (e) {
        console.error('Storage error:', e);
        TasksState.tasks = [];
    }
}

function saveTasksToStorage() {
    localStorage.setItem('userTasks', JSON.stringify(TasksState.tasks));
}

/* ============================================
   RENDERING
   ============================================ */
function renderTasks() {
    const list = document.getElementById('taskList');
    if (!list) return;

    list.innerHTML = '';

    if (TasksState.filteredTasks.length === 0) {
        list.innerHTML = '<p style="text-align:center">No tasks found</p>';
        return;
    }

    TasksState.filteredTasks.forEach(task => {
        list.appendChild(createTaskCard(task));
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.dataset.taskId = task.id;

    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
    checkbox.textContent = task.completed ? '✓' : '';
    checkbox.onclick = e => {
        e.stopPropagation();
        toggleTaskComplete(task.id);
    };

    const content = document.createElement('div');
    content.className = 'task-content';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.innerHTML = `
        <span>Due: ${task.dueDate}</span>
        <span class="priority-badge priority-${task.priority}">
            ${task.priority.toUpperCase()}
        </span>
        <span class="category-badge">${task.category}</span>
    `;

    content.append(title, meta);
    card.append(checkbox, content);

    const delBtn = document.createElement('button');
    delBtn.className = 'task-delete-btn';
    delBtn.innerHTML = `<img src="images/delete_icon.png" width="20">`;
    delBtn.onclick = e => {
        e.stopPropagation();
        deleteTask(task.id);
    };
    // Edit button
const editBtn = document.createElement('button');
editBtn.className = 'task-edit-btn';
editBtn.innerHTML = '<img src="images/edit_icon.png" alt="Edit" width="40" height="40">';
editBtn.title = 'Edit task';

// Prevent opening task details on click
editBtn.onclick = (e) => {
    e.stopPropagation();
    editTask(task.id);
};

card.appendChild(editBtn);


    card.appendChild(delBtn);
    return card;
}

/* ============================================
   TASK ACTIONS
   ============================================ */
function toggleTaskComplete(id) {
    const task = TasksState.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasksToStorage();
    applyFilters();
}

function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    TasksState.tasks = TasksState.tasks.filter(t => t.id !== id);
    saveTasksToStorage();
    applyFilters();
}

function editTask(taskId) {
    const task = TasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Prompt user to edit task details
    const newTitle = prompt('Edit Task Title:', task.title);
    if (newTitle !== null) task.title = newTitle;

    const newDueDate = prompt('Edit Due Date:', task.dueDate);
    if (newDueDate !== null) task.dueDate = newDueDate;

    const newPriority = prompt('Edit Priority (high, medium, low):', task.priority);
    if (newPriority !== null) task.priority = newPriority.toLowerCase();

    const newCategory = prompt('Edit Category:', task.category);
    if (newCategory !== null) task.category = newCategory;

    // Save changes and re-render
    localStorage.setItem('userTasks', JSON.stringify(TasksState.tasks));
    applyFilters();
    showToast('Task updated successfully!', 'success');
}


/* ============================================
   FILTERING
   ============================================ */
function applyFilters() {
    let result = [...TasksState.tasks];

    if (!TasksState.selectedCategories.includes('all')) {
        result = result.filter(t =>
            TasksState.selectedCategories
    .map(c => c.toLowerCase())
    .includes(t.category.toLowerCase())

        );
    }

    if (TasksState.searchQuery) {
        const q = TasksState.searchQuery.toLowerCase();
        result = result.filter(t =>
            t.title.toLowerCase().includes(q)
        );
    }

    TasksState.filteredTasks = result;
    renderTasks();
}

/* ============================================
   EVENTS
   ============================================ */
function setupEvents() {
    document.querySelectorAll('.category-checkboxes input').forEach(cb => {
    cb.addEventListener('change', () => {
        const checked = [...document.querySelectorAll(
            '.category-checkboxes input:checked'
        )];

        TasksState.selectedCategories = checked.map(c =>
            c.dataset.category
        );

        if (TasksState.selectedCategories.includes('all')) {
            TasksState.selectedCategories = ['all'];
            document.querySelectorAll(
                '.category-checkboxes input:not(#catAll)'
            ).forEach(c => c.checked = false);
        } else {
            document.getElementById('catAll').checked = false;
        }

        applyFilters();
    });
});
const addBtn = document.getElementById('addTaskBtn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        window.location.href = 'add-task.html';
    });
}


}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initTasksData();
    setupEvents();
    renderTasks();
});
