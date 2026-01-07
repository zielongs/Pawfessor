<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create an account</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS -->
    <link rel="stylesheet" href="css/signup.css">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

    <div class="page-content">
        <div class="container">
            <h2>Create an account</h2>

            <!-- Signup Form -->
            <form action="register.php" method="post">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="Enter your email address" required>

                <label>Full Name</label>
                <input type="text" name="fullname" placeholder="Enter your full name" required>

                <label>Password</label>
                <div class="password-box">
                    <input type="password" name="password" placeholder="Create your password" required>
                    <i class="fa-regular fa-eye" id="togglePassword"></i>
                </div>

                <button type="submit" class="create-btn">Create an account</button>
            </form>

            <p class="login-text">
                Already have an account?
                <a href="login.php">Login</a>
            </p>
        </div>
    </div>

</body>
</html>
