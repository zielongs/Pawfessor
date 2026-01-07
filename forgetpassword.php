<!-- ============================================
     FORGOT PASSWORD PAGE
     Author      : Md Habibullah Habib
     Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
     Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
     Description : Interface for users to request
                   a password reset by entering
                   their registered email address,
                   with navbar integration.
     ============================================ -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link rel="stylesheet" href="css/auth.css" />
</head>
<body>

    <!-- Navbar -->
    <div id="navbar"></div>

    <div class="page-content">
        <div class="container">
            <h2>Forgot Password</h2>
            <p>Please enter your email to reset your password</p>

            <label>Your Email</label>
            <input type="email" placeholder="contact@dscodetech.com" />

            <button onclick="goToVerify()">Reset Password</button>
        </div>
    </div>

    <script src="js/forgetpassword.js"></script>
</body>
</html>
