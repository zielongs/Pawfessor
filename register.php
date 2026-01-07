<?php
session_start();
include "db.php"; // mysqli connection

// Redirect logged-in users away
if (isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname']);
    $email    = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($fullname) || empty($email) || empty($password)) {
        $errors[] = "All fields are required!";
    } else {
        // Check if email already exists
        $check = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows > 0) {
            $errors[] = "This email is already registered!";
        } else {
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            // Insert into database
            $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $fullname, $email, $passwordHash);

            if ($stmt->execute()) {
                // Success
                $success = "Registration successful! You can now <a href='login.php'>login</a>.";
            } else {
                $errors[] = "Database error: " . $stmt->error;
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
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
<div class="page-content">
    <div class="container">
        <h2>Register</h2>

        <!-- Show errors -->
        <?php
        if (!empty($errors)) {
            echo '<div style="color:red;">';
            foreach ($errors as $err) echo "<p>$err</p>";
            echo '</div>';
        }

        if ($success) {
            echo '<div style="color:green;">' . $success . '</div>';
        }
        ?>

        <form action="register.php" method="post">
            <label for="fullname">Full Name</label>
            <input type="text" name="fullname" placeholder="Enter your full name" required>

            <label for="email">Email Address</label>
            <input type="email" name="email" placeholder="Enter your email" required>

            <label for="password">Password</label>
            <input type="password" name="password" placeholder="Enter your password" required>

            <button type="submit" class="create-btn">Register</button>
        </form>

        <p>Already have an account? <a href="login.php">Login here</a></p>
    </div>
</div>
</body>
</html>
