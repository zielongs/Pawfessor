/* ============================================
   LANDING PAGE INTERACTIONS - JAVASCRIPT
   Author      : Md Habibullah Habib
   Updated By  : Siti Norlie Yana
   Tested By   : Siti Norlie Yana
   Description : Handles basic user interactions
                 such as button navigation and
                 dynamic loading of the navbar.
   ============================================ */

// Simple interaction demo
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
         window.location.href = "signup.html";
    });
});

fetch("navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
