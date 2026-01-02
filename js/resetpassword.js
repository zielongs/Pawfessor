/* ============================================
   RESET PASSWORD PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Md Habibullah Habib
   Updated By  : Siti Norlie Yana
   Tested By   : Siti Norlie Yana
   Description : Handles resetting the user's password,
                 including validation for empty fields,
                 password confirmation, success alert, 
                 redirection to login page, and dynamic
                 navbar loading.
   ============================================ */

function resetPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!password || !confirmPassword) {
        alert("Please fill both fields!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    alert("Your password has been reset successfully!");
    // Redirect to login page
    window.location.href = "login.html";
}

fetch("/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
