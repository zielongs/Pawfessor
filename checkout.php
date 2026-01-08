<!-- ===================================================
     CHECKOUT PAGE
     ---------------------------------------------------
     Author: Nur 'Aainaa Hamraa binti Hamka
     Date: 01 January 2026
     Tested by: Siti Norlie Yana
     Updated by: Siti Norlie Yana
     Description:
     Checkout page for Pawfessor subscription.
=================================================== -->

<?php
session_start();
include "db.php";

/* ===============================
   SECURITY CHECK
=============================== */
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

/* ===============================
   HANDLE PAYMENT
=============================== */
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $user_id = $_SESSION['user_id'];
    $product = trim($_POST['product']);
    $payment_method = trim($_POST['payment_method']);
    $amount = floatval($_POST['amount']);

    if (empty($product) || empty($payment_method) || $amount <= 0) {
        die("Invalid checkout data");
    }

    $stmt = $conn->prepare("
        INSERT INTO transactions 
        (user_id, product, payment_method, amount, status)
        VALUES (?, ?, ?, ?, 'successful')
    ");

    $stmt->bind_param("issd", $user_id, $product, $payment_method, $amount);
    $stmt->execute();

    $_SESSION['last_transaction_id'] = $conn->insert_id;

    header("Location: receipt.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pawfessor | Checkout</title>

  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/checkout.css">
</head>

<body>

<!-- ================= HEADER ================= -->
<header class="checkout-header">
  <div class="checkout-logo">
    <img src="images/Pawfessor_Logo.png" alt="Logo">
    <span>PAWFESSOR</span>
  </div>

  <nav class="checkout-nav">
    <a href="index.php">Home</a>
    <a href="pricing.php">Pricing</a>
    <a href="transaction-history.php">Transaction History</a>
  </nav>
</header>

<!-- ================= MAIN ================= -->
<main class="checkout-main">

  <!-- LEFT: PAYMENT METHODS -->
  <section class="checkout-left">
    <h2>Payment Method</h2>

    <div class="payment-box">

      <div class="payment-item" data-method="Online Banking">
        Online Banking
      </div>

      <div class="payment-item" data-method="Google Pay">
        Google Pay
      </div>

      <div class="payment-card" data-method="Debit Card">
        <img src="images/mastercard.png">
        <span>**** **** **** 4578</span>
      </div>

      <div class="payment-card" data-method="Debit Card">
        <img src="images/visa.png">
        <span>**** **** **** 4521</span>
      </div>

    </div>
  </section>

  <!-- RIGHT: ORDER SUMMARY -->
  <section class="checkout-summary">
    <div class="summary-box">

      <div class="summary-header">
        Order Summary
      </div>

      <!-- ITEMS FROM CART -->
      <div id="order-list"></div>

      <hr>

      <div class="summary-row total">
        <span>Total</span>
        <span id="total-price">RM0.00</span>
      </div>

      <!-- PAYMENT FORM -->
      <form method="POST" action="checkout.php">
        <input type="hidden" name="product" id="hidden-product">
        <input type="hidden" name="payment_method" id="hidden-payment">
        <input type="hidden" name="amount" id="hidden-amount">

        <button type="submit" class="pay-btn">
          Pay Now
        </button>
      </form>

    </div>
  </section>

</main>

<script src="js/checkout.js"></script>
</body>
</html>

