<!--==========================================================
Author      : Noraziela Binti Jepsin
Updated By  : Siti Norlie Yana, Nur 'Aainaa Hamraa
Tested By   : Siti Norlie Yana
Date        : 2026-01-08
Description : Signup page for new user registration
              - Connects to register.php for processing
              - Includes form validation
              - Password visibility toggle
              - Redirects to dashboard after successful registration
==========================================================-->

<?php
session_start();
include "db.php";

// Redirect logged-in users
if (isset($_SESSION['user_id'])) {
    if ($_SESSION['role'] === 'admin') {
        header("Location: dashboard-admin.php");
    } else {
        header("Location: dashboard-user.php");
    }
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
            $errors[] = "This email is already registered!";
        } else {
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert into database
            $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $fullname, $email, $passwordHash);
            
            if ($stmt->execute()) {
                // Auto-login after registration
                $user_id = $stmt->insert_id;
                $_SESSION['user_id'] = $user_id;
                $_SESSION['fullname'] = $fullname;
                $_SESSION['email'] = $email;
                $_SESSION['role'] = 'user';
                
                // Redirect to dashboard
                header("Location: dashboard-user.php");
                exit();
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
    <title>Sign Up - Pawfessor</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS -->
    <link rel="stylesheet" href="css/signup.css">
    <link rel="stylesheet" href="css/navbar.css">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

<!-- NAVBAR -->
<header class="navbar">
    <!-- Left: Logo -->
    <div class="logo">
        <a href="index.php">
            <img src="images/Pawfessor_Logo.png" width="50" height="50" alt="Pawfessor Logo">
        </a>
        <span>Pawfessor</span>
    </div>

    <!-- Right: Navigation -->
    <nav class="nav-links">
        <a href="pricing.html">Pricing</a>
        <a href="help.html">Help</a>
        <a href="login.php" class="login-btn">Login</a>
    </nav>
</header>

<!-- SIGNUP FORM -->
<div class="signup-wrapper">
    <h1>Create an account</h1>
    
    <!-- Error messages -->
    <?php if (!empty($errors)): ?>
        <div class="alert alert-error">
            <?php foreach ($errors as $error): ?>
                <p>⚠️ <?php echo htmlspecialchars($error); ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    
    <!-- Success message -->
    <?php if ($success): ?>
        <div class="alert alert-success">
            <p>✅ <?php echo htmlspecialchars($success); ?></p>
        </div>
    <?php endif; ?>
    
    <form action="signup.php" method="post" class="signup-form">
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
        
        <p class="password-hint">
            Password must be at least 8 characters and contain letters and numbers
        </p>
        
        <button type="submit" class="signup-btn">Create an account</button>
    </form>
    
    <p class="login-text">
        Already have an account? <a href="login.php">Login</a>
    </p>
</div>

<script>
// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function() {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}
</script>

</body>
</html>