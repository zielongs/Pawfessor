<?php
/* ============================================
   PROFILE PAGE - PHP
   Author: Noraziela Binti Jepsin
   Updated by: Noraziela Binti Jepsin
   Description: Displays user profile from database
   ============================================ */

session_start();
include "db.php";

// Protect page - redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Get user data from database
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT fullname, email, phone, gender, date_of_birth, avatar, subscription_plan FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
} else {
    // User not found, logout
    header("Location: logout.php");
    exit();
}

// Split fullname for display
$nameParts = explode(' ', $user['fullname'], 2);
$firstName = $nameParts[0];
$lastName = isset($nameParts[1]) ? $nameParts[1] : '';

// Determine subscription plan display
$planName = strtoupper($user['subscription_plan'] ?? 'FREE');
$planColor = ($planName === 'PREMIUM') ? '#fbbf24' : '#fecaca';
$planIcon = ($planName === 'PREMIUM') ? 'images/Plans/premium.png' : 'images/Plans/free.png';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Pawfessor</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/profiles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        /* Logout Modal Styles */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }

        .modal-overlay.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.3s ease;
        }

        .modal-icon {
            font-size: 4em;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 1.8em;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .modal-message {
            color: #666;
            font-size: 1.1em;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .modal-btn {
            padding: 12px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-btn-confirm {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .modal-btn-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .modal-btn-cancel {
            background: #f0f0f0;
            color: #333;
        }

        .modal-btn-cancel:hover {
            background: #e0e0e0;
        }
    </style>
</head>
<body>

    <!-- Logout Confirmation Modal -->
    <div class="modal-overlay" id="logoutModal">
        <div class="modal-content">
            <div class="modal-icon">👋</div>
            <div class="modal-title">Log Out?</div>
            <div class="modal-message">
                Are you sure you want to log out? We'll save your progress and see you soon!
            </div>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-cancel" id="cancelLogout">Cancel</button>
                <button class="modal-btn modal-btn-confirm" id="confirmLogout">Log Out</button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu Toggle Button -->
    <button class="menu-toggle" id="menuToggle">
        <img src="images/Dashboard/d_sidebar.png" width="40" height="40" alt="Menu">
    </button>

    <div class="container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="images/Pawfessor_Logo.png" width="55" height="65" alt="Logo">
            </div>
            <nav>
                <a href="dashboard-user.php" class="menu-item"><img src="images/Dashboard/d_dashboard.png" width="40"><span>Dashboard</span></a>
                <a href="tasks.php" class="menu-item"><img src="images/Dashboard/d_my_tasks.png" width="40"><span>My Tasks</span></a>
                <a href="progress.php" class="menu-item"><img src="images/Dashboard/d_progress.png" width="40"><span>Progress</span></a>
                <a href="store.html" class="menu-item"><img src="images/Dashboard/d_mascot_store.png" width="40"><span>Mascot Store</span></a>
                <a href="subscriptions.html" class="menu-item"><img src="images/Dashboard/d_subscriptions.png" width="40"><span>Subscriptions</span></a>
                <a href="carts.html" class="menu-item"><img src="images/Dashboard/d_carts.png" width="40"><span>Carts</span></a>
                <a href="transaction-history.html" class="menu-item"><img src="images/Dashboard/d_transaction_history.png" width="40"><span>Transaction History</span></a>
                <a href="profiles.php" class="menu-item active"><img src="images/Dashboard/d_profiles.png" width="40"><span>Profiles</span></a>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content profile-layout">
            <!-- Profile Header Section -->
            <div class="profile-header">
                <div class="profile-avatar-container">
                    <?php if (!empty($user['avatar'])): ?>
                        <img src="<?php echo htmlspecialchars($user['avatar']); ?>" alt="Profile" class="profile-avatar">
                    <?php else: ?>
                        <img src="images/h_profiles.png" alt="Profile" class="profile-avatar">
                    <?php endif; ?>
                </div>
                
                <h2 class="profile-name">
                    <a href="update-profile.php" class="edit-link">
                        <span><?php echo htmlspecialchars($user['fullname']); ?></span> 
                        <span class="edit-icon">✎</span>
                    </a>
                </h2>
                
                <p class="profile-email"><?php echo htmlspecialchars($user['email']); ?></p>
                
                <div class="plan-badge" style="background: <?php echo $planColor; ?>">
                    <img src="<?php echo $planIcon; ?>" width="40" height="30" alt="">
                    <span><?php echo $planName; ?> PLAN</span>
                </div>
            </div>

            <!-- Profile Options Menu -->
            <div class="profile-options">
                <a href="subscriptions.html" class="option-item">
                    <div class="option-icon purple">✦</div>
                    <span class="option-text">Upgrade Plan</span>
                </a>
                
                <a href="transaction-history.html" class="option-item">
                    <div class="option-icon blue-dark">$</div>
                    <span class="option-text">Transaction History</span>
                </a>
                
                <a href="settings.html" class="option-item">
                    <div class="option-icon blue-sky">⚙</div>
                    <span class="option-text">Settings</span>
                </a>
                
                <a href="#" class="option-item" id="logoutBtn">
                    <div class="option-icon blue-soft">🚪</div>
                    <span class="option-text">Log Out</span>
                </a>
            </div>
        </main>
    </div>

    <script src="js/main.js"></script>
    
    <script>
        // Logout Modal Functionality
        const logoutBtn = document.getElementById('logoutBtn');
        const logoutModal = document.getElementById('logoutModal');
        const cancelLogout = document.getElementById('cancelLogout');
        const confirmLogout = document.getElementById('confirmLogout');

        // Show modal when logout is clicked
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutModal.classList.add('active');
        });

        // Hide modal when cancel is clicked
        cancelLogout.addEventListener('click', () => {
            logoutModal.classList.remove('active');
        });

        // Close modal when clicking outside
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('active');
            }
        });

        // Confirm logout
        confirmLogout.addEventListener('click', () => {
            confirmLogout.textContent = 'Logging out...';
            confirmLogout.style.opacity = '0.6';
            
            setTimeout(() => {
                window.location.href = 'logout.php';
            }, 500);
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && logoutModal.classList.contains('active')) {
                logoutModal.classList.remove('active');
            }
        });
    </script>
</body>
</html>