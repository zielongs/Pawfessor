<!-- ===================================================
     RECEIPT PAGE
     ---------------------------------------------------
     Author: Nur 'Aainaa Hamraa binti Hamka
     Date: 01 January 2026
    Tested by: Siti Norlie Yana
    Updated by : Siti Norlie Yana
     Description:
     Displays successful payment receipt
=================================================== -->

<?php
session_start();
include "db.php";

/* ===============================
   SECURITY CHECK
=============================== */
if (!isset($_SESSION['user_id']) || !isset($_SESSION['last_transaction_id'])) {
    header("Location: index.php");
    exit();
}

$transaction_id = $_SESSION['last_transaction_id'];

/* ===============================
   GET TRANSACTION DATA
=============================== */
$stmt = $conn->prepare("
    SELECT product, payment_method, amount, status, created_at
    FROM transactions
    WHERE id = ?
");
$stmt->bind_param("i", $transaction_id);
$stmt->execute();
$result = $stmt->get_result();
$transaction = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pawfessor | Receipt</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- CSS (UNCHANGED) -->
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/receipt.css">

  <!-- PRINT ONLY -->
  <style>
    @media print {
      .receipt-header,
      .share-btn,
      .back-btn {
        display: none;
      }
      body {
        background: white;
      }
    }
  </style>
</head>

<body>

<!-- HEADER (UNCHANGED UI) -->
<header class="receipt-header">
  <div class="receipt-logo">
    <img src="images/Pawfessor_Logo.png" alt="Pawfessor">
    <span>PAWFESSOR</span>
  </div>

  <nav class="receipt-nav">
    <a href="dashboard-user.php">Dashboard</a>
    <a href="pricing.php">Pricing</a>
    <a href="transaction-history.php">Transaction History</a>

    <div class="header-icons">
      <img src="images/h_add_to_cart.png">
      <img src="images/h_profiles.png">
    </div>
  </nav>
</header>

<!-- MAIN -->
<main class="receipt-main">

  <div class="receipt-box" id="receipt-content">

    <div class="success-icon">✓</div>

    <h2>Payment Success!</h2>
    <p class="success-text">Your payment was successful.</p>

    <div class="receipt-card">

      <div class="receipt-row">
        <span>Items</span>
        <span><?= htmlspecialchars($transaction['product']) ?></span>
      </div>

      <div class="receipt-row">
        <span>Amount</span>
        <span>RM<?= number_format($transaction['amount'], 2) ?></span>
      </div>

      <div class="receipt-row">
        <span>Status</span>
        <span class="success-badge">
          <?= ucfirst($transaction['status']) ?>
        </span>
      </div>

      <div class="receipt-row">
        <span>Payment Method</span>
        <span><?= htmlspecialchars($transaction['payment_method']) ?></span>
      </div>

      <div class="receipt-row">
        <span>Date</span>
        <span><?= $transaction['created_at'] ?></span>
      </div>

    </div>

    <!-- PRINT / DOWNLOAD -->
    <button class="share-btn" onclick="window.print()">
      Print / Download Receipt
    </button>

    <!-- BACK TO DASHBOARD -->
    <a href="dashboard-user.php" class="back-btn">
      Back to Dashboard
    </a>

  </div>

</main>

</body>
</html>

