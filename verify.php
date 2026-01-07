<!-- ============================================
     VERIFY CODE PAGE
     Author      : Noraziela Binti Jepsin
     Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
     Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
     Description : Interface for users to enter
                   the 6-digit verification code
                   sent to their email during the
                   password reset process, with
                   navbar integration.
     ============================================ -->

<?php
session_start();
include "db.php";

// Check if user came from forgot password page
if (!isset($_SESSION['reset_email']) || !isset($_SESSION['reset_token'])) {
    header("Location: forgetpassword.php");
    exit();
}

// Check if security questions were verified (if user has them)
if (!isset($_SESSION['security_verified'])) {
    header("Location: verify-security-questions.php");
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = trim($_POST['code']);
    $token = $_SESSION['reset_token'];
    
    if (empty($code)) {
        $error = "Please enter the verification code!";
    } elseif (strlen($code) !== 6 || !ctype_digit($code)) {
        $error = "Please enter a valid 6-digit code!";
    } else {
        // Verify code and token (fixed timezone issue)
        $stmt = $conn->prepare("SELECT user_id, expires_at FROM password_resets WHERE token = ? AND code = ?");
        $stmt->bind_param("ss", $token, $code);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            
            // Check if expired using PHP time comparison
            $expiryTime = strtotime($row['expires_at']);
            $currentTime = time();
            
            if ($currentTime < $expiryTime) {
                // Code is valid and not expired
                header("Location: resetpassword.php?token=" . urlencode($token));
                exit();
            } else {
                $error = "Verification code has expired!";
            }
        } else {
            $error = "Invalid verification code!";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Code - Pawfessor</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div id="navbar"></div>
    
    <div class="page-content">
        <div class="container">
            <h2>Verify Code</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                Enter the 6-digit code displayed on the previous page
            </p>
            
            <?php if ($error): ?>
                <div style="background: #fee; border: 1px solid #fcc; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #c33; margin: 0; font-size: 14px;">⚠️ <?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>
            
            <form action="verify.php" method="post">
                <label for="code">Verification Code</label>
                <input type="text" 
                       name="code" 
                       id="code" 
                       placeholder="Enter 6-digit code" 
                       maxlength="6" 
                       pattern="[0-9]{6}"
                       style="text-align: center; font-size: 24px; letter-spacing: 8px; font-family: 'Courier New', monospace;"
                       required 
                       autofocus>
                
                <button type="submit" class="create-btn">Verify Code</button>
            </form>
            
            <p class="login-text">
                Didn't get the code? <a href="forgetpassword.php">Try again</a>
            </p>
            
            <p class="login-text">
                <a href="login.php">Back to Login</a>
            </p>
        </div>
    </div>
    
    <script>
        // Only allow numbers
        document.getElementById('code').addEventListener('keypress', function(e) {
            if (e.key < '0' || e.key > '9') {
                e.preventDefault();
            }
        });
        
        // Auto-submit when 6 digits entered
        document.getElementById('code').addEventListener('input', function() {
            if (this.value.length === 6) {
                this.form.submit();
            }
        });
        
        fetch("navbar.html")
            .then(res => res.text())
            .then(html => document.getElementById("navbar").innerHTML = html)
            .catch(err => console.error("Navbar load failed:", err));
    </script>
</body>
</html>