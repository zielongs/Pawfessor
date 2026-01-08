<?php

/* ============================================
   VERIFY SECURITY QUESTIONS PAGE - PHP
   Author: Noraziela Binti Jepsin
   Updated by: Noraziela Binti Jepsin
   Description: Verifies user's security questions for account recovery
   ============================================ */

session_start();
include "db.php";

// Redirect if no reset email in session
if (!isset($_SESSION['reset_email'])) {
    header("Location: forgetpassword.php");
    exit();
}

$email = $_SESSION['reset_email'];
$error = '';

// Get user's security questions
$stmt = $conn->prepare("SELECT user_id, security_question_1, security_answer_1, security_question_2, security_answer_2 FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    header("Location: forgetpassword.php");
    exit();
}

$user = $result->fetch_assoc();

// Check if user has security questions set
if (empty($user['security_question_1']) || empty($user['security_question_2'])) {
    // No security questions set, skip this step
    $_SESSION['security_verified'] = true;
    header("Location: verify.php");
    exit();
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $answer1 = trim(strtolower($_POST['answer1']));
    $answer2 = trim(strtolower($_POST['answer2']));
    
    // Verify answers
    $answer1Correct = password_verify($answer1, $user['security_answer_1']);
    $answer2Correct = password_verify($answer2, $user['security_answer_2']);
    
    if ($answer1Correct && $answer2Correct) {
        // Both answers correct
        $_SESSION['security_verified'] = true;
        header("Location: verify.php");
        exit();
    } else {
        $error = "One or more answers are incorrect!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Identity - Pawfessor</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div id="navbar"></div>
    
    <div class="page-content">
        <div class="container">
            <h2>🔐 Verify Your Identity</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                Answer your security questions to continue
            </p>
            
            <?php if ($error): ?>
                <div style="background: #fee; border: 1px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #c33; margin: 0; font-size: 14px;">⚠️ <?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>
            
            <form method="POST">
                <label><?php echo htmlspecialchars($user['security_question_1']); ?></label>
                <input type="text" 
                       name="answer1" 
                       placeholder="Your answer" 
                       required 
                       autofocus>
                
                <label style="margin-top: 15px;"><?php echo htmlspecialchars($user['security_question_2']); ?></label>
                <input type="text" 
                       name="answer2" 
                       placeholder="Your answer" 
                       required>
                
                <button type="submit" class="create-btn">Verify & Continue</button>
            </form>
            
            <p class="login-text">
                <a href="forgetpassword.php">← Back</a>
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
