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
            // Redirect to tasks.php so it shows immediately
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
<link rel="stylesheet" href="css/add-tasks.css">
</head>
<body>

<div class="container">
    <main class="main-content">
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
            <a href="tasks.php"><button type="button" class="reset-btn">Cancel</button></a>
        </form>
    </main>
</div>

</body>
</html>


