/* ============================================
   LOGIN PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Md Habibullah Habib
   Updated By  : Siti Norlie Yana
				     Alyssa Annabelle binti James Pekan
   Tested By   : Siti Norlie Yana
				     Alyssa Annabelle binti James Pekan
   Description : Handles login page interactions
                 including password visibility
                 toggle, form submission handling,
                 basic login validation, redirection,
                 and dynamic navbar loading.
   ============================================ */

// ================================
// Toggle password visibility
// ================================
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  passwordInput.type = (passwordInput.type === "password") ? "text" : "password";
});

// ================================
// Handle login form submit
// ================================
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop page refresh

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  // Demo admin credentials (front-end only)
  const ADMIN_EMAIL = "admin@pawfessor.com";
  const ADMIN_PASSWORD = "admin123"; 

  if (email && password) {
    alert("Login successful!");

    // Admin goes to admin dashboard, others go to user dashboard - 
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      window.location.href = "dashboard-admin.html";
    } else {
      window.location.href = "dashboard-user.html";
    }
  }
});

// ================================
// Load navbar
// ================================
fetch("navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
