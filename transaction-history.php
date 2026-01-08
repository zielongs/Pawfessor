<!-- ===================================================
     TRANSACTION HISTORY PAGE
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Date: 01 January 2026
    Tested by:
    Updated by: Nur 'Aainaa Hamraa binti Hamka
    Description:
     This page displays the user's transaction history including:
     - Filter by date and status
     - Download invoices
     - Dynamic transactions table (populated via transaction-history.js)

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

$user_id = $_SESSION['user_id'];

/* ===============================
   FETCH USER TRANSACTIONS
=============================== */
$stmt = $conn->prepare("
    SELECT id, product, payment_method, amount, status, created_at
    FROM transactions
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction History Page</title>

    <!-- CSS (UNCHANGED) -->
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/transaction-history.css">
</head>

<body>

<!-- MOBILE MENU TOGGLE -->
<button class="menu-toggle" id="menuToggle">
    <img src="images/Dashboard/d_sidebar.png" width="40" height="40">
</button>

<div class="container">

    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="images/Pawfessor_Logo.png" width="55" height="65">
        </div>
        <nav>
            <a href="dashboard-user.php" class="menu-item">
                <img src="images/Dashboard/d_dashboard.png" width="40">
                <span>Dashboard</span>
            </a>
            <a href="tasks.php" class="menu-item">
                <img src="images/Dashboard/d_my_tasks.png" width="40">
                <span>My Tasks</span>
            </a>
            <a href="progress.php" class="menu-item">
                <img src="images/Dashboard/d_progress.png" width="40">
                <span>Progress</span>
            </a>
            <a href="store.html" class="menu-item">
                <img src="images/Dashboard/d_mascot_store.png" width="40">
                <span>Mascot Store</span>
            </a>
            <a href="subscriptions.php" class="menu-item">
                <img src="images/Dashboard/d_subscriptions.png" width="40">
                <span>Subscriptions</span>
            </a>
            <a href="carts.html" class="menu-item">
                <img src="images/Dashboard/d_carts.png" width="40">
                <span>Carts</span>
            </a>
            <a href="transaction-history.php" class="menu-item active">
                <img src="images/Dashboard/d_transaction_history.png" width="40">
                <span>Transaction History</span>
            </a>
            <a href="profiles.php" class="menu-item">
                <img src="images/Dashboard/d_profiles.png" width="40">
                <span>Profiles</span>
            </a>
        </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">

        <!-- TOP NAV -->
        <div class="top-nav">
            <div class="logo-section">
                <img src="images/Pawfessor_Logo.png" width="50" height="60">
                <span class="logo-text">PAWFESSOR</span>
            </div>

            <nav class="nav-menu">
                <a href="dashboard-user.php" class="nav-link">Home</a>
                <a href="subscriptions.php" class="nav-link">Pricing</a>
                <a href="transaction-history.php" class="nav-link" style="color:#007bff;">
                    Transaction History
                </a>
            </nav>

            <div class="header-icons">
                <button class="icon-btn">
                    <img src="images/bell_icon.png" width="40">
                </button>
                <button class="icon-btn">
                    <img src="images/h_profiles.png" width="55">
                </button>
            </div>
        </div>

        <!-- PAGE TITLE -->
        <h1 class="page-title">Transactions History</h1>

        <!-- FILTER BAR -->
        <div class="filter-bar">
            <div class="date-range">
                <img src="images/calendar_icon.png" width="40">
                <span>All Time</span>
            </div>

            <button class="download-btn">
                <img src="images/invoices_icon.png" width="40">
                <span>Download Invoices</span>
            </button>
        </div>

        <!-- TABLE CONTAINER -->
        <div class="table-container">

            <!-- FILTER TABS (FIXED) -->
            <div class="table-header">
                <div class="filter-tabs">
                    <div class="filter-tab active" data-filter="all">All</div>
                    <div class="filter-tab" data-filter="successful">Successful</div>
                    <div class="filter-tab" data-filter="unsuccessful">Unsuccessful</div>
                </div>

                <div class="status-filter">
                    <span>Status:</span>
                    <select class="status-select">
                        <option value="all">All</option>
                        <option value="successful">Successful</option>
                        <option value="unsuccessful">Unsuccessful</option>
                    </select>
                </div>
            </div>

            <!-- TRANSACTIONS TABLE -->
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>Ref ID</th>
                        <th>Transaction Date</th>
                        <th>Product</th>
                        <th>Payment Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                <?php if ($result->num_rows > 0): ?>
                    <?php while ($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td class="ref-id"><?= $row['id'] ?></td>
                            <td><?= $row['created_at'] ?></td>
                            <td><?= htmlspecialchars($row['product']) ?></td>
                            <td><?= htmlspecialchars($row['payment_method']) ?></td>
                            <td>RM<?= number_format($row['amount'], 2) ?></td>
                            <td>
                                <span class="status-badge status-<?= $row['status'] ?>">
                                    <?= ucfirst($row['status']) ?>
                                </span>
                            </td>
                            <td>⋮</td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                        <tr>
                            <td colspan="7" style="text-align:center;">
                                No transactions found
                            </td>
                        </tr>
                <?php endif; ?>
                </tbody>
            </table>

        </div>

    </main>
</div>

<!-- JS -->
<script src="js/main.js"></script>
<script src="js/transaction-history.js"></script>

</body>
</html>


