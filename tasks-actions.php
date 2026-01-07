<?php
/* ===================================================
     ENHANCED TASK API WITH PROGRESS TRACKING
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Update: Noraziela Binti Jepsin
    Features:
     - CRUD operations for tasks
     - Automatic progress calculation
     - Task statistics and analytics
     - Category-based organization
=================================================== */

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
       FETCH TASKS WITH PROGRESS DATA
    ===================================== */
    case 'fetch':
        $sql = "SELECT * FROM tasks WHERE user_id=? ORDER BY due_date ASC, created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = [];
        
        $today = date('Y-m-d');
        $stats = [
            'total' => 0,
            'ongoing' => 0,
            'incoming' => 0,
            'completed' => 0,
            'overdue' => 0
        ];
        
        while($row = $result->fetch_assoc()) {
            // Ensure priority is capitalized and completed is integer
            $row['priority'] = ucfirst(strtolower($row['priority']));
            $row['completed'] = isset($row['completed']) ? (int)$row['completed'] : 0;
            
            // Calculate status
            if ($row['completed'] == 1) {
                $row['status'] = 'completed';
                $stats['completed']++;
            } elseif ($row['due_date'] < $today) {
                $row['status'] = 'overdue';
                $stats['overdue']++;
            } elseif ($row['due_date'] <= date('Y-m-d', strtotime('+7 days'))) {
                $row['status'] = 'ongoing';
                $stats['ongoing']++;
            } else {
                $row['status'] = 'incoming';
                $stats['incoming']++;
            }
            
            $stats['total']++;
            $tasks[] = $row;
        }
        
        echo json_encode([
            'status' => 'success', 
            'tasks' => $tasks,
            'statistics' => $stats
        ]);
        break;

    /* =====================================
       EDIT TASK
    ===================================== */
    case 'edit':
        $task_id = $data['task_id'] ?? 0;
        $title = $data['title'] ?? '';
        $dueDate = $data['dueDate'] ?? '';
        $priority = ucfirst(strtolower($data['priority'] ?? 'Low'));
        $category = $data['category'] ?? '';

        $sql = "UPDATE tasks SET title=?, due_date=?, priority=?, category=? WHERE id=? AND user_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssii", $title, $dueDate, $priority, $category, $task_id, $user_id);
        
        if($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Task updated successfully']);
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
            echo json_encode(['status' => 'success', 'message' => 'Task deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    /* =====================================
       TOGGLE COMPLETE
    ===================================== */
    case 'complete':
        $task_id = $data['task_id'] ?? 0;
        $completed = (int)($data['completed'] ?? 0);
        
        $sql = "UPDATE tasks SET completed=? WHERE id=? AND user_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $completed, $task_id, $user_id);
        
        if($stmt->execute()) {
            echo json_encode([
                'status' => 'success', 
                'message' => $completed ? 'Task marked as complete!' : 'Task marked as incomplete'
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    /* =====================================
       GET PROGRESS STATISTICS
    ===================================== */
    case 'get_progress':
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN completed = 0 AND due_date < CURDATE() THEN 1 ELSE 0 END) as overdue,
                    SUM(CASE WHEN completed = 0 AND due_date >= CURDATE() AND due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as ongoing,
                    SUM(CASE WHEN completed = 0 AND due_date > DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as incoming
                FROM tasks WHERE user_id=?";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stats = $result->fetch_assoc();
        
        $total = (int)$stats['total'];
        $completed = (int)$stats['completed'];
        $overall_progress = $total > 0 ? round(($completed / $total) * 100) : 0;
        
        echo json_encode([
            'status' => 'success',
            'statistics' => [
                'total' => $total,
                'completed' => $completed,
                'overdue' => (int)$stats['overdue'],
                'ongoing' => (int)$stats['ongoing'],
                'incoming' => (int)$stats['incoming'],
                'overall_progress' => $overall_progress
            ]
        ]);
        break;

    /* =====================================
       BULK UPDATE (Mark multiple as complete)
    ===================================== */
    case 'bulk_complete':
        $task_ids = $data['task_ids'] ?? [];
        
        if (empty($task_ids)) {
            echo json_encode(['status' => 'error', 'message' => 'No tasks selected']);
            break;
        }
        
        $placeholders = implode(',', array_fill(0, count($task_ids), '?'));
        $sql = "UPDATE tasks SET completed=1 WHERE id IN ($placeholders) AND user_id=?";
        $stmt = $conn->prepare($sql);
        
        $types = str_repeat('i', count($task_ids)) . 'i';
        $params = array_merge($task_ids, [$user_id]);
        $stmt->bind_param($types, ...$params);
        
        if($stmt->execute()) {
            echo json_encode([
                'status' => 'success', 
                'message' => count($task_ids) . ' tasks marked as complete!'
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}
?>
