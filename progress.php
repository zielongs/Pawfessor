<?php
/* ===================================================
     DYNAMIC PROGRESS DASHBOARD
     ---------------------------------------------------
    Author: Noraziela Binti Jepsin
    Date: 31 December 2025
    Updated: 08 January 2026
    Description:
     Real-time progress tracking dashboard that:
     - Calculates progress from actual task data
     - Categorizes tasks by status (ongoing, incoming, completed, overdue)
     - Shows completion percentages and statistics
     - Updates automatically when tasks are added/modified
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
$fullname = $_SESSION['fullname'];

// Fetch all tasks for this user
$sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$ongoing_tasks = [];
$incoming_tasks = [];
$completed_tasks = [];
$overdue_tasks = [];

$today = date('Y-m-d');
$next_week = date('Y-m-d', strtotime('+7 days'));

while ($row = $result->fetch_assoc()) {
    $due_date = $row['due_date'];
    $completed = (int)$row['completed'];
    
    if ($completed == 1) {
        // Completed tasks
        $completed_tasks[] = $row;
    } elseif ($due_date < $today) {
        // Overdue tasks
        $overdue_tasks[] = $row;
    } elseif ($due_date <= $next_week) {
        // Ongoing tasks (due within a week and not completed)
        $ongoing_tasks[] = $row;
    } else {
        // Incoming tasks (due after a week)
        $incoming_tasks[] = $row;
    }
}

// Calculate overall progress for ongoing tasks
$total_ongoing = count($ongoing_tasks);
$total_completed = count($completed_tasks);
$total_tasks = $total_ongoing + $total_completed + count($overdue_tasks);
$overall_progress = $total_tasks > 0 ? round(($total_completed / $total_tasks) * 100) : 0;

// Calculate individual task progress (mock progress based on days passed)
function calculateTaskProgress($due_date, $created_at) {
    $today = time();
    $due = strtotime($due_date);
    $created = strtotime($created_at);
    
    if ($due <= $today) return 95; // Almost due
    
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

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Progress Dashboard</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/progress.css">
    <style>
        /* Additional dynamic styles */
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #666;
            font-style: italic;
        }
        
        .empty-state img {
            width: 120px;
            opacity: 0.5;
            margin-bottom: 15px;
        }
        
        .stats-banner {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .stat-item {
            text-align: center;
            flex: 1;
            min-width: 120px;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            display: block;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .priority-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: 600;
            margin-left: 8px;
        }
        
        .priority-high { background: #ff4757; color: white; }
        .priority-medium { background: #ffa502; color: white; }
        .priority-low { background: #2ed573; color: white; }
        
        .refresh-notice {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .refresh-notice.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
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
                <img src="images/Pawfessor_Logo.png" width="55" height="65" alt="Logo">
            </div>
            <nav>
                <a href="dashboard-user.php" class="menu-item"><img src="images/Dashboard/d_dashboard.png" width="40"><span>Dashboard</span></a>
                <a href="tasks.php" class="menu-item"><img src="images/Dashboard/d_my_tasks.png" width="40"><span>My Tasks</span></a>
                <a href="progress.php" class="menu-item active"><img src="images/Dashboard/d_progress.png" width="40"><span>Progress</span></a>
                <a href="store.html" class="menu-item"><img src="images/Dashboard/d_mascot_store.png" width="40"><span>Mascot Store</span></a>
                <a href="subscriptions.html" class="menu-item"><img src="images/Dashboard/d_subscriptions.png" width="40"><span>Subscriptions</span></a>
                <a href="carts.html" class="menu-item"><img src="images/Dashboard/d_carts.png" width="40"><span>Carts</span></a>
                <a href="transaction-history.html" class="menu-item"><img src="images/Dashboard/d_transaction_history.png" width="40"><span>Transaction History</span></a>
                <a href="profiles.html" class="menu-item"><img src="images/Dashboard/d_profiles.png" width="40"><span>Profiles</span></a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="header">
                <div></div>
                <div class="header-icons">
                    <button class="icon-btn" id="notificationBtn" aria-label="Notifications">
                        <img src="images/bell_icon.png" width="40" height="40" alt="Notifications">
                    </button>
                    <button class="icon-btn" id="profileBtn" aria-label="Profile">
                        <img src="images/h_profiles.png" width="55" height="50" alt="Profile">
                    </button>
                </div>
            </header>

            <!-- Statistics Banner -->
            <div class="stats-banner">
                <div class="stat-item">
                    <span class="stat-number"><?php echo $total_tasks; ?></span>
                    <span class="stat-label">Total Tasks</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo $total_ongoing; ?></span>
                    <span class="stat-label">In Progress</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo $total_completed; ?></span>
                    <span class="stat-label">Completed</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo count($overdue_tasks); ?></span>
                    <span class="stat-label">Overdue</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number"><?php echo $overall_progress; ?>%</span>
                    <span class="stat-label">Overall Progress</span>
                </div>
            </div>

            <!-- ONGOING TASKS -->
            <section class="prog-block bg-ongoing">
                <div class="block-header">
                    <img src="images/Progress/ongoing.png" class="header-icon-img" alt="Ongoing">
                    <div class="block-title">ONGOING (<?php echo count($ongoing_tasks); ?>)</div>
                </div>
                <div class="ongoing-content">
                    <?php if (count($ongoing_tasks) > 0): ?>
                        <div class="chart-container">
                            <svg viewBox="0 0 100 100">
                                <circle class="circle-bg" cx="50" cy="50" r="40"></circle>
                                <circle class="circle-fill" cx="50" cy="50" r="40" 
                                        style="stroke-dasharray: <?php echo $overall_progress * 2.51; ?>, 251.2;"></circle>
                            </svg>
                            <div class="chart-val"><?php echo $overall_progress; ?>%</div>
                        </div>
                        
                        <div class="task-list">
                            <?php foreach ($ongoing_tasks as $task): 
                                $progress = calculateTaskProgress($task['due_date'], $task['created_at']);
                                $emoji = getCategoryEmoji($task['category']);
                            ?>
                            <div class="task-card">
                                <div class="task-icon"><?php echo $emoji; ?></div>
                                <div class="task-info">
                                    <h4>
                                        <?php echo htmlspecialchars($task['title']); ?>
                                        <span class="priority-badge priority-<?php echo strtolower($task['priority']); ?>">
                                            <?php echo $task['priority']; ?>
                                        </span>
                                    </h4>
                                    <p>Due on <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: <?php echo $progress; ?>%;"></div>
                                    </div>
                                </div>
                                <span class="progress-label"><?php echo $progress; ?>/100%</span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="empty-state">
                            <p>🎉 No ongoing tasks! Start by adding a new task.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </section>

            <!-- INCOMING TASKS -->
            <section class="prog-block bg-incoming">
                <div class="block-header">
                    <img src="images/Progress/incoming.png" class="header-icon-img" alt="Incoming">
                    <div class="block-title">INCOMING (<?php echo count($incoming_tasks); ?>)</div>
                </div>
                <div class="card-grid">
                    <?php if (count($incoming_tasks) > 0): ?>
                        <?php foreach ($incoming_tasks as $task): 
                            $emoji = getCategoryEmoji($task['category']);
                        ?>
                        <div class="item-card">
                            <div class="item-icon"><?php echo $emoji; ?></div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($task['title']); ?></h4>
                                <p>Opens on <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                                <span class="priority-badge priority-<?php echo strtolower($task['priority']); ?>">
                                    <?php echo $task['priority']; ?>
                                </span>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="empty-state">
                            <p>📅 No upcoming tasks scheduled</p>
                        </div>
                    <?php endif; ?>
                </div>
            </section>

            <!-- COMPLETED TASKS -->
            <section class="prog-block bg-completed">
                <div class="block-header">
                    <img src="images/Progress/completed.png" class="header-icon-img" alt="Completed">
                    <div class="block-title">COMPLETED (<?php echo count($completed_tasks); ?>)</div>
                </div>
                <div class="card-grid">
                    <?php if (count($completed_tasks) > 0): ?>
                        <?php foreach ($completed_tasks as $task): 
                            $emoji = getCategoryEmoji($task['category']);
                        ?>
                        <div class="item-card">
                            <div class="item-icon completed"><?php echo $emoji; ?></div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($task['title']); ?></h4>
                                <p>Completed ✓</p>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="empty-state">
                            <p>🎯 Complete tasks to see them here!</p>
                        </div>
                    <?php endif; ?>
                </div>
            </section>

            <!-- OVERDUE TASKS -->
            <section class="prog-block bg-overdue">
                <div class="block-header">
                    <img src="images/Progress/overdue.png" class="header-icon-img" alt="Overdue">
                    <div class="block-title">OVERDUE (<?php echo count($overdue_tasks); ?>)</div>
                </div>
                <div class="card-grid">
                    <?php if (count($overdue_tasks) > 0): ?>
                        <?php foreach ($overdue_tasks as $task): 
                            $emoji = getCategoryEmoji($task['category']);
                            $days_overdue = floor((time() - strtotime($task['due_date'])) / 86400);
                        ?>
                        <div class="item-card">
                            <div class="item-icon overdue">⚠️</div>
                            <div class="item-info">
                                <h4><?php echo htmlspecialchars($task['title']); ?></h4>
                                <p>Due on <?php echo date('jS F Y', strtotime($task['due_date'])); ?></p>
                                <p style="color: #e74c3c; font-weight: bold;">
                                    <?php echo $days_overdue; ?> day<?php echo $days_overdue != 1 ? 's' : ''; ?> overdue
                                </p>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="empty-state">
                            <p>✨ Great job! No overdue tasks.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </section>
        </main>
    </div>

    <script src="js/main.js"></script>
    <script>
        // Auto-refresh notification when returning from tasks page
        window.addEventListener('pageshow', function(event) {
            if (event.persisted || performance.navigation.type === 2) {
                showRefreshNotice();
            }
        });

        function showRefreshNotice() {
            const notice = document.getElementById('refreshNotice');
            notice.classList.add('show');
            setTimeout(() => {
                notice.classList.remove('show');
            }, 3000);
        }

        // Check if we just came from adding a task
        if (document.referrer.includes('tasks.php') || document.referrer.includes('add-task.php')) {
            showRefreshNotice();
        }
    </script>
</body>
</html>
