// ---------- UI PAGE CONTROL ----------

function showLoginForm(type) {
  document.getElementById("student-form").classList.remove("active");
  document.getElementById("teacher-form").classList.remove("active");

  if (type === "student") {
    document.getElementById("student-form").classList.add("active");
  } else {
    document.getElementById("teacher-form").classList.add("active");
  }
}

function showRegisterPage() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("register-container").style.display = "block";
  document.getElementById("password-container").style.display = "none";
}

function showLoginPage() {
  document.getElementById("login-container").style.display = "block";
  document.getElementById("register-container").style.display = "none";
  document.getElementById("password-container").style.display = "none";
}

function showPasswordPage() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("register-container").style.display = "none";
  document.getElementById("password-container").style.display = "block";
}
