<?php
/* ===================================================
     DYNAMIC PROGRESS DASHBOARD - ENHANCED VERSION
     ---------------------------------------------------
    Author: Noraziela Binti Jepsin
    Date: 31 December 2025
    Updated: 08 January 2026
    
    Features:
    - Real-time task tracking
    - Visual progress indicators
    - Category-based organization
    - Priority system
    - Completion tracking
    - Interactive statistics
=================================================== */

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

// Fetch all tasks for this user
$sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$ongoing_tasks = [];
$incoming_tasks = [];
$completed_tasks = [];
$overdue_tasks = [];

$today = date('Y-m-d');
$next_week = date('Y-m-d', strtotime('+7 days'));

// Categorize tasks
while ($row = mysqli_fetch_assoc($result)) {
    $due_date = $row['due_date'];
    $completed = isset($row['completed']) ? (int)$row['completed'] : 0;
    
    if ($completed == 1) {
        $completed_tasks[] = $row;
    } elseif ($due_date < $today) {
        $overdue_tasks[] = $row;
    } elseif ($due_date <= $next_week) {
        $ongoing_tasks[] = $row;
    } else {
        $incoming_tasks[] = $row;
    }
}

// Calculate statistics
$total_ongoing = count($ongoing_tasks);
$total_completed = count($completed_tasks);
$total_overdue = count($overdue_tasks);
$total_incoming = count($incoming_tasks);
$total_tasks = $total_ongoing + $total_completed + $total_overdue + $total_incoming;
$overall_progress = $total_tasks > 0 ? round(($total_completed / $total_tasks) * 100) : 0;

// Calculate completion rate
$completion_rate = ($total_ongoing + $total_completed) > 0 
    ? round(($total_completed / ($total_ongoing + $total_completed)) * 100) 
    : 0;

// Calculate individual task progress (based on time elapsed)
function calculateTaskProgress($due_date, $created_at) {
    $today = time();
    $due = strtotime($due_date);
    $created = strtotime($created_at);
    
    if ($due <= $today) return 95;
    
    $total_duration = $due - $created;
    $time_passed = $today - $created;
    
    if ($total_duration <= 0) return 50;
    
    $progress = ($time_passed / $total_duration) * 100;
    return max(10, min(95, round($progress)));
}

// Category emoji mapping
function getCategoryEmoji($category) {
    $emojis = [
        'Exam' => '📝',
        'Assignment' => '📄',
        'Project' => '🎯',
        'Quiz' => '❓',
        'Revision' => '📚',
        'default' => '📌'
    ];
    return $emojis[$category] ?? $emojis['default'];
}

