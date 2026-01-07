/* ============================================
   FORGOT PASSWORD PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Noraziela Binti Jepsin
   Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
   Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
   Description : Handles forgot password actions
                 including email input validation,
                 redirection to verification page,
                 and dynamic navbar loading.
   ============================================ */

/* ============================================
   FORGOT PASSWORD PAGE - JAVASCRIPT
   Updated to connect with PHP backend
============================================ */

function goToVerify() {
    const emailInput = document.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
        alert("Please enter your email!");
        return;
    }

    // Send email to backend to generate reset token
    fetch("forgotpassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}`
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        // If successful, redirect to reset page or notify user
        // You could redirect to verify.html or just tell user to check email
    })
    .catch(err => {
        console.error(err);
        alert("Error processing request. Please try again.");
    });
}

// Load navbar dynamically
fetch("navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
