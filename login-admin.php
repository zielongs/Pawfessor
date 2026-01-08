<?php
session_start();
require_once __DIR__ . '/db.php';

if (!isset($conn) || !($conn instanceof mysqli)) {
    die('Database connection failed.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($email === '' || $password === '') {
        $error = "Email and password required.";
    } else {

        $sql = "
            SELECT admin_id, email, password_hash, status
            FROM admin_users
            WHERE email = ?
            LIMIT 1
        ";

        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            error_log("Admin login prepare failed: " . $conn->error);
            $error = "System error. Try again later.";
        } else {

            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result && $result->num_rows === 1) {

                $admin = $result->fetch_assoc();

                if ($admin['status'] !== 'active') {
                    $error = "Admin account inactive.";
                } elseif (!password_verify($password, $admin['password_hash'])) {
                    $error = "Invalid email or password.";
                } else {

                    // ✅ ADMIN LOGIN SUCCESS
                    $_SESSION['admin_id']    = $admin['admin_id'];
                    $_SESSION['admin_email'] = $admin['email'];
                    $_SESSION['role']        = 'admin';

                    $stmt->close();
                    header("Location: dashboard-admin.html");
                    exit;
                }

            } else {
                $error = "Invalid email or password.";
            }

            $stmt->close();
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Login</title>
</head>
<body>

<h2>Admin Login</h2>

<?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>

<form method="post">
    <label>Email</label><br>
    <input type="email" name="email" required><br><br>

    <label>Password</label><br>
    <input type="password" name="password" required><br><br>

    <button type="submit">Login as Admin</button>
</form>

</body>
</html>
