<?php

/* ============================================
   FORGET PASSWORD HANDLER - PHP
   Author: Noraziela Binti Jepsin
   Description: Handles password reset requests
   ============================================ */

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
include "db.php";

$error = '';
$success = '';

if (!isset($_GET['token'])) {
    header("Location: forgetpassword.php");
    exit();
}

$token = $_GET['token'];
$invalid_token = false;

// Verify token - simplified check without time comparison
$stmt = $conn->prepare("SELECT user_id, expires_at FROM password_resets WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    $error = "Invalid reset link!";
    $invalid_token = true;
} else {
    $row = $result->fetch_assoc();
    $user_id = $row['user_id'];
    
    // Check expiry - use string comparison to avoid timezone issues
    $expiresAt = $row['expires_at'];
    $currentTime = date('Y-m-d H:i:s');
    
    // Debug info
    // echo "Expires: $expiresAt<br>Current: $currentTime<br>";
    
    if ($currentTime >= $expiresAt) {
        $error = "Reset link has expired!";
        $invalid_token = true;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$invalid_token) {
    $password = trim($_POST['password']);
    $confirmPassword = trim($_POST['confirm_password']);
    
    if (empty($password) || empty($confirmPassword)) {
        $error = "Please fill in both password fields!";
    } elseif ($password !== $confirmPassword) {
        $error = "Passwords do not match!";
    } elseif (strlen($password) < 8) {
        $error = "Password must be at least 8 characters long!";
    } elseif (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $error = "Password must contain both letters and numbers!";
    } else {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
        $stmt->bind_param("si", $passwordHash, $user_id);
        
        if ($stmt->execute()) {
            // Delete used token
            $stmt = $conn->prepare("DELETE FROM password_resets WHERE user_id = ?");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            
            // Clear session
            unset($_SESSION['reset_email']);
            unset($_SESSION['reset_token']);
            
            $success = "Password reset successful! Redirecting to login...";
            header("refresh:2;url=login.php");
        } else {
            $error = "Failed to update password. Please try again.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Pawfessor</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <div id="navbar"></div>
    
    <div class="page-content">
        <div class="container">
            <h2>Reset Password</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                Enter your new password below
            </p>
            
            <?php if ($error): ?>
                <div style="background: #fee; border: 1px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #c33; margin: 0; font-size: 14px;">⚠️ <?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>
            
            <?php if ($success): ?>
                <div style="background: #efe; border: 1px solid #cfc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #3c3; margin: 0; font-size: 14px;">✅ <?php echo htmlspecialchars($success); ?></p>
                </div>
            <?php endif; ?>
            
            <?php if (!$invalid_token): ?>
                <form action="resetpassword.php?token=<?php echo urlencode($token); ?>" method="post">
                    <label for="password">New Password</label>
                    <div class="password-box">
                        <input type="password" name="password" id="password" 
                               placeholder="Enter new password" required>
                        <i class="fa-regular fa-eye" id="togglePassword"></i>
                    </div>
                    
                    <label for="confirm_password">Confirm Password</label>
                    <div class="password-box">
                        <input type="password" name="confirm_password" id="confirm_password" 
                               placeholder="Confirm new password" required>
                        <i class="fa-regular fa-eye" id="toggleConfirmPassword"></i>
                    </div>
                    
                    <p style="font-size: 12px; color: #666; margin-top: -10px;">
                        Password must be at least 8 characters with letters and numbers
                    </p>
                    
                    <button type="submit" class="create-btn">Reset Password</button>
                </form>
            <?php else: ?>
                <p class="login-text">
                    <a href="forgetpassword.php">Request new reset link</a>
                </p>
            <?php endif; ?>
            
            <p class="login-text">
                <a href="login.php">Back to Login</a>
            </p>
        </div>
    </div>
    
    <script>
        function setupPasswordToggle(toggleId, inputId) {
            const toggle = document.getElementById(toggleId);
            const input = document.getElementById(inputId);
            
            if (toggle && input) {
                toggle.addEventListener("click", function() {
                    const type = input.type === "password" ? "text" : "password";
                    input.type = type;
                    this.classList.toggle("fa-eye");
                    this.classList.toggle("fa-eye-slash");
                });
            }
        }
        
        setupPasswordToggle("togglePassword", "password");
        setupPasswordToggle("toggleConfirmPassword", "confirm_password");
        
        fetch("navbar.html")
            .then(res => res.text())
            .then(html => document.getElementById("navbar").innerHTML = html)
            .catch(err => console.error("Navbar load failed:", err));
    </script>
</body>
</html>