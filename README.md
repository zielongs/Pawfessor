# Pawfessor
Project - Web Application Development

ADMIN PAWFESSOR LOGIN: admin@pawfessor.com,
PASSWORD: admin123

-- ============================================
-- PAWFESSOR DATABASE - COMPLETE SETUP
-- Description: Complete database schema for
--              Pawfessor authentication system
-- Author: Noraziela Binti Jepsin 
-- Date: January 8, 2026
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS pawfessor_db;
USE pawfessor_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    avatar VARCHAR(255),
    subscription_plan ENUM('free', 'premium') DEFAULT 'free',
    security_question_1 VARCHAR(255),
    security_answer_1 VARCHAR(255),
    security_question_2 VARCHAR(255),
    security_answer_2 VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PASSWORD RESETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_resets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- INSERT DEFAULT ADMIN ACCOUNT
-- ============================================
-- Default Admin Credentials:
-- Email: admin@pawfessor.com
-- Password: Admin@123
INSERT INTO users (fullname, email, password, role) 
VALUES ('Administrator', 'admin@pawfessor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- VERIFY SETUP
-- ============================================
-- Show all tables
SHOW TABLES;

-- Show users table structure
DESCRIBE users;

-- Show password_resets table structure
DESCRIBE password_resets;

-- Show created admin account
SELECT user_id, fullname, email, role, created_at FROM users WHERE role = 'admin';

-- ============================================
-- OPTIONAL: IF YOU NEED TO ADD COLUMNS TO EXISTING TABLE
-- ============================================
-- Run these only if you're updating an existing database

-- Add profile columns (if not exist)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER email;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS gender ENUM('male', 'female', 'other') AFTER phone;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE AFTER gender;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) AFTER date_of_birth;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan ENUM('free', 'premium') DEFAULT 'free' AFTER avatar;

-- Add security questions (if not exist)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question_1 VARCHAR(255) AFTER subscription_plan;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_1 VARCHAR(255) AFTER security_question_1;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question_2 VARCHAR(255) AFTER security_answer_1;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_2 VARCHAR(255) AFTER security_question_2;

-- Add timestamps (if not exist)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER role;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================
-- Uncomment to add test users

-- INSERT INTO users (fullname, email, password, role) VALUES
-- ('Test User', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
-- ('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Note: All sample passwords are 'Admin@123'

-- ============================================
-- CLEANUP COMMANDS (USE WITH CAUTION!)
-- ============================================
-- Uncomment to drop and recreate tables (WARNING: DELETES ALL DATA!)

-- DROP TABLE IF EXISTS password_resets;
-- DROP TABLE IF EXISTS users;

-- Then run the CREATE TABLE commands again

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Count total users
-- SELECT COUNT(*) as total_users FROM users;

-- Count users by role
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Show recent password resets
-- SELECT pr.reset_id, u.email, pr.code, pr.expires_at, pr.created_at
-- FROM password_resets pr
-- JOIN users u ON pr.user_id = u.user_id
-- ORDER BY pr.created_at DESC
-- LIMIT 10;

-- Delete expired password reset tokens
-- DELETE FROM password_resets WHERE expires_at < NOW();

-- Find users without security questions
-- SELECT user_id, fullname, email 
-- FROM users 
-- WHERE security_question_1 IS NULL OR security_question_2 IS NULL;

-- ============================================
-- BACKUP COMMAND
-- ============================================
-- To backup your database, run this in command line (not in MySQL):
-- mysqldump -u root -p pawfessor_db > pawfessor_backup.sql

-- To restore:
-- mysql -u root -p pawfessor_db < pawfessor_backup.sql

-- ============================================
-- END OF SETUP
-- ============================================

SELECT '✅ Database setup complete!' as Status;




🔄 Complete Password Reset Flow:
1. forgetpassword.php
   ↓ Enter email → Get code (shown on screen)
   
2. verify-security-questions.php
   ↓ Answer 2 security questions
   
3. verify.php
   ↓ Enter 6-digit code
   
4. resetpassword.php
   ↓ Set new password
   
5. login.php
   ↓ Login with new password
   
✅ Done!