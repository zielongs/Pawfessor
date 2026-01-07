<!-- ============================================
     LOGIN PAGE
     Author      : Md Habibullah Habib
     Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
     Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
     Description : Login interface for users to
                   authenticate using email and
                   password, with navbar integration
                   and social media icons.
     ============================================ -->

<?php
session_start();
include "db.php"; // mysqli connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Get user data
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            // Login success – store user info in session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['fullname'] = $user['fullname'];
            $_SESSION['email'] = $user['email'];

            header("Location: dashboard-user.php");
            exit();
        } else {
            $error = "Incorrect password!";
        }
    } else {
        $error = "Email not registered!";
    }

} 
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
<div id="navbar"></div>

<div class="page-content">
    <div class="container">
        <h2>LOGIN</h2>

        <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>

        <form action="login.php" method="post">
            <label for="email">Email Address</label>
            <input type="email" name="email" placeholder="Enter your email" required>

            <label for="password">Password</label>
            <div class="password-box">
                <input type="password" name="password" placeholder="Enter your password" required>
                <i id="togglePassword">&#128065;</i>
            </div>

            <button type="submit" class="create-btn">LOGIN</button>
        </form>

        <p class="login-text">
            Forgot your password? <a href="forgetpassword.html">Click here</a>
        </p>

        <div class="socials">
            <i class="fab fa-facebook-f"></i>
            <i class="fab fa-twitter"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-linkedin-in"></i>
        </div>
    </div>
</div>

<script src="navbar.js"></script>
<script src="js/login.js"></script>
</body>
</html>

