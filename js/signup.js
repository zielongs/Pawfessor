/* ============================================
   SIGNUP PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Md Habibullah Habib
   Updated By  : Siti Norlie Yana
   Tested By   : Siti Norlie Yana
   Description : Handles signup page interactions,
                 including password visibility toggle,
                 form submission with basic validation,
                 redirection to login page, and dynamic
                 navbar loading.
   ============================================ */

// ================================
// Toggle password visibility
// ================================
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
});

// ================================
// Handle form submission
// ================================
const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page refresh

    // Simple validation (HTML already does required check)
    alert("Account created successfully!");

    // Redirect to login page
    window.location.href = "login.html";
});

// ================================
// Load navbar
// ================================
fetch("/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;
    })
    .catch(err => console.error("Navbar load failed:", err));

