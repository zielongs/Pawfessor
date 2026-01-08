<?php
/* ===================================================
     TASKS PAGE - ENHANCED VERSION
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Updated: Noraziela Binti Jepsin
    
    Features:
    - Beautiful card-based layout
    - Quick filters and search
    - Mark complete inline
    - Edit and delete options
    - Drag to reorder (coming soon)
=================================================== */
<?php 
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include "db.php";

$user_id = intval($_SESSION['user_id']);
$fullname = $_SESSION['fullname'] ?? 'User';

// Fetch tasks for this user
$sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY 
        CASE WHEN completed = 0 THEN 0 ELSE 1 END,
        due_date ASC, 
        created_at DESC";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$tasks = [];
while ($row = mysqli_fetch_assoc($result)) {
    $tasks[] = $row;
}

// Convert tasks to JSON safely
$tasks_json = json_encode($tasks, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>My Tasks - Pawfessor</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/tasks.css">
</head>
<body>

<button class="menu-toggle" id="menuToggle">
    <img src="images/Dashboard/d_sidebar.png" width="40" height="40">
</button>

<div class="container">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="images/Pawfessor_Logo.png" width="55" height="65">
        </div>
        <nav>
            <a href="dashboard-user.php" class="menu-item">
                <img src="images/Dashboard/d_dashboard.png" width="40" height="40">
                <span>Dashboard</span>
            </a>
            <a href="tasks.php" class="menu-item active">
                <img src="images/Dashboard/d_my_tasks.png" width="40" height="40">
                <span>My Tasks</span>
            </a>
            <a href="progress.php" class="menu-item">
                <img src="images/Dashboard/d_progress.png" width="40" height="40">
                <span>Progress</span>
            </a>
            <a href="store.html" class="menu-item">
                <img src="images/Dashboard/d_mascot_store.png" width="40" height="40">
                <span>Mascot Store</span>
            </a>
            <a href="subscriptions.php" class="menu-item">
                <img src="images/Dashboard/d_subscriptions.png" width="40" height="40">
                <span>Subscriptions</span>
            </a>
            <a href="carts.html" class="menu-item">
                <img src="images/Dashboard/d_carts.png" width="40" height="40">
                <span>Carts</span>
            </a>
            <a href="transaction-history.html" class="menu-item">
                <img src="images/Dashboard/d_transaction_history.png" width="40" height="40">
                <span>Transaction History</span>
            </a>
            <a href="profiles.php" class="menu-item">
                <img src="images/Dashboard/d_profiles.png" width="40" height="40">
                <span>Profiles</span>
            </a>
        </nav>
    </aside>

     <main class="main-content tasks-page">
        <!-- Page Header -->
        <div class="page-header">
            <h1>📋 My Tasks</h1>
            <p>Manage and organize your academic tasks</p>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Search tasks..." class="search-input">
            </div>

            <div class="quick-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="active">Active</button>
                <button class="filter-btn" data-filter="completed">Completed</button>
                <button class="filter-btn" data-filter="overdue">Overdue</button>
            </div>

            <div class="category-filters">
                <button class="category-chip active" data-category="all">All</button>
                <button class="category-chip" data-category="Exam">📝 Exam</button>
                <button class="category-chip" data-category="Assignment">📄 Assignment</button>
                <button class="category-chip" data-category="Project">🎯 Project</button>
                <button class="category-chip" data-category="Quiz">❓ Quiz</button>
                <button class="category-chip" data-category="Revision">📚 Revision</button>
            </div>

            <button class="add-task-btn" onclick="window.location.href='add-task.php'">
                ➕ Add New Task
            </button>
        </div>

        <!-- Task Statistics -->
        <div class="task-stats">
            <div class="stat-box">
                <span class="stat-number" id="totalTasks">0</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-box">
                <span class="stat-number" id="activeTasks">0</span>
                <span class="stat-label">Active</span>
            </div>
            <div class="stat-box">
                <span class="stat-number" id="completedTasks">0</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="stat-box">
                <span class="stat-number" id="overdueTasks">0</span>
                <span class="stat-label">Overdue</span>
            </div>
        </div>

        <!-- Task List -->
        <div class="task-grid" id="taskList" data-tasks='<?php echo $tasks_json; ?>'>
            <!-- Tasks will be rendered here by JavaScript -->
        </div>

        <!-- Empty State -->
        <div class="empty-state" id="emptyState" style="display: none;">
            <div class="empty-icon">📭</div>
            <h3>No tasks found</h3>
            <p>Start by adding a new task or adjust your filters</p>
            <button class="add-task-btn" onclick="window.location.href='add-task.php'">
                ➕ Add Your First Task
            </button>
        </div>
    </main>
</div>

<!-- Task Detail Modal -->
<div class="modal" id="taskModal">
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div id="modalBody">
            <!-- Task details will be loaded here -->
        </div>
    </div>
</div>

<!-- Success Toast -->
<div class="toast" id="toast"></div>

<script src="js/security.js"></script>
<script src="js/main.js"></script>
<script src="js/tasks.js"></script>

</body>

</html>

