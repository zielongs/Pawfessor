/* ============================================
   LOGIN PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Noraziela binti Jepsin
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

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  passwordInput.type = (passwordInput.type === "password") ? "text" : "password";
});

// ================================
// Handle login form submit
// ================================
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  // Admin path: validate against database
  if (email === "admin@pawfessor.com") {
    try {
      const res = await fetch("./api/admin/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.ok) {
        alert(data?.error || "Admin login failed.");
        return;
      }

      // store token for later API calls (products/reports/etc.)
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_token_expires_at", data.expires_at);

      alert("Admin login successful!");
      window.location.href = "dashboard-admin.html";
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
    return;
  }

  // Normal users: keep existing flow (your teammates handle later)
  alert("Login successful!");
  window.location.href = "dashboard-user.html";
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
