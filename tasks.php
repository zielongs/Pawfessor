<!-- ===================================================
     TASKS PAGE
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Date: 01 January 2026
    Tested by:
    Updated by:
    Description:
     This page displays the user's task list including:
     - Search bar for tasks
     - Task categories filter
     - Task list (dynamically populated)
     - Add New Task button

     All dynamic content is populated via tasks.js
     using data stored in localStorage.
=================================================== -->
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
$fullname = $_SESSION['fullname'];

// Fetch tasks for this user
$sql = "SELECT * FROM tasks WHERE user_id = $user_id ORDER BY due_date ASC, created_at DESC";
$result = mysqli_query($conn, $sql);

if (!$result) {
    die("Database query error: " . mysqli_error($conn));
}

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
<title>My Tasks</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/tasks.css">
</head>
<body>

<!-- Sidebar and header remain unchanged -->
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
            <a href="progress.html" class="menu-item">
                <img src="images/Dashboard/d_progress.png" width="40" height="40">
                <span>Progress</span>
            </a>
            <a href="store.html" class="menu-item">
                <img src="images/Dashboard/d_mascot_store.png" width="40" height="40">
                <span>Mascot Store</span>
            </a>
            <a href="subscriptions.html" class="menu-item">
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
            <a href="profiles.html" class="menu-item">
                <img src="images/Dashboard/d_profiles.png" width="40" height="40">
                <span>Profiles</span>
            </a>
        </nav>
    </aside>

     <main class="main-content">
        <div class="tasks-header">
            <h1 class="tasks-title">TASK LISTS</h1>
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search Task" id="searchInput">
                <span class="search-icon">
                    <img src="images/search_icon.png" width="40" height="35">
                </span>
            </div>
            <div class="categories-filter">
                <span class="categories-label">Categories:</span>
                <div class="category-checkboxes">
                    <div class="category-item">
                        <input type="checkbox" id="catAll" checked data-category="all">
                        <label for="catAll">All</label>
                    </div>
                    <div class="category-item">
                        <input type="checkbox" id="catExam" data-category="Exam">
                        <label for="catExam">Exam</label>
                    </div>
                    <div class="category-item">
                        <input type="checkbox" id="catRevision" data-category="Revision">
                        <label for="catRevision">Revision</label>
                    </div>
                    <div class="category-item">
                        <input type="checkbox" id="catAssignment" data-category="Assignment">
                        <label for="catAssignment">Assignment</label>
                    </div>
                    <div class="category-item">
                        <input type="checkbox" id="catProject" data-category="Project">
                        <label for="catProject">Project</label>
                    </div>
                    <div class="category-item">
                        <input type="checkbox" id="catQuiz" data-category="Quiz">
                        <label for="catQuiz">Quiz</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- TASK LIST -->
        <div class="task-list" id="taskList" data-tasks='<?php echo $tasks_json; ?>'>
            <!-- Tasks rendered by JS -->
        </div>

        <a href="add-task.php">
            <button class="add-task-btn" id="addTaskBtn">ADD NEW TASK</button>
        </a>
    </main>
</div>

<script src="js/security.js"></script>
<script src="js/main.js"></script>
<script src="js/tasks.js"></script>

</body>
</html>


