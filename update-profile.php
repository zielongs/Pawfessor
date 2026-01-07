<?php
/* ============================================
   UPDATE PROFILE PAGE - PHP
   Author: Noraziela Binti Jepsin
   Updated by: Noraziela Binti Jepsin
   Description: Updates user profile in database
   ============================================ */

session_start();
include "db.php";

// Protect page
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$success = '';
$errors = [];

// Get current user data
$stmt = $conn->prepare("SELECT fullname, email, phone, gender, date_of_birth, avatar FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Split fullname
$nameParts = explode(' ', $user['fullname'], 2);
$firstName = $nameParts[0];
$lastName = isset($nameParts[1]) ? $nameParts[1] : '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first = trim($_POST['firstname']);
    $last = trim($_POST['lastname']);
    $phone = trim($_POST['phone']);
    $gender = trim($_POST['gender']);
    $dob = trim($_POST['dob']);
    
    // Build full name
    $fullname = trim($first . ' ' . $last);
    
    // Validate
    if (empty($fullname)) {
        $errors[] = "Name is required!";
    }
    
    // Phone validation (optional)
    if (!empty($phone) && !preg_match('/^[0-9+\-\s()]+$/', $phone)) {
        $errors[] = "Invalid phone number format!";
    }
    
    // Date validation (optional)
    if (!empty($dob)) {
        $date = DateTime::createFromFormat('Y-m-d', $dob);
        if (!$date) {
            $errors[] = "Invalid date format!";
        }
    }
    
    // Handle avatar upload
    $avatar = $user['avatar']; // Keep current avatar by default
    
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        $filename = $_FILES['avatar']['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if (!in_array($ext, $allowed)) {
            $errors[] = "Only JPG, PNG, and GIF images are allowed!";
        } elseif ($_FILES['avatar']['size'] > 5 * 1024 * 1024) { // 5MB limit
            $errors[] = "Avatar must be less than 5MB!";
        } else {
            // Create uploads directory if it doesn't exist
            $uploadDir = 'uploads/avatars/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            // Generate unique filename
            $newFilename = 'avatar_' . $user_id . '_' . time() . '.' . $ext;
            $uploadPath = $uploadDir . $newFilename;
            
            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadPath)) {
                // Delete old avatar if exists
                if (!empty($user['avatar']) && file_exists($user['avatar'])) {
                    unlink($user['avatar']);
                }
                $avatar = $uploadPath;
            } else {
                $errors[] = "Failed to upload avatar!";
            }
        }
    }
    
    // Update database if no errors
    if (empty($errors)) {
        $stmt = $conn->prepare("UPDATE users SET fullname = ?, phone = ?, gender = ?, date_of_birth = ?, avatar = ?, updated_at = NOW() WHERE user_id = ?");
        $stmt->bind_param("sssssi", $fullname, $phone, $gender, $dob, $avatar, $user_id);
        
        if ($stmt->execute()) {
            // Update session
            $_SESSION['fullname'] = $fullname;
            
            $success = "Profile updated successfully!";
            
            // Refresh user data
            $user['fullname'] = $fullname;
            $user['phone'] = $phone;
            $user['gender'] = $gender;
            $user['date_of_birth'] = $dob;
            $user['avatar'] = $avatar;
            
            // Update name parts
            $nameParts = explode(' ', $fullname, 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
            
            // Redirect after 2 seconds
            header("refresh:2;url=profiles.php");
        } else {
            $errors[] = "Failed to update profile. Please try again.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Profile - Pawfessor</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/update-profile.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>

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

        <!-- Main Content -->
        <main class="main-content update-profile-layout">
            <!-- Profile Summary -->
            <div class="profile-summary">
                <div class="avatar-wrapper">
                    <?php if (!empty($user['avatar'])): ?>
                        <img src="<?php echo htmlspecialchars($user['avatar']); ?>" alt="Avatar" class="main-avatar" id="avatarPreview">
                    <?php else: ?>
                        <img src="images/h_profiles.png" alt="Avatar" class="main-avatar" id="avatarPreview">
                    <?php endif; ?>
                    <label for="avatarInput" class="edit-pen" style="cursor: pointer;" title="Change avatar">✎</label>
                </div>
                
                <h2 class="user-id"><?php echo htmlspecialchars($user['fullname']); ?></h2>
                <p class="user-email"><?php echo htmlspecialchars($user['email']); ?></p>
            </div>

            <!-- Messages -->
            <?php if (!empty($errors)): ?>
                <div style="background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 8px; margin: 0 auto 20px; max-width: 420px;">
                    <?php foreach ($errors as $error): ?>
                        <p style="color: #c33; margin: 5px 0; font-size: 14px;">⚠️ <?php echo htmlspecialchars($error); ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if ($success): ?>
                <div style="background: #efe; border: 1px solid #cfc; padding: 15px; border-radius: 8px; margin: 0 auto 20px; max-width: 420px;">
                    <p style="color: #3c3; margin: 0; font-size: 14px;">✅ <?php echo htmlspecialchars($success); ?></p>
                </div>
            <?php endif; ?>

            <!-- Update Form -->
            <form class="update-form" method="POST" enctype="multipart/form-data">
                <!-- Hidden avatar input -->
                <input type="file" id="avatarInput" name="avatar" accept="image/*" style="display: none;">
                
                <input type="text" name="firstname" id="firstNameInput" 
                       placeholder="What's your first name?" 
                       class="form-input"
                       value="<?php echo htmlspecialchars($firstName); ?>"
                       required>
                
                <input type="text" name="lastname" id="lastNameInput" 
                       placeholder="And your last name?" 
                       class="form-input"
                       value="<?php echo htmlspecialchars($lastName); ?>">
                
                <div class="phone-input-container">
                    <select name="country_code" id="countryCode" class="country-code-select">
                        <option value="+60">🇲🇾 +60</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+62">🇮🇩 +62</option>
                        <option value="custom">✏️ Other</option>
                    </select>
                    <input type="text" 
                           id="customCode" 
                           name="custom_code" 
                           class="custom-code-input" 
                           placeholder="+XX" 
                           maxlength="5"
                           style="display: none;">
                    <input type="tel" name="phone" 
                           id="phoneNumber"
                           placeholder="Phone number" 
                           class="phone-input-field"
                           value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>">
                </div>

                <div class="select-wrapper">
                    <select name="gender" class="form-input select-input">
                        <option value="" disabled <?php echo empty($user['gender']) ? 'selected' : ''; ?>>Select your gender</option>
                        <option value="male" <?php echo ($user['gender'] ?? '') === 'male' ? 'selected' : ''; ?>>Male</option>
                        <option value="female" <?php echo ($user['gender'] ?? '') === 'female' ? 'selected' : ''; ?>>Female</option>
                        <option value="other" <?php echo ($user['gender'] ?? '') === 'other' ? 'selected' : ''; ?>>Other</option>
                    </select>
                </div>

                <div class="date-input-container">
                    <input type="date" name="dob" 
                           placeholder="What is your date of birth?" 
                           class="form-input"
                           value="<?php echo htmlspecialchars($user['date_of_birth'] ?? ''); ?>">
                    <div class="calendar-icon">
                        <img src="images/calendar_profile.png" width="25" height="25" alt="Calendar"> 
                    </div>
                </div>
                
                <button type="submit" class="update-btn">Update Profile</button>
            </form>
        </main>
    </div>

    <script src="js/main.js"></script>
    <script>
        // Avatar preview
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');

        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });

        // Country code selector with custom option
        const countryCode = document.getElementById('countryCode');
        const customCode = document.getElementById('customCode');
        const phoneNumber = document.getElementById('phoneNumber');

        // Parse existing phone number to set country code
        window.addEventListener('DOMContentLoaded', function() {
            const currentPhone = phoneNumber.value.trim();
            if (currentPhone) {
                const codes = ['+60', '+1', '+44', '+65', '+62'];
                let foundCode = false;
                
                for (let code of codes) {
                    if (currentPhone.startsWith(code)) {
                        countryCode.value = code;
                        phoneNumber.value = currentPhone.substring(code.length).trim();
                        foundCode = true;
                        break;
                    }
                }
                
                // Check for custom code (starts with + but not in list)
                if (!foundCode && currentPhone.startsWith('+')) {
                    const match = currentPhone.match(/^(\+\d{1,4})\s*(.*)/);
                    if (match) {
                        countryCode.value = 'custom';
                        customCode.style.display = 'block';
                        customCode.value = match[1];
                        phoneNumber.value = match[2];
                    }
                }
            }
        });

        // Show/hide custom code input
        countryCode.addEventListener('change', function() {
            if (this.value === 'custom') {
                customCode.style.display = 'block';
                customCode.required = true;
                customCode.focus();
            } else {
                customCode.style.display = 'none';
                customCode.required = false;
                customCode.value = '';
            }
        });

        // Format custom code input
        customCode.addEventListener('input', function(e) {
            let value = this.value.replace(/[^\d+]/g, '');
            if (value && !value.startsWith('+')) {
                value = '+' + value;
            }
            this.value = value;
        });

        // Combine country code + phone number before submit
        document.querySelector('.update-form').addEventListener('submit', function(e) {
            const code = countryCode.value === 'custom' ? customCode.value : countryCode.value;
            const number = phoneNumber.value.trim();
            
            if (number) {
                // Combine code and number
                phoneNumber.value = code + ' ' + number;
            }
        });
    </script>
</body>
</html>