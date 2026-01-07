<!-- ===================================================
     PRICING PLAN PAGE
     ---------------------------------------------------
    Author: Nur 'Aainaa Hamraa binti Hamka
    Date: 01 January 2026
    Tested by: Siti Norlie Yana
    Updated by: Siti Norlie Yana
    Description:
       - This page displays the available pricing plans 
         for the Pawfessor system.
       - Check login status
       - Store selected plan in session
       - Redirect user accordingly
=================================================== -->

<?php
session_start(); 

// Handle plan selection
if (isset($_GET['plan'])) {

  // If user not logged in → signup first
  if (!isset($_SESSION['user_id'])) {
    header("Location: signup.php");
    exit();
  }

  // Logged in → save selected plan to session (temporary)
  $_SESSION['cart']['plan'] = $_GET['plan'];

  // Redirect to add-to-cart page
  header("Location: carts.php");
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pawfessor | Pricing</title>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- CSS -->
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/pricing_plan.css">
</head>

<body class="pricing-page">

<!-- ================= HEADER ================= -->
<header class="pricing-header">
  <div class="pricing-logo">
    <img src="images/Pawfessor_Logo.png" alt="Paw Logo">
    <span>PAWFESSOR</span>
  </div>

  <nav class="pricing-nav">
    <a href="index.php">Home</a>
    <a href="pricing.php" class="active">Pricing</a>
    <a href="#">Help</a>
    <a href="login.php">Log In</a>
    <a href="signup.php" class="cta">Get Pawfessor Free</a>
  </nav>
</header>

<!-- ================= MAIN CONTENT ================= -->
<main class="pricing-main">

  <h1>Choose Your Plan</h1>
  <p class="pricing-subtitle">
    Upgrade to unlock more productivity features
  </p>

  <div class="pricing-container">

    <!-- FREE PLAN -->
    <div class="plan-card highlight">

      <div class="plan-top">
        <div class="plan-text">
          <h2>FREE</h2>
          <div class="price-row">
            <span class="price">RM 0</span>
            <span class="per">/month</span>
          </div>
        </div>

        <img src="images/Plans/free.png" class="plan-icon">
      </div>

      <a href="signup.php" class="btn">
        SIGN UP FOR FREE
      </a>
      
      <ul>
        <li>Simple Reminder</li>
        <li>Limited Task</li>
        <li>Basic Analytics</li>
      </ul>

    </div>

    <!-- STANDARD PLAN -->
    <div class="plan-card">

      <div class="plan-top">
        <div class="plan-text">
          <h2>STANDARD</h2>
          <div class="price-row">
            <span class="price">RM 5.99</span>
            <span class="per">/month</span>
          </div>
        </div>

        <img src="images/Plans/standard.png" class="plan-icon">
      </div>

      <a href="pricing.php?plan=STANDARD" class="btn">
        UPGRADE
      </a>

      <ul>
        <li>Unlimited Tasks</li>
        <li>Smart Reminders</li>
        <li>Advanced Analytics</li>
      </ul>

    </div>

    <!-- PREMIUM PLAN -->
    <div class="plan-card">

      <div class="plan-top">
        <div class="plan-text">
          <h2>PREMIUM</h2>
          <div class="price-row">
            <span class="price">RM 7.99</span>
            <span class="per">/month</span>
          </div>
        </div>

        <img src="images/Plans/premium.png" class="plan-icon">
      </div>
      
      <a href="pricing.php?plan=PREMIUM" class="btn">
        UPGRADE
      </a>

      <ul>
        <li>Unlimited Tasks</li>
        <li>Smart Reminders</li>
        <li>Premium Features</li>
      </ul>

    </div>

  </div>
</main>

</body>
</html>





