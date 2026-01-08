<?php
session_start();
include "db.php";

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$task_id = intval($_GET['id']);
$error = '';
$success = '';

// Fetch task
$sql = "SELECT * FROM tasks WHERE id='$task_id' AND user_id='$user_id'";
$result = mysqli_query($conn, $sql);
$task = mysqli_fetch_assoc($result);

if (!$task) {
    die("Task not found!");
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = mysqli_real_escape_string($conn, $_POST['taskTitle'] ?? '');
    $subject = mysqli_real_escape_string($conn, $_POST['taskSubject'] ?? '');
    $category = mysqli_real_escape_string($conn, $_POST['taskCategory'] ?? '');
    $due_date = $_POST['taskDueDate'] ?? null;
    $priority = mysqli_real_escape_string($conn, $_POST['taskPriority'] ?? '');
    $notes = mysqli_real_escape_string($conn, $_POST['taskNotes'] ?? '');

    if (!$title || !$category || !$priority || !$due_date) {
        $error = "Please fill in all required fields.";
    } else {
        $sql_update = "UPDATE tasks SET title='$title', subject='$subject', category='$category', due_date='$due_date', priority='$priority', notes='$notes' WHERE id='$task_id' AND user_id='$user_id'";
        if (mysqli_query($conn, $sql_update)) {
            $success = "Task updated successfully!";
            $result = mysqli_query($conn, "SELECT * FROM tasks WHERE id='$task_id' AND user_id='$user_id'");
            $task = mysqli_fetch_assoc($result);
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
<title>Edit Task</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/styles.css">
<style>
/* Form-specific tweaks inside main-content/card */
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

.success-message {
    color: #4caf50;
    font-size: 14px;
    text-align: center;
    margin-bottom: 15px;
}

.error-message {
    color: #e53935;
    font-size: 14px;
    text-align: center;
    margin-bottom: 15px;
}

.reset-btn {
    background-color: #ccc;
    color: #333;
    text-decoration: none;  /* remove underline */
}

a .reset-btn {
    text-decoration: none;  /* ensure no underline inside <a> */
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

    <!-- MAIN CONTENT -->
    <main class="main-content">
        <div class="card">
            <h1 class="form-title">EDIT TASK</h1>

            <?php if ($success): ?>
                <div class="success-message"><?php echo htmlspecialchars($success); ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="post">
                <div class="form-group">
                    <label>Task Title</label>
                    <input type="text" name="taskTitle" value="<?php echo htmlspecialchars($task['title']); ?>" required>
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" name="taskSubject" value="<?php echo htmlspecialchars($task['subject']); ?>">
                </div>

                <div class="form-group">
                    <label>Category</label>
                    <select name="taskCategory" required>
                        <?php
                        $categories = ['Assignment','Exam','Revision','Project','Quiz','Other'];
                        foreach ($categories as $cat) {
                            $sel = ($task['category'] == $cat) ? 'selected' : '';
                            echo "<option value='$cat' $sel>$cat</option>";
                        }
                        ?>
                    </select>
                </div>

                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" name="taskDueDate" value="<?php echo $task['due_date']; ?>" required>
                </div>

                <div class="form-group">
                    <label>Priority</label>
                    <select name="taskPriority" required>
                        <?php
                        $priorities = ['High','Medium','Low'];
                        foreach ($priorities as $p) {
                            $sel = ($task['priority'] == $p) ? 'selected' : '';
                            echo "<option value='$p' $sel>$p</option>";
                        }
                        ?>
                    </select>
                </div>

                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="taskNotes"><?php echo htmlspecialchars($task['notes']); ?></textarea>
                </div>

                <button type="submit" class="save-btn">UPDATE TASK</button>
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
