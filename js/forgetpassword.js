function goToVerify() {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput.value.trim() === "") {
        alert("Please enter your email!");
        return;
    }
    // Redirect to verify page (or handle API)
    window.location.href = "verify.html";
}

fetch("/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
