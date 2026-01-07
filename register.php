<?php
/* ============================================
   REGISTRATION HANDLER
   Author: Noraziela Binti Jepsin
   Tested by: Siti Norlie Yana
   Description: Processes user registration and
                stores data in MySQL database
   ============================================ */

session_start();
include "db.php";

// Redirect logged-in users
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard-user.php");
    exit();
}

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname']);
    $email    = trim(strtolower($_POST['email']));
    $password = trim($_POST['password']);
    
    // Validation
    if (empty($fullname) || empty($email) || empty($password)) {
        $errors[] = "All fields are required!";
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address!";
    }
    
    // Validate password strength
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters long!";
    }
    
    if (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $errors[] = "Password must contain both letters and numbers!";
    }
    
    // Check if no errors so far
    if (empty($errors)) {
        // Check if email already exists
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $errors[] = "This email is already registered! Please <a href='login.php'>login</a>.";
        } else {
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert into database
            $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $fullname, $email, $passwordHash);
            
            if ($stmt->execute()) {
                $success = "Registration successful! You can now <a href='login.php'>login</a>.";
            } else {
                $errors[] = "Registration failed. Please try again.";
                error_log("Registration error: " . $stmt->error);
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
    <title>Register - Pawfessor</title>
    <link rel="stylesheet" href="css/signup.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <div id="navbar"></div>
    
    <div class="signup-wrapper">
        <h1>Create an account</h1>
        
        <!-- Error messages -->
        <?php if (!empty($errors)): ?>
            <div style="background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <?php foreach ($errors as $error): ?>
                    <p style="color: #c33; margin: 5px 0;">⚠️ <?php echo $error; ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <!-- Success message -->
        <?php if ($success): ?>
            <div style="background: #efe; border: 1px solid #cfc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #3c3; margin: 5px 0;">✅ <?php echo $success; ?></p>
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
                       placeholder="Create your password (min. 8 characters)" 
                       required>
                <i class="fa-regular fa-eye" id="togglePassword"></i>
            </div>
            
            <p style="font-size: 12px; color: #666; margin-top: -10px;">
                Password must be at least 8 characters and contain letters and numbers
            </p>
            
            <button type="submit" class="signup-btn">Create an account</button>
        </form>
        
        <p class="login-text">
            Already have an account? <a href="login.php">Login</a>
        </p>
    </div>
    
    <script src="js/signup.js"></script>
</body>
</html>