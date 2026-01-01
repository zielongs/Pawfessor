// Simple interaction demo
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        alert("Pawfessor is coming soon! 🚀");
    });
});

fetch("/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
  })
  .catch(err => console.error("Navbar load failed:", err));
