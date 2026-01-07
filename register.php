<?php
// Show all errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "db.php"; // mysqli connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $fullname = trim($_POST['fullname']);
    $email    = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($fullname) || empty($email) || empty($password)) {
        echo "All fields are required!";
        exit();
    }

    // Check if email already exists
    $check = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        echo "This email is already registered!";
        exit();
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $fullname, $email, $passwordHash);

    if ($stmt->execute()) {
        // Redirect to login page after successful signup
        header("Location: login.php?signup=success");
        exit();
    } else {
        echo "Error inserting into database: " . $stmt->error;
    }

} else {
    echo "Invalid request method.";
}
?>
