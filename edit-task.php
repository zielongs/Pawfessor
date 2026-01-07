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
            // Refresh task data
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
<link rel="stylesheet" href="css/add-tasks.css">
</head>
<body>
<div class="container">
    <main class="main-content">
        <div class="form-container">
            <h1 class="form-title">EDIT TASK</h1>

            <?php if ($success): ?>
                <div class="success-message"><?php echo htmlspecialchars($success); ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>

            <form method="post">
                <div class="form-group">
                    <label class="form-label">Task Title</label>
                    <input type="text" class="form-input" name="taskTitle" value="<?php echo htmlspecialchars($task['title']); ?>" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Subject:</label>
                    <input type="text" class="form-input" name="taskSubject" value="<?php echo htmlspecialchars($task['subject']); ?>">
                </div>

                <div class="form-group">
                    <label class="form-label">Category:</label>
                    <select class="form-select" name="taskCategory" required>
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
                    <label class="form-label">Due Date:</label>
                    <input type="date" class="form-input" name="taskDueDate" value="<?php echo $task['due_date']; ?>" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Priority:</label>
                    <select class="form-select" name="taskPriority" required>
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
                    <label class="form-label">Notes:</label>
                    <textarea class="form-textarea" name="taskNotes"><?php echo htmlspecialchars($task['notes']); ?></textarea>
                </div>

                <button type="submit" class="save-btn">UPDATE TASK</button>
                <a href="tasks.php"><button type="button" class="reset-btn">CANCEL</button></a>
            </form>
        </div>
    </main>
</div>
</body>
</html>
