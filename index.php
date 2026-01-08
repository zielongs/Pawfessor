<!--==========================================================
Author      : Noraziela Binti Jepsin
Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
Date        : 2026-01-08
Description : Home page of Pawfessor web app.
              - Displays hero section with mascot, tagline, and CTA button
              - Loads navbar from external component
              - Footer includes company info, help, FAQ, social links
              - Auto-redirects logged-in users to dashboard
==========================================================-->

<?php
session_start();

// If user is already logged in, redirect to dashboard
if (isset($_SESSION['user_id'])) {
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
        header("Location: dashboard-admin.php");
    } else {
        header("Location: dashboard-user.php");
    }
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Pawfessor - Plan smarter. Study better.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Pawfessor is your friendly guide to better productivity. Plan smarter and study better with our tools.">

    <!-- CSS -->
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/navbar.css">

    <!-- Icons -->
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
        <a href="register.php" class="cta-btn">Get Pawfessor Free</a>
    </nav>
</header>

<!-- HERO -->
<section class="hero">
    <img src="images/hero_icon.png" alt="Pawfessor Mascot" class="mascot">

    <h1>Plan smarter.<br>Study better.</h1>
    <p>Pawfessor is your friendly guide<br>to better productivity.</p>

    <a href="register.php" class="btn big">Get Pawfessor Free</a>
</section>

<!-- FOOTER -->
<footer>
    <div class="footer-grid">

        <div class="footer-logo">
            <h2>Pawfessor</h2>
            <div class="socials">
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
            </div>
        </div>

        <div>
            <h4>Company</h4>
            <p><a href="#">About</a></p>
            <p><a href="#">Features</a></p>
            <p><a href="#">Works</a></p>
            <p><a href="#">Career</a></p>
        </div>

        <div>
            <h4>Help</h4>
            <p><a href="#">Customer Support</a></p>
            <p><a href="#">Delivery Details</a></p>
            <p><a href="#">Terms & Conditions</a></p>
            <p><a href="#">Privacy Policy</a></p>
        </div>

        <div>
            <h4>FAQ</h4>
            <p><a href="#">Account</a></p>
            <p><a href="#">Manage Deliveries</a></p>
            <p><a href="#">Orders</a></p>
            <p><a href="#">Payments</a></p>
        </div>

    </div>

    <div class="footer-bottom">
        <p>© 2020–2025 Pawfessor. All Rights Reserved.</p>
        <div class="payments">
            <span>VISA</span>
            <span>MasterCard</span>
            <span>PayPal</span>
            <span>Apple Pay</span>
            <span>GPay</span>
        </div>
    </div>
</footer>

</body>
</html>
