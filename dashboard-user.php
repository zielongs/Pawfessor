<!-- ===================================================
     DASHBOARD PAGE
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Date: 31 December 2025
    Tested by: Noraziela Binti Jepsin
    Updated by: Noraziela Binti Jepsin
    Description:
     This page displays the main user dashboard including:
     - User greeting
     - Today's tasks
     - Progress summary (weekly & overall)
     - Upcoming deadlines

     All dynamic content is populated via dashboard.js
     using data stored in localStorage.
=================================================== -->

<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// User info
$fullname = $_SESSION['fullname'];
$email = $_SESSION['email'];
$user_id = $_SESSION['user_id'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

<!-- Sidebar toggle button -->
<button class="menu-toggle" id="menuToggle">
    <img src="images/Dashboard/d_sidebar.png" width="40" height="40" alt="Menu">
</button>

<div class="container">

    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="images/Pawfessor_Logo.png" width="55" height="65" alt="Pawfessor Logo">
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

    <!-- MAIN CONTENT -->
    <main class="main-content">

        <!-- HEADER -->
        <header class="header">
            <div></div>
            <div class="header-icons">
                <a href="profiles.php" class="icon-btn" id="profileBtn" aria-label="Profile">
                    <img src="images/h_profiles.png" width="55" height="50" alt="Profile">
                </a>
            </div>
        </header>

        <?php
$hour = date('H'); // 24-hour format

if ($hour >= 5 && $hour < 12) {
    $greeting = "Good morning";
} elseif ($hour >= 12 && $hour < 17) {
    $greeting = "Good afternoon";
} else {
    $greeting = "Good evening";
}
?>
        <!-- GREETING -->
        <div class="greeting">
    <?php echo $greeting; ?>, <strong><?php echo htmlspecialchars($fullname); ?></strong>
</div>

        <!-- TODAY'S TASKS -->
        <div class="card">
            <h3 class="card-title">Today's Tasks</h3>
            <div id="todayTasksContainer"></div>
        </div>

        <!-- PROGRESS SUMMARY -->
        <div class="card">
            <h3 class="card-title">Progress Summary</h3>
            <div class="progress-bar-container">
                <div class="progress-label">
                    <span>Weekly Progress</span>
                    <span id="weeklyPercent"></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="weeklyProgress"></div>
                </div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-label">
                    <span>Task Completed</span>
                    <span id="taskPercent"></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="todayTaskProgress"></div>
                </div>
            </div>
        </div>

        <!-- UPCOMING DEADLINES -->
        <div class="card">
            <h3 class="card-title">Upcoming Deadlines</h3>
            <div id="deadlinesContainer"></div>
            <div class="weekly-view" id="weeklyViewBtn">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="images/Dashboard/s_weekly_view.png" width="40" height="40" alt="Weekly View">
                    <span style="font-weight: 500;">Weekly View</span>
                </div>
                <button class="arrow-btn">→</button>
            </div>
        </div>

    </main>
</div>

<!-- JS FILES -->
<script src="js/security.js"></script>
<script src="js/main.js"></script>
<script src="js/dashboard-user.js"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const weeklyViewBtn = document.getElementById('weeklyViewBtn');
    if (weeklyViewBtn) {
        weeklyViewBtn.addEventListener('click', () => {
            window.location.href = 'weekly-view.php';
        });
    }
});
</script>


</body>
</html>




