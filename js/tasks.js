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

// Tasks state management
const TasksState = {
    tasks: [],
    filteredTasks: [],
    selectedCategories: ['all'],
    searchQuery: ''
};

/* ============================================
   TASK DATA MANAGEMENT
   ============================================ */

// Initialize tasks data
function initTasksData() {
    const storedTasks = localStorage.getItem('userTasks');

    if (storedTasks) {
        TasksState.tasks = JSON.parse(storedTasks);
    } else {
        // First time only → create sample data in consistent format
        TasksState.tasks = [
            {
                id: 1,
                title: 'Math - Chapter 3 Revision',
                dueDate: '2025-11-11',   // YYYY-MM-DD format
                priority: 'high',        // lowercase
                category: 'Revision',
                completed: true
            },
            {
                id: 2,
                title: 'English - Essay Draft',
                dueDate: '2025-11-14',
                priority: 'medium',
                category: 'Assignment',
                completed: false
            }
        ];

        // SAVE sample data so it never resets again
        localStorage.setItem('userTasks', JSON.stringify(TasksState.tasks));
    }

    // Convert any old date formats (if needed)
    TasksState.tasks = TasksState.tasks.map(task => {
        // Ensure priority is lowercase
        task.priority = task.priority.toLowerCase();

        // If dueDate is in old format like '11 Nov | Monday', convert to YYYY-MM-DD
        if (task.dueDate.includes('|')) {
            const parts = task.dueDate.split('|')[0].trim(); // e.g., '11 Nov'
            const date = new Date(parts + ' 2025'); // add year
            task.dueDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
        }

        return task;
    });

    TasksState.filteredTasks = [...TasksState.tasks];
}


/**
 * Save tasks to localStorage
 */
function saveTasksToStorage() {
    localStorage.setItem('userTasks', JSON.stringify(TasksState.tasks));
}

/* ============================================
   RENDER FUNCTIONS
   ============================================ */

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.innerHTML = '';

    if (TasksState.filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No tasks found</p>';
        return;
    }

    TasksState.filteredTasks.forEach(task => {
        taskList.appendChild(createTaskCard(task));
    });
}
function formatDueDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'short', weekday: 'long' }; // e.g., 23 Dec Tuesday
    return date.toLocaleDateString('en-US', options);
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');
    card.setAttribute('data-task-id', task.id);

    // Checkbox
    const checkbox = document.createElement('div');
    checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
    checkbox.innerHTML = task.completed ? '✓' : '';
    checkbox.onclick = e => {
        e.stopPropagation();
        toggleTaskComplete(task.id);
    };

    // Task content
    const content = document.createElement('div');
    content.className = 'task-content';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = escapeHTML(task.title);

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    // Due date
    const dueDate = document.createElement('span');
    dueDate.className = 'task-meta-item';
    dueDate.textContent = 'Due: ' + formatDueDate(task.dueDate);

    meta.appendChild(dueDate);

    // Priority
    const priorityBadge = document.createElement('span');
    priorityBadge.className = 'task-meta-item';
    const priority = document.createElement('span');
    priority.className = 'priority-badge priority-' + task.priority;
    priority.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    priorityBadge.appendChild(priority);
    meta.appendChild(priorityBadge);

    // Category
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'task-meta-item';
    const category = document.createElement('span');
    category.className = 'category-badge';
    category.textContent = task.category;
    categoryBadge.appendChild(category);
    meta.appendChild(categoryBadge);

    content.appendChild(title);
    content.appendChild(meta);

    card.appendChild(checkbox);
    card.appendChild(content);

    // Click on card to view details
    card.onclick = () => viewTaskDetails(task.id);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.innerHTML = '<img src="images/delete_icon.png" alt="Delete" width="20" height="20">';
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = e => {
        e.stopPropagation();
        deleteTask(task.id);
    };
    card.appendChild(deleteBtn);

    // Edit button
const editBtn = document.createElement('button');
editBtn.className = 'task-edit-btn';
editBtn.innerHTML = '<img src="images/edit_icon.png" alt="Edit" width="40" height="40">';  // pencil icon
editBtn.title = 'Edit task';

