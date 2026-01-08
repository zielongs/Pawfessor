
<!-- ===================================================
     SUBSCRIPTIONS PAGE
     ---------------------------------------------------
    Author: Siti Norlie Yana
    Date: 01 January 2026
    Tested by:
    Updated by:
    Description:
     This page displays subscription and billing information including:
     - Current subscription plan
     - Billing settings (auto-renew, payment method)
     - Upgrade or cancel actions
     - Data dynamically updated via subscriptions.js
=================================================== -->

<?php 
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check login
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscriptions</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/subscription.css">
</head>
<body>

<div class="container">
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <img src="images/Pawfessor_Logo.png" width="55" height="65" alt="Pawfessor Logo">
        </div>
        <nav>
            <a href="dashboard-user.php" class="menu-item">
                <img src="images/Dashboard/d_dashboard.png" width="40" height="40">
                <span>Dashboard</span>
            </a>
            <a href="tasks.php" class="menu-item">
                <img src="images/Dashboard/d_my_tasks.png" width="40" height="40">
                <span>My Tasks</span>
            </a>
            <a href="progress.php" class="menu-item">
                <img src="images/Dashboard/d_progress.png" width="40" height="40">
                <span>Progress</span>
            </a>
            <a href="store.html" class="menu-item">
                <img src="images/Dashboard/d_mascot_store.png" width="40" height="40">
                <span>Mascot Store</span>
            </a>
            <a href="subscriptions.php" class="menu-item active">
                <img src="images/Dashboard/d_subscriptions.png" width="40" height="40">
                <span>Subscriptions</span>
            </a>
            <a href="carts.html" class="menu-item">
                <img src="images/Dashboard/d_carts.png" width="40" height="40">
                <span>Carts</span>
            </a>
            <a href="transaction-history.html" class="menu-item">
                <img src="images/Dashboard/d_transaction_history.png" width="40" height="40">
                <span>Transaction History</span>
            </a>
            <a href="profiles.php" class="menu-item">
                <img src="images/Dashboard/d_profiles.png" width="40" height="40">
                <span>Profiles</span>
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">

        <!-- HEADER -->
        <header class="header">
            <div></div>
            <div class="header-icons">
                
                <a href="profiles.php" class="icon-btn" id="profileBtn" aria-label="Profile">
                    <img src="images/h_profiles.png" width="55" height="50" alt="Profile">
                </a>
            </div>
        </header>

        <h1 class="page-title">Subscriptions & Billing</h1>

        <!-- Current Plan -->
        <div class="section">
            <h2 class="section-title">Current Plan</h2>
            <div class="plan-cards">
                <div class="plan-card">
                    <h3 id="currentPlanName">Loading...</h3>
                    <div class="price" id="planPrice">RM0.00</div>
                    <div class="billing-date">
                        Next Billing Date: <strong id="nextBillingDate">-</strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- Billing Settings -->
        <div class="section">
            <h2 class="section-title">Billing Settings</h2>
            <div class="billing-settings">
                <div class="setting-item">
                    <div class="setting-label">Auto Renew Subscription</div>
                    <div class="setting-value">
                        <span class="toggle-label" id="autoRenewLabel">OFF</span>
                        <div class="toggle-switch" id="autoRenewToggle">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">Payment Method: <span id="paymentMethod">None</span></div>
                    <button class="edit-btn" id="editPaymentBtn">Edit</button>
                </div>
            </div>
        </div>

        <!-- Upgrade Plan -->
        <div class="section">
            <h2 class="section-title">Upgrade Your Plan</h2>
            <div class="plan-cards">
    <button class="upgrade-btn" data-plan="free">
        <div class="plan-icon">
            <img src="images/plans/free.png" alt="Free Plan Icon">
        </div>
        Free Plan - RM0/month
    </button>
    <button class="upgrade-btn" data-plan="standard">
        <div class="plan-icon">
            <img src="images/plans/standard.png" alt="Standard Plan Icon">
        </div>
        Standard Plan - RM5.99/month
    </button>
    <button class="upgrade-btn" data-plan="premium">
        <div class="plan-icon">
            <img src="images/plans/premium.png" alt="Premium Plan Icon">
        </div>
        Premium Plan - RM15.99/month
    </button>
</div>
        </div>

        <!-- Cancel Subscription -->
        <div class="section">
            <button class="action-btn danger" id="cancelSubscriptionBtn">Cancel Subscription</button>
        </div>

    </main>
</div>

<!-- Sidebar Toggle Button -->
<button class="menu-toggle" id="menuToggle">
    <img src="images/Dashboard/d_sidebar.png" width="40" height="40" alt="Menu">
</button>

<script>
    const CURRENT_USER_ID = <?php echo json_encode($user_id); ?>;
</script>

<!-- JS FILES -->
<script src="js/security.js"></script>
<script src="js/main.js"></script> <!-- sidebar handled here -->
<script src="js/subscriptions.js"></script>
</body>
</html>
