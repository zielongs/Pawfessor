<?php

/* ============================================
    SECURITY QUESTIONS SETUP PAGE - PHP
   Author: Noraziela Binti Jepsin
   Updated by: Noraziela Binti Jepsin
   Description: Allows users to set or update
                their security questions for
                account recovery
   ============================================ */

session_start();
include "db.php";

// Protect page - redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$success = '';
$errors = [];

// Check if user already has security questions
$stmt = $conn->prepare("SELECT security_question_1, security_question_2 FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$hasQuestions = !empty($user['security_question_1']) && !empty($user['security_question_2']);

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $question1 = trim($_POST['question1']);
    $answer1 = trim(strtolower($_POST['answer1'])); // Lowercase for case-insensitive comparison
    $question2 = trim($_POST['question2']);
    $answer2 = trim(strtolower($_POST['answer2']));
    
    // Validation
    if (empty($question1) || empty($answer1) || empty($question2) || empty($answer2)) {
        $errors[] = "All fields are required!";
    }
    
    if ($question1 === $question2) {
        $errors[] = "Please choose different questions!";
    }
    
    if (empty($errors)) {
        // Hash answers for security (like passwords)
        $hashedAnswer1 = password_hash($answer1, PASSWORD_DEFAULT);
        $hashedAnswer2 = password_hash($answer2, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("UPDATE users SET security_question_1 = ?, security_answer_1 = ?, security_question_2 = ?, security_answer_2 = ? WHERE user_id = ?");
        $stmt->bind_param("ssssi", $question1, $hashedAnswer1, $question2, $hashedAnswer2, $user_id);
        
        if ($stmt->execute()) {
            $success = "Security questions saved successfully!";
            $hasQuestions = true;
        } else {
            $errors[] = "Failed to save security questions.";
        }
    }
}

// Pre-defined questions
$availableQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
    "What was your childhood nickname?",
    "What is your favorite food?",
    "What was the model of your first car?",
    "What is your favorite movie?",
    "What street did you grow up on?"
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Questions - Pawfessor</title>
    <link rel="stylesheet" href="css/login.css">
    <style>
        .container { max-width: 500px; }
        select, input[type="text"] {
            width: 100%;
            padding: 12px;
            margin: 8px 0 15px 0;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        }
        .info-box {
            background: #e0f2fe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 14px;
        }
        .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 14px;
        }
        label {
            font-weight: 600;
            color: #333;
            display: block;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div id="navbar"></div>
    
    <div class="page-content">
        <div class="container">
            <h2>🔐 Security Questions</h2>
            
            <?php if ($hasQuestions): ?>
                <div class="info-box">
                    ✅ <strong>Security questions are set!</strong><br>
                    You can update them below if needed.
                </div>
            <?php else: ?>
                <div class="warning-box">
                    ⚠️ <strong>Security questions not set!</strong><br>
                    Please set up security questions to enhance your account security.
                </div>
            <?php endif; ?>
            
            <?php if (!empty($errors)): ?>
                <div style="background: #fee; border: 1px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <?php foreach ($errors as $error): ?>
                        <p style="color: #c33; margin: 5px 0;">⚠️ <?php echo htmlspecialchars($error); ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
            <?php if ($success): ?>
                <div style="background: #efe; border: 1px solid #cfc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #3c3; margin: 0;">✅ <?php echo htmlspecialchars($success); ?></p>
                </div>
            <?php endif; ?>
            
            <form method="POST">
                <label>Security Question 1:</label>
                <select name="question1" required>
                    <option value="">-- Select a question --</option>
                    <?php foreach ($availableQuestions as $q): ?>
                        <option value="<?php echo htmlspecialchars($q); ?>"
                                <?php echo ($user['security_question_1'] ?? '') === $q ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($q); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                
                <label>Your Answer:</label>
                <input type="text" 
                       name="answer1" 
                       placeholder="Enter your answer" 
                       required>
                
                <label style="margin-top: 25px;">Security Question 2:</label>
                <select name="question2" required>
                    <option value="">-- Select a question --</option>
                    <?php foreach ($availableQuestions as $q): ?>
                        <option value="<?php echo htmlspecialchars($q); ?>"
                                <?php echo ($user['security_question_2'] ?? '') === $q ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($q); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                
                <label>Your Answer:</label>
                <input type="text" 
                       name="answer2" 
                       placeholder="Enter your answer" 
                       required>
                
                <div class="info-box" style="margin-top: 20px;">
                    <strong>💡 Tips:</strong><br>
                    • Choose questions only you know the answer to<br>
                    • Don't share your answers with anyone<br>
                    • Remember your answers (case doesn't matter)<br>
                    • These will be used for account recovery
                </div>
                
                <button type="submit" class="create-btn">
                    <?php echo $hasQuestions ? 'Update' : 'Save'; ?> Security Questions
                </button>
            </form>
            
            <p class="login-text">
                <a href="dashboard-user.php">← Back to Dashboard</a>
            </p>
        </div>
    </div>
    
    <script>
        fetch("navbar.html")
            .then(res => res.text())
            .then(html => document.getElementById("navbar").innerHTML = html)
            .catch(err => console.error("Navbar load failed:", err));
    </script>
</body>
</html>