// Prevent opening task details on click
editBtn.onclick = (e) => {
    e.stopPropagation();
    editTask(task.id);
};

card.appendChild(editBtn);


    return card;
}

/* ============================================
   TASK OPERATIONS
   ============================================ */
function toggleTaskComplete(taskId) {
    const tasks = JSON.parse(localStorage.getItem('userTasks')) || [];

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Toggle state
    task.completed = !task.completed;

    // Save
    localStorage.setItem('userTasks', JSON.stringify(tasks));

    // 🔑 Update UI directly (NO re-render)
    const card = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!card) return;

    const checkbox = card.querySelector('.task-checkbox');

    card.classList.toggle('completed', task.completed);
    checkbox.classList.toggle('checked', task.completed);
    checkbox.innerHTML = task.completed ? '✓' : '';
}




function viewTaskDetails(taskId) {
    const task = TasksState.tasks.find(t => t.id === taskId);
    if (task) {
        alert(`Task Details:━━━━━━━━━━━━━━
            Title: ${task.title}
            Due: ${task.dueDate}
            Priority: ${task.priority.toUpperCase()}
            Category: ${task.category}
            Status: ${task.completed ? 'Completed ✓' : 'Pending'}`);
    }
}

function addTask(taskData) {
    const newTask = {
        id: Date.now(),
        title: taskData.title,
        dueDate: taskData.dueDate,
        priority: taskData.priority.toLowerCase(),
        category: taskData.category,
        completed: false
    };
    TasksState.tasks.unshift(newTask);
    saveTasksToStorage();
    applyFilters();
    showToast('Task saved successfully!', 'success');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        TasksState.tasks = TasksState.tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        applyFilters();
        showToast('Task deleted', 'info');
    }
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
   FILTERING & SEARCH
   ============================================ */

function applyFilters() {
    let filtered = [...TasksState.tasks];

    // Category filter
    if (!TasksState.selectedCategories.includes('all')) {
        filtered = filtered.filter(task =>
            TasksState.selectedCategories.includes(task.category)
        );
    }

    // Search filter
    if (TasksState.searchQuery) {
        const query = TasksState.searchQuery.toLowerCase();
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(query) ||
            task.category.toLowerCase().includes(query)
        );
    }

    TasksState.filteredTasks = filtered;
    renderTasks();
}

function handleSearch(query) {
    TasksState.searchQuery = query.trim();
    applyFilters();
}

function handleCategoryFilter(category, checked) {
    if (category === 'all') {
        TasksState.selectedCategories = checked ? ['all'] : [];
        document.querySelectorAll('.category-item input[type="checkbox"]').forEach(cb => {
            if (cb.id !== 'catAll') cb.checked = false;
        });
    } else {
        if (checked) {
            TasksState.selectedCategories = TasksState.selectedCategories.filter(c => c !== 'all');
            TasksState.selectedCategories.push(category);
        } else {
            TasksState.selectedCategories = TasksState.selectedCategories.filter(c => c !== category);
        }
        if (TasksState.selectedCategories.length === 0) {
            TasksState.selectedCategories = ['all'];
            document.getElementById('catAll').checked = true;
        }
    }
    applyFilters();
}

/* ============================================
   EVENT LISTENERS SETUP
   ============================================ */

function setupTasksEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', e => handleSearch(e.target.value));
    }

    // Category checkboxes
    const categoryCheckboxes = {
        'catAll': 'all',
        'catExam': 'Exam',
        'catRevision': 'Revision',
        'catAssignment': 'Assignment',
        'catProject': 'Project',
        'catQuiz': 'Quiz'
    };
    Object.keys(categoryCheckboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', e => handleCategoryFilter(categoryCheckboxes[id], e.target.checked));
        }
    });

    // Add task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            window.location.href = 'add-task.html';
        });
    }
}

/* ============================================
   TOAST MESSAGE
   ============================================ */

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

/* ============================================
   UTILITIES
   ============================================ */

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ============================================
   INITIALIZATION
   ============================================ */

function initTasksPage() {
    initTasksData();
    setupTasksEventListeners();
    renderTasks();
}

/* ============================================
   PAGE LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'tasks.html') initTasksPage();
});
