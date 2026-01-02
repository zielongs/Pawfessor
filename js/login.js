/* ============================================
   LOGIN PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Md Habibullah Habib
   Updated By  : Siti Norlie Yana
   Tested By   : Siti Norlie Yana
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
    passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
});

// ================================
// Handle login form submit
// ================================
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page refresh

    // Simulate login success
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        alert("Login successful!");

        // Redirect to dashboard
        window.location.href = "dashboard-user.html";
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
