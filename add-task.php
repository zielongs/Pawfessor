<!-- ===================================================
     ADD NEW TASKS PAGE
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Date: 01 January 2026
    Tested by:
    Updated by:
    Description:
     This page allows users to create and save new tasks including:
     - Task title
     - Subject & category selection
     - Due date
     - Priority
     - Additional notes
     - Reminder options (default, 1-hour, custom premium)
     
     Form submission is handled via add-task.js
     and data is stored in localStorage.
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

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id  = $_SESSION['user_id'];
    $title    = mysqli_real_escape_string($conn, $_POST['taskTitle'] ?? '');
    $subject  = mysqli_real_escape_string($conn, $_POST['taskSubject'] ?? '');
    $category = strtolower(trim($_POST['taskCategory'] ?? ''));
    $category = mysqli_real_escape_string($conn, $category);
    $due_date = $_POST['taskDueDate'] ?? null;
    $priority = mysqli_real_escape_string($conn, $_POST['taskPriority'] ?? '');
    $notes    = mysqli_real_escape_string($conn, $_POST['taskNotes'] ?? '');

    if (!$title || !$category || !$priority || !$due_date) {
        $error = "Please fill in all required fields.";
    } else {
        $sql = "INSERT INTO tasks (user_id, title, subject, category, due_date, priority, notes, created_at) 
                VALUES ('$user_id', '$title', '$subject', '$category', '$due_date', '$priority', '$notes', NOW())";
        if (mysqli_query($conn, $sql)) {
            header("Location: tasks.php?added=1");
            exit();
        } else {
            $error = "Database error: " . mysqli_error($conn);
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Add New Task</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/styles.css">
<style>
/* Form-specific adjustments inside main-content/card */
.card form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.card .form-title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
}

.card .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
}

.card .form-group input,
.card .form-group select,
.card .form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    transition: all 0.2s;
}

.card .form-group input:focus,
.card .form-group select:focus,
.card .form-group textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    outline: none;
}

.card .save-btn,
.card .reset-btn {
    max-width: 200px;
    padding: 12px 25px;
    margin: 0 auto;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    border: none;
    transition: all 0.3s;
}

.card .save-btn {
    background: linear-gradient(135deg, #ffb6c1 0%, #ffd1dc 100%);
    color: #333;
    margin-bottom: 10px;
}

.card .save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.card .reset-btn {
    background-color: #ccc;
    color: #333;
}

.error-message {
    color: #e53935;
    font-size: 14px;
    text-align: center;
    margin-bottom: 15px;
}
</style>
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
            <a href="profiles.html" class="menu-item">
                <img src="images/Dashboard/d_profiles.png" width="40" height="40">
                <span>Profiles</span>
            </a>
        </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
        <div class="card">
            <h1 class="form-title">ADD NEW TASK</h1>

            <?php if ($error): ?>
                <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form action="add-task.php" method="post">
                <div class="form-group">
                    <label>Task Title</label>
                    <input type="text" name="taskTitle" placeholder="Enter task title" required>
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <select name="taskSubject">
                        <option value="">Select subject</option>
                        <option value="Math">Math</option>
                        <option value="English">English</option>
                        <option value="Science">Science</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Biology">Biology</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Category</label>
                    <select name="taskCategory" required>
                        <option value="">Select category</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Exam">Exam</option>
                        <option value="Revision">Revision</option>
                        <option value="Project">Project</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" name="taskDueDate" required>
                </div>

                <div class="form-group">
                    <label>Priority</label>
                    <select name="taskPriority" required>
                        <option value="">Select priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Additional Notes</label>
                    <textarea name="taskNotes" placeholder="Write notes"></textarea>
                </div>

                <button type="submit" class="save-btn">SAVE TASK</button>
                <button type="button" class="reset-btn" onclick="window.location.href='tasks.php'">CANCEL</button>
            </form>
        </div>
    </main>
</div>

<script>
// Mobile sidebar toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
</script>

</body>
</html>