// Priority color mapping
function getPriorityColor($priority) {
    $colors = [
        'High' => '#ff4757',
        'Medium' => '#ffa502',
        'Low' => '#2ed573',
        'default' => '#95a5a6'
    ];
    return $colors[$priority] ?? $colors['default'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Progress Dashboard - Pawfessor</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/progress.css">
</head>
<body>

    <div class="refresh-notice" id="refreshNotice">
        ✓ Progress updated successfully!
    </div>

    <button class="menu-toggle" id="menuToggle">
        <img src="images/Dashboard/d_sidebar.png" width="40" height="40" alt="Menu">
    </button>

    <div class="container">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="images/Pawfessor_Logo.png" width="55" height="65" alt="Pawfessor Logo">
            </div>
            <nav>
                <a href="dashboard-user.php" class="menu-item">
                    <img src="images/Dashboard/d_dashboard.png" width="40"><span>Dashboard</span>
                </a>
                <a href="tasks.php" class="menu-item">
                    <img src="images/Dashboard/d_my_tasks.png" width="40"><span>My Tasks</span>
                </a>
                <a href="progress.php" class="menu-item active">
                    <img src="images/Dashboard/d_progress.png" width="40"><span>Progress</span>
                </a>
                <a href="store.html" class="menu-item">
                    <img src="images/Dashboard/d_mascot_store.png" width="40"><span>Mascot Store</span>
                </a>
                <a href="subscriptions.html" class="menu-item">
                    <img src="images/Dashboard/d_subscriptions.png" width="40"><span>Subscriptions</span>
                </a>
                <a href="carts.html" class="menu-item">
                    <img src="images/Dashboard/d_carts.png" width="40"><span>Carts</span>
                </a>
                <a href="transaction-history.html" class="menu-item">
                    <img src="images/Dashboard/d_transaction_history.png" width="40"><span>Transaction History</span>
                </a>
                <a href="profiles.html" class="menu-item">
                    <img src="images/Dashboard/d_profiles.png" width="40"><span>Profiles</span>
                </a>
            </nav>
        </aside>

        <main class="main-content progress-page">
            <!-- Page Header -->
            <div class="page-header">
                <h1>📊 Progress Dashboard</h1>
                <p>Welcome back, <?php echo htmlspecialchars($fullname); ?>! Track your academic journey here.</p>
            </div>

            <!-- Statistics Dashboard -->
            <div class="stats-dashboard">
                <div class="stat-card total">
                    <div class="stat-icon">📚</div>
                    <span class="stat-number"><?php echo $total_tasks; ?></span>
                    <span class="stat-label">Total Tasks</span>
                </div>
                
                <div class="stat-card ongoing">
                    <div class="stat-icon">⚡</div>
                    <span class="stat-number"><?php echo $total_ongoing; ?></span>
                    <span class="stat-label">In Progress</span>
                </div>
                
                <div class="stat-card completed">
                    <div class="stat-icon">✓</div>
                    <span class="stat-number"><?php echo $total_completed; ?></span>
                    <span class="stat-label">Completed</span>
                </div>
                
                <div class="stat-card overdue">
                    <div class="stat-icon">⚠️</div>
                    <span class="stat-number"><?php echo $total_overdue; ?></span>
                    <span class="stat-label">Overdue</span>
                </div>
                
                <div class="stat-card incoming">
                    <div class="stat-icon">📅</div>
                    <span class="stat-number"><?php echo $total_incoming; ?></span>
                    <span class="stat-label">Upcoming</span>
                </div>
            </div>

            <div class="progress-sections">
                <!-- ONGOING TASKS -->
                <section class="prog-block bg-ongoing">
                    <div class="block-header">
                        <img src="images/Progress/ongoing.png" class="header-icon-img" alt="Ongoing">
                        <div class="block-title">ONGOING</div>
                        <span class="task-count"><?php echo count($ongoing_tasks); ?> task<?php echo count($ongoing_tasks) != 1 ? 's' : ''; ?></span>
                    </div>
                    
                    <?php if (count($ongoing_tasks) > 0): ?>
                    <div class="ongoing-content">
                        <div class="chart-container">
                            <svg viewBox="0 0 200 200">
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
                                    </linearGradient>
                                </defs>
                                <circle class="circle-bg" cx="100" cy="100" r="80"></circle>
                                <circle class="circle-fill" cx="100" cy="100" r="80" 
                                        data-progress="<?php echo $completion_rate; ?>"></circle>
                            </svg>
                            <div class="chart-val">
                                <span class="percentage"><?php echo $completion_rate; ?>%</span>
                                <span class="label">Complete</span>
                            </div>
                        </div>
                        
                        <div class="task-list">
                            <?php foreach ($ongoing_tasks as $task): 
                                $progress = calculateTaskProgress($task['due_date'], $task['created_at']);
                                $emoji = getCategoryEmoji($task['category']);
                                $priority_color = getPriorityColor($task['priority']);
                            ?>
                            <div class="task-card">
                                <div class="task-icon"><?php echo $emoji; ?></div>
                                <div class="task-info">
                                    <h4>
                                        <?php echo htmlspecialchars($task['title']); ?>
                                        <span class="priority-badge" style="background: <?php echo $priority_color; ?>">
                                            <?php echo $task['priority']; ?>
                                        </span>
                                    </h4>
                                    <p>📅 Due on <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                                    <p>🏷️ Category: <?php echo $task['category']; ?></p>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: <?php echo $progress; ?>%;"></div>
                                    </div>
                                </div>
                                <span class="progress-label"><?php echo $progress; ?>%</span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php else: ?>
                    <div class="empty-state">
                        <span class="emoji">🎉</span>
                        <p>No ongoing tasks! You're all caught up.</p>
                        <p><a href="add-task.php" style="color: #667eea; text-decoration: none; font-weight: 600;">Add a new task</a> to get started.</p>
                    </div>
                    <?php endif; ?>
                </section>

                <!-- INCOMING TASKS -->
                <section class="prog-block bg-incoming">
                    <div class="block-header">
                        <img src="images/Progress/incoming.png" class="header-icon-img" alt="Incoming">
                        <div class="block-title">UPCOMING</div>
                        <span class="task-count"><?php echo count($incoming_tasks); ?> task<?php echo count($incoming_tasks) != 1 ? 's' : ''; ?></span>
                    </div>
                    
                    <?php if (count($incoming_tasks) > 0): ?>
                    <div class="card-grid">
                        <?php foreach ($incoming_tasks as $task): 
                            $emoji = getCategoryEmoji($task['category']);
                            $priority_color = getPriorityColor($task['priority']);
                            $days_until = floor((strtotime($task['due_date']) - time()) / 86400);
                        ?>
                        <div class="item-card">
                            <div class="item-icon"><?php echo $emoji; ?></div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($task['title']); ?></h4>
                                <p>📅 Due in <?php echo $days_until; ?> day<?php echo $days_until != 1 ? 's' : ''; ?></p>
                                <p>🗓️ <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                                <span class="priority-badge" style="background: <?php echo $priority_color; ?>">
                                    <?php echo $task['priority']; ?>
                                </span>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php else: ?>
                    <div class="empty-state">
                        <span class="emoji">📅</span>
                        <p>No upcoming tasks scheduled for later.</p>
                    </div>
                    <?php endif; ?>
                </section>

                <!-- COMPLETED TASKS -->
                <section class="prog-block bg-completed">
                    <div class="block-header">
                        <img src="images/Progress/completed.png" class="header-icon-img" alt="Completed">
                        <div class="block-title">COMPLETED</div>
                        <span class="task-count"><?php echo count($completed_tasks); ?> task<?php echo count($completed_tasks) != 1 ? 's' : ''; ?></span>
                    </div>
                    
                    <?php if (count($completed_tasks) > 0): ?>
                    <div class="card-grid">
                        <?php foreach ($completed_tasks as $task): 
                            $emoji = getCategoryEmoji($task['category']);
                        ?>
                        <div class="item-card">
                            <div class="item-icon completed"><?php echo $emoji; ?></div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($task['title']); ?></h4>
                                <p>✓ Completed Successfully</p>
                                <p>🗓️ <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php else: ?>
                    <div class="empty-state">
                        <span class="emoji">🎯</span>
                        <p>Complete tasks to see them here!</p>
                    </div>
                    <?php endif; ?>
                </section>

                <!-- OVERDUE TASKS -->
                <section class="prog-block bg-overdue">
                    <div class="block-header">
                        <img src="images/Progress/overdue.png" class="header-icon-img" alt="Overdue">
                        <div class="block-title">OVERDUE</div>
                        <span class="task-count"><?php echo count($overdue_tasks); ?> task<?php echo count($overdue_tasks) != 1 ? 's' : ''; ?></span>
                    </div>
                    
                    <?php if (count($overdue_tasks) > 0): ?>
                    <div class="card-grid">
                        <?php foreach ($overdue_tasks as $task): 
                            $emoji = getCategoryEmoji($task['category']);
                            $priority_color = getPriorityColor($task['priority']);
                            $days_overdue = floor((time() - strtotime($task['due_date'])) / 86400);
                        ?>
                        <div class="item-card">
                            <div class="item-icon overdue">⚠️</div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($task['title']); ?></h4>
                                <p>🗓️ Was due on <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                                <p style="color: #e74c3c; font-weight: bold;">
                                    ⏰ <?php echo $days_overdue; ?> day<?php echo $days_overdue != 1 ? 's' : ''; ?> overdue
                                </p>
                                <span class="priority-badge" style="background: <?php echo $priority_color; ?>">
                                    <?php echo $task['priority']; ?>
                                </span>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php else: ?>
                    <div class="empty-state">
                        <span class="emoji">✨</span>
                        <p>Great job! No overdue tasks.</p>
                    </div>
                    <?php endif; ?>
                </section>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="add-task.php" class="fab-btn" title="Add New Task">
                    +
                </a>
                <a href="tasks.php" class="fab-btn" title="View All Tasks">
                    📋
                </a>
            </div>
        </main>
    </div>

    <script src="js/main.js"></script>
    <script src="js/progress.js"></script>
</body>
</html>
