<?php
/* ============================================
   REGISTRATION HANDLER - SECURITY QUESTIONS REQUIRED
   Author: Noraziela Binti Jepsin
   Description: User registration with mandatory
                security questions
   ============================================ */

session_start();
include "db.php";

if (isset($_SESSION['user_id'])) {
    header("Location: dashboard-user.php");
    exit();
}

$errors = [];
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname']);
    $email = trim(strtolower($_POST['email']));
    $password = trim($_POST['password']);
    $question1 = trim($_POST['question1']);
    $answer1 = trim(strtolower($_POST['answer1']));
    $question2 = trim($_POST['question2']);
    $answer2 = trim(strtolower($_POST['answer2']));
    
    // Validation
    if (empty($fullname) || empty($email) || empty($password)) {
        $errors[] = "Name, email and password are required!";
    }
    
    if (empty($question1) || empty($answer1) || empty($question2) || empty($answer2)) {
        $errors[] = "Security questions are required!";
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email address!";
    }
    
    if (strlen($password) < 8 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $errors[] = "Password must be 8+ characters with letters and numbers!";
    }
    
    if ($question1 === $question2) {
        $errors[] = "Please choose different security questions!";
    }
    
    if (empty($errors)) {
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $errors[] = "Email already registered!";
        } else {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $answerHash1 = password_hash($answer1, PASSWORD_DEFAULT);
            $answerHash2 = password_hash($answer2, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO users (fullname, email, password, security_question_1, security_answer_1, security_question_2, security_answer_2) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $fullname, $email, $passwordHash, $question1, $answerHash1, $question2, $answerHash2);
            
            if ($stmt->execute()) {
                $user_id = $stmt->insert_id;
                $_SESSION['user_id'] = $user_id;
                $_SESSION['fullname'] = $fullname;
                $_SESSION['email'] = $email;
                $_SESSION['role'] = 'user';
                
                header("Location: dashboard-user.php");
                exit();
            } else {
                $errors[] = "Registration failed!";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Pawfessor</title>
    <link rel="stylesheet" href="css/signup.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <div class="signup-wrapper">
        <h1>Create an account</h1>
        
        <?php if (!empty($errors)): ?>
            <div style="background: #fee; border: 1px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <?php foreach ($errors as $error): ?>
                    <p style="color: #c33; margin: 5px 0; font-size: 14px;">⚠️ <?php echo htmlspecialchars($error); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <form action="register.php" method="post" class="signup-form">
            <label for="fullname">Full Name</label>
            <input type="text" name="fullname" id="fullname" 
                   placeholder="Enter your full name" 
                   value="<?php echo isset($_POST['fullname']) ? htmlspecialchars($_POST['fullname']) : ''; ?>"
                   required>
            
            <label for="email">Email Address</label>
            <input type="email" name="email" id="email" 
                   placeholder="Enter your email address" 
                   value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                   required>
            
            <label for="password">Password</label>
            <div class="password-field">
                <input type="password" name="password" id="password" 
                       placeholder="Min. 8 characters, letters + numbers" 
                       required>
                <i class="fa-regular fa-eye" id="togglePassword"></i>
            </div>
            
            <!-- Security Questions (REQUIRED) -->
            <div style="margin: 25px 0; padding: 20px; background: #f0f9ff; border-radius: 12px; border: 2px solid #3b82f6;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1e40af; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-shield-alt"></i> Security Questions
                </h3>
                
                <p style="font-size: 12px; color: #1e40af; margin: 0 0 20px 0; background: #dbeafe; padding: 10px; border-radius: 4px;">
                    ⚠️ Required for password recovery - Choose questions only you know!
                </p>
                
                <div style="margin-bottom: 20px;">
                    <label style="font-size: 14px; font-weight: 600; color: #475569; display: block; margin-bottom: 8px;">
                        Question 1: <span style="color: #ef4444;">*</span>
                    </label>
                    <select name="question1" required style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; background: white;">
                        <option value="">-- Select a question --</option>
                        <?php foreach ($availableQuestions as $q): ?>
                            <option value="<?php echo htmlspecialchars($q); ?>"><?php echo htmlspecialchars($q); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <input type="text" name="answer1" placeholder="Your answer" required
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px;">
                </div>
                
                <div>
                    <label style="font-size: 14px; font-weight: 600; color: #475569; display: block; margin-bottom: 8px;">
                        Question 2: <span style="color: #ef4444;">*</span>
                    </label>
                    <select name="question2" required style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; background: white;">
                        <option value="">-- Select a question --</option>
                        <?php foreach ($availableQuestions as $q): ?>
                            <option value="<?php echo htmlspecialchars($q); ?>"><?php echo htmlspecialchars($q); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <input type="text" name="answer2" placeholder="Your answer" required
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px;">
                </div>
            </div>
            
            <button type="submit" class="signup-btn">Create Account</button>
        </form>
        
        <p class="login-text">
            Already have an account? <a href="login.php">Login</a>
        </p>
    </div>
    
    <script>
        const togglePassword = document.getElementById("togglePassword");
        const passwordInput = document.getElementById("password");
        
        if (togglePassword) {
            togglePassword.addEventListener("click", function() {
                passwordInput.type = passwordInput.type === "password" ? "text" : "password";
                this.classList.toggle("fa-eye");
                this.classList.toggle("fa-eye-slash");
            });
        }
    </script>
</body>
</html>
