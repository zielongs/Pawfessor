<?php
/* ============================================
   DATABASE CONFIGURATION
   Author: Noraziela Binti Jepsin
   Description: MySQLi database connection setup
   ============================================ */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pawfessor_db');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");

// Fix timezone - Set to Malaysia time (UTC+8)
date_default_timezone_set('Asia/Kuala_Lumpur');
$conn->query("SET time_zone = '+08:00'");

// Function to sanitize input
function sanitize($data) {
    global $conn;
    return mysqli_real_escape_string($conn, trim($data));
}
?>