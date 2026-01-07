<!--==========================================================
Author      : Md Habibullah Habib
Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
Date        : 2026-01-02
Description : Home page of Pawfessor web app.
              - Displays hero section with mascot, tagline, and call-to-action button
              - Loads navbar from external component
              - Footer includes company info, help, FAQ, social links, and payment icons
              - Links CSS and JS files for styling and functionality
Notes       : - Font Awesome used for social icons
              - Hero CTA button can be linked to signup page
==========================================================-->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Pawfessor</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS -->
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/navbar.css">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>

    <!-- Inline Navbar -->
    <header class="navbar">
        <!-- Left: Logo -->
        <div class="logo">
            <a href="index.html">
                <img src="images/Pawfessor_Logo.png" width="50" height="50" alt="Pawfessor Logo">
            </a>
            <span>Pawfessor</span>
        </div>

        <!-- Right: Navigation links -->
        <nav class="nav-links">
            <a href="pricing.html">Pricing</a>
            <a href="help.html">Help</a>
            <a href="login.html" class="login-btn">Login</a>
            <a href="signup.html" class="cta-btn">Get Pawfessor Free</a>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <img src="images/hero_icon.png" alt="Pawfessor Mascot" class="mascot">
        <h1>Plan smarter.<br>Study better.</h1>
        <p>Pawfessor is your friendly guide<br>to better productivity.</p>

        <!-- CTA button goes to signup page -->
        <a href="signup.html" class="btn big">Get Pawfessor Free</a>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-grid">
            <div class="footer-logo">
                <h2>Pawfessor</h2>
                <div class="socials">
                    <i class="fab fa-twitter"></i>
                    <i class="fab fa-facebook"></i>
                    <i class="fab fa-instagram"></i>
                    <i class="fab fa-github"></i>
                </div>
            </div>

            <div>
                <h4>Company</h4>
                <p>About</p>
                <p>Features</p>
                <p>Works</p>
                <p>Career</p>
            </div>

            <div>
                <h4>Help</h4>
                <p>Customer Support</p>
                <p>Delivery Details</p>
                <p>Terms & Conditions</p>
                <p>Privacy Policy</p>
            </div>

            <div>
                <h4>FAQ</h4>
                <p>Account</p>
                <p>Manage Deliveries</p>
                <p>Orders</p>
                <p>Payments</p>
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
