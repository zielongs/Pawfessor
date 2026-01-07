<?php
session_start();
header('Content-Type: application/json');
include "db.php";

// Make sure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch($action) {

    /* =====================================
       FETCH TASKS
    ===================================== */
    case 'fetch':
        $sql = "SELECT * FROM tasks WHERE user_id=? ORDER BY due_date ASC, created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = [];
        while($row = $result->fetch_assoc()) {
            // Ensure priority is capitalized and completed is integer
            $row['priority'] = ucfirst(strtolower($row['priority']));
            $row['completed'] = isset($row['completed']) ? (int)$row['completed'] : 0;
            $tasks[] = $row;
        }
        echo json_encode(['status' => 'success', 'tasks' => $tasks]);
        break;

    /* =====================================
       EDIT TASK
    ===================================== */
    case 'edit':
        $task_id = $data['task_id'] ?? 0;
        $title = $data['title'] ?? '';
        $dueDate = $data['dueDate'] ?? '';
        $priority = ucfirst(strtolower($data['priority'] ?? 'Low')); // Capitalize
        $category = $data['category'] ?? '';

        $sql = "UPDATE tasks SET title=?, due_date=?, priority=?, category=? WHERE id=? AND user_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssii", $title, $dueDate, $priority, $category, $task_id, $user_id);
        if($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    /* =====================================
       DELETE TASK
    ===================================== */
    case 'delete':
        $task_id = $data['task_id'] ?? 0;
        $sql = "DELETE FROM tasks WHERE id=? AND user_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $task_id, $user_id);
        if($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    /* =====================================
       TOGGLE COMPLETE
    ===================================== */
    case 'complete':
        $task_id = $data['task_id'] ?? 0;
        $completed = (int)($data['completed'] ?? 0); // Ensure integer
        $sql = "UPDATE tasks SET completed=? WHERE id=? AND user_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $completed, $task_id, $user_id);
        if($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}
?>

