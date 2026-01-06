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

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  this.classList.toggle("fa-eye-slash");
});

// Signup logic
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (!fullName || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|my|edu|net|org)$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email (e.g. name@gmail.com)");
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    alert("Password must be at least 8 characters and contain letters and numbers");
    return;
  }

  const existingUser = UserService.findUserByEmail(email);
  if (existingUser) {
    alert("This email is already registered. Please login.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: fullName,
    email: email,
    password: btoa(password),
    role: "user",
    registeredAt: new Date().toISOString()
  };

  UserService.registerUser(newUser);

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
});
