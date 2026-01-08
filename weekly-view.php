<?php
/* ===================================================
     WEEKLY VIEW - DYNAMIC CALENDAR
     ---------------------------------------------------
    Author: Noraziela Binti Jepsin
    Updated: 08 January 2026
    
    Features:
    - Shows tasks in calendar format
    - Click time slots to add tasks
    - Click tasks to view/edit
    - Week navigation
    - Real-time data from database
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

// Get current week or requested week
$week_offset = isset($_GET['week']) ? intval($_GET['week']) : 0;
$current_date = new DateTime();
$current_date->modify("$week_offset week");

// Get start of week (Sunday)
$start_of_week = clone $current_date;
$start_of_week->modify('sunday this week');

// Get end of week (Saturday)
$end_of_week = clone $start_of_week;
$end_of_week->modify('+6 days');

// Fetch tasks for this week
$start_date = $start_of_week->format('Y-m-d');
$end_date = $end_of_week->format('Y-m-d');

$sql = "SELECT * FROM tasks 
        WHERE user_id = ? 
        AND due_date BETWEEN ? AND ?
        ORDER BY due_date ASC, created_at ASC";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "iss", $user_id, $start_date, $end_date);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$tasks_by_date = [];
while ($row = mysqli_fetch_assoc($result)) {
    $date = $row['due_date'];
    if (!isset($tasks_by_date[$date])) {
        $tasks_by_date[$date] = [];
    }
    $tasks_by_date[$date][] = $row;
}

// Generate week days
$week_days = [];
for ($i = 0; $i < 7; $i++) {
    $day = clone $start_of_week;
    $day->modify("+$i days");
    $week_days[] = $day;
}

// Month and year for display
$display_month = $start_of_week->format('F Y');
if ($start_of_week->format('m') !== $end_of_week->format('m')) {
    $display_month = $start_of_week->format('F') . ' - ' . $end_of_week->format('F Y');
}

$tasks_json = json_encode($tasks_by_date, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly View - Pawfessor</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/weekly-view.css">
</head>
<body>

    <button class="menu-toggle" id="menuToggle">
        <img src="images/Dashboard/d_sidebar.png" width="40" height="40" alt="Menu">
    </button>

    <div class="container">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="images/Pawfessor_Logo.png" width="55" height="65" alt="Logo">
            </div>
            <nav>
                <a href="dashboard-user.php" class="menu-item">
                    <img src="images/Dashboard/d_dashboard.png" width="40"><span>Dashboard</span>
                </a>
                <a href="tasks.php" class="menu-item">
                    <img src="images/Dashboard/d_my_tasks.png" width="40"><span>My Tasks</span>
                </a>
                <a href="progress.php" class="menu-item">
                    <img src="images/Dashboard/d_progress.png" width="40"><span>Progress</span>
                </a>
                <a href="weekly-view.php" class="menu-item active">
                    <img src="images/Dashboard/d_progress.png" width="40"><span>Weekly View</span>
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
 
        <main class="main-content weekly-page">
            <header class="header">
                <div class="header-left">
                    <button class="today-btn" onclick="goToToday()">TODAY</button>
                    <div class="nav-arrows">
                        <button class="arrow-btn" onclick="changeWeek(-1)">‹</button>
                        <button class="arrow-btn" onclick="changeWeek(1)">›</button>
                    </div>
                    <div class="month-display"><?php echo strtoupper($display_month); ?></div>
                </div>

                <div class="header-right">
                    <button class="add-task-btn" onclick="window.location.href='add-task.php'">
                        ➕ Add Task
                    </button>
                    
                    <div class="header-icons">
                        <button class="icon-btn" id="notificationBtn">
                            <img src="images/bell_icon.png" width="40" height="40" alt="Notifications">
                        </button>
                        <button class="icon-btn" id="profileBtn">
                            <img src="images/h_profiles.png" width="55" height="50" alt="Profile">
                        </button>
                    </div>
                </div>
            </header>

            <div class="calendar-wrapper">
                <table class="calendar-table">
                    <thead>
                        <tr>
                            <th class="time-header"></th>
                            <?php foreach ($week_days as $day): 
                                $is_today = $day->format('Y-m-d') === date('Y-m-d');
                            ?>
                            <th class="day-header <?php echo $is_today ? 'today' : ''; ?>">
                                <div class="day-number"><?php echo $day->format('j'); ?></div>
                                <div class="day-name"><?php echo $day->format('D'); ?></div>
                            </th>
                            <?php endforeach; ?>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <?php 
                        $hours = ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
                                  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', 
                                  '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
                        
                        foreach ($hours as $hour): 
                        ?>
                        <tr>
                            <td class="time-cell"><?php echo $hour; ?></td>
                            <?php foreach ($week_days as $day): 
                                $date_key = $day->format('Y-m-d');
                                $is_today = $day->format('Y-m-d') === date('Y-m-d');
                            ?>
                            <td class="calendar-cell <?php echo $is_today ? 'today' : ''; ?>" 
                                data-date="<?php echo $date_key; ?>" 
                                data-hour="<?php echo $hour; ?>"
                                onclick="addTaskToSlot('<?php echo $date_key; ?>', '<?php echo $hour; ?>')">
                                
                                <?php 
                                if (isset($tasks_by_date[$date_key])) {
                                    foreach ($tasks_by_date[$date_key] as $task) {
                                        $priority_class = 'priority-' . strtolower($task['priority']);
                                        $completed_class = $task['completed'] ? 'completed' : '';
                                        ?>
                                        <div class="event <?php echo $priority_class . ' ' . $completed_class; ?>" 
                                             onclick="showTaskDetail(<?php echo $task['id']; ?>, event)">
                                            <?php if ($task['completed']): ?>
                                                <span class="check-mark">✓</span>
                                            <?php endif; ?>
                                            <?php echo htmlspecialchars($task['title']); ?>
                                        </div>
                                        <?php
                                    }
                                }
                                ?>
                            </td>
                            <?php endforeach; ?>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Task Detail Modal -->
    <div class="modal" id="taskModal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <div id="modalBody"></div>
        </div>
    </div>

    <!-- Hidden data for JavaScript -->
    <div id="weekData" 
         data-offset="<?php echo $week_offset; ?>" 
         data-tasks='<?php echo $tasks_json; ?>'
         style="display: none;">
    </div>

    <script src="js/main.js"></script>
    <script src="js/weekly-view.js"></script>
</body>
</html>
