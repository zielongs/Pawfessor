/* ============================================
   RESET PASSWORD PAGE FUNCTIONALITY - JAVASCRIPT
   Author      : Noraziela Binti Jepsin
   Updated By  : Siti Norlie Yana, Noraziela Binti Jepsin
   Tested By   : Siti Norlie Yana, Noraziela Binti Jepsin
   Description : Handles resetting the user's password,
                 including validation for empty fields,
                 password confirmation, success alert, 
                 redirection to login page, and dynamic
                 navbar loading.
   ============================================ */

function resetPassword(token) {
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

    // Send to backend to update password
    fetch("resetpassword-backend.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        if (msg.includes("successfully")) {
            window.location.href = "login.php";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error updating password. Try again.");
    });
}
