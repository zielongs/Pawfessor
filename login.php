<!-- ============================================
     LOGIN PAGE
     Author      : Noraziela Binti Jepsin
     Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
     Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
     Description : Login interface for users to
                   authenticate using email and
                   password, with navbar integration
                   and social media icons.
     ============================================ -->

<?php
/* ============================================
   LOGIN HANDLER
   Description: Processes user login and
                validates credentials from database
   ============================================ */

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

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim(strtolower($_POST['email']));
    $password = trim($_POST['password']);
    
    // Validation
    if (empty($email) || empty($password)) {
        $error = "Please enter both email and password!";
    } else {
        // Get user from database
        $stmt = $conn->prepare("SELECT user_id, fullname, email, password, role FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Login successful - store session
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['fullname'] = $user['fullname'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['role'] = $user['role'];
                
                // Redirect based on role
                if ($user['role'] === 'admin') {
                    header("Location: dashboard-admin.php");
                } else {
                    header("Location: dashboard-user.php");
                }
                exit();
            } else {
                $error = "Incorrect password!";
            }
        } else {
            $error = "Email not registered! Please <a href='register.php' style='color: #5a5aff;'>sign up</a>.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Pawfessor</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <div id="navbar"></div>
    
    <div class="page-content">
        <div class="container">
            <h2>LOGIN</h2>
            
            <?php if ($error): ?>
                <div style="background: #fee; border: 1px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #c33; margin: 0; font-size: 14px;">⚠️ <?php echo $error; ?></p>
                </div>
            <?php endif; ?>
            
            <form action="login.php" method="post" id="loginForm">
                <label for="email">Email Address</label>
                <input type="email" name="email" id="email" 
                       placeholder="Enter your email" 
                       value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                       required>
                
                <label for="password">Password</label>
                <div class="password-box">
                    <input type="password" name="password" id="password" 
                           placeholder="Enter your password" required>
                    <i class="fa-regular fa-eye" id="togglePassword"></i>
                </div>
                
                <button type="submit" class="create-btn">LOGIN</button>
            </form>
            
            <p class="login-text">
                Forgot your password? <a href="forgetpassword.php">Click here</a>
            </p>
            
            <p class="login-text">
                Don't have an account? <a href="register.php">Sign up</a>
            </p>
            
            <div class="socials">
                <i class="fab fa-facebook-f"></i>
                <i class="fab fa-twitter"></i>
                <i class="fab fa-instagram"></i>
                <i class="fab fa-linkedin-in"></i>
            </div>
        </div>
    </div>
    
    <script>
        // Toggle password visibility
        const togglePassword = document.getElementById("togglePassword");
        const passwordInput = document.getElementById("password");
        
        togglePassword.addEventListener("click", function() {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    </script>
</body>
</html>