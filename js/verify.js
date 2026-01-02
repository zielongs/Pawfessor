/* ============================================
   VERIFY CODE PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Md Habibullah Habib
   Updated By  : Siti Norlie Yana
   Tested By   : Siti Norlie Yana
   Description : Handles verification code input
                 validation, redirects to reset
                 password page, and dynamically
                 loads the navbar component.
   ============================================ */

function goToReset() {
    const codeInput = document.querySelector('input[type="text"]');
    if (codeInput.value.trim().length !== 6) {
        alert("Please enter a valid 6-digit code!");
        return;
    }
    // Redirect to reset password page
    window.location.href = "resetpassword.html";
}

fetch("/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
