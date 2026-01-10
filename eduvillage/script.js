// ---------- UI PAGE CONTROL ----------
function showLoginForm(type) {
    document.getElementById("student-form").classList.remove("active");
    document.getElementById("teacher-form").classList.remove("active");
    if (type === "student") document.getElementById("student-form").classList.add("active");
    else document.getElementById("teacher-form").classList.add("active");
}

// ---------- TOGGLE PASSWORD ----------
function togglePassword(id) {
    const passInput = document.getElementById(id);
    passInput.type = passInput.type === "password" ? "text" : "password";
}

// ---------- PAGE SWITCH ----------
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

// ---------- TAB SWITCHING FOR REGISTER ----------
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form-container");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const target = tab.getAttribute("data-tab");
        forms.forEach(f => {
            if (f.id === target) f.classList.add("active");
            else f.classList.remove("active");
        });
    });
});

// ---------- REGISTER FUNCTIONS ----------
function registerStudent() {
    const name = document.getElementById("sName").value.trim();
    const email = document.getElementById("sRegEmail").value.trim();
    const password = document.getElementById("sRegPass").value.trim();
    if (!name || !email || !password) { alert("Please fill all fields"); return; }

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, fullName: name, role: "student" })
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => console.error(err));
}

function registerTeacher() {
    const name = document.getElementById("tName").value.trim();
    const email = document.getElementById("tRegEmail").value.trim();
    const password = document.getElementById("tRegPass").value.trim();
    if (!name || !email || !password) { alert("Please fill all fields"); return; }

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, fullName: name, role: "teacher" })
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => console.error(err));
}

// ---------- LOGIN FUNCTIONS ----------
function studentLogin() {
    const email = document.getElementById("sEmail").value.trim();
    const password = document.getElementById("sPass").value.trim();
    if (!email || !password) { alert("Please enter email and password"); return; }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, role: "student" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            localStorage.setItem("studentName", data.user.fullName || data.user.username.split("@")[0]);
            localStorage.setItem("studentEmail", data.user.username);
            window.location.href = "student.html";
        } else {
            alert(data.message || "Invalid credentials");
        }
    })
    .catch(err => console.error(err));
}

function teacherLogin() {
    const email = document.getElementById("tEmail").value.trim();
    const password = document.getElementById("tPass").value.trim();
    if (!email || !password) { alert("Please enter email and password"); return; }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, role: "teacher" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            localStorage.setItem("teacherName", data.user.fullName || data.user.username.split("@")[0]);
            localStorage.setItem("teacherEmail", data.user.username);
            window.location.href = "teachers.html";
        } else {
            alert(data.message || "Invalid credentials");
        }
    })
    .catch(err => console.error(err));
}

// ---------- LOGOUT ----------
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ---------- DASHBOARD DATA LOADING ----------
window.addEventListener("DOMContentLoaded", () => {
    // Student Dashboard
    const studentName = localStorage.getItem("studentName");
    const studentEmail = localStorage.getItem("studentEmail");
    if (document.getElementById("studentName")) document.getElementById("studentName").innerText = studentName || "Student";
    if (document.getElementById("studentEmail")) document.getElementById("studentEmail").innerText = studentEmail || "Not Available";

    // Teacher Dashboard
    const teacherName = localStorage.getItem("teacherName");
    const teacherEmail = localStorage.getItem("teacherEmail");
    if (document.getElementById("teacherName")) document.getElementById("teacherName").innerText = teacherName || "Teacher";
    if (document.getElementById("teacherEmail")) document.getElementById("teacherEmail").innerText = teacherEmail || "Not Available";

    // Load teacher notes if saved
    if (localStorage.getItem("teacherNotes") && document.getElementById("notesText")) {
        document.getElementById("notesText").value = localStorage.getItem("teacherNotes");
    }

    // Load student feedback if saved
    if (localStorage.getItem("studentFeedback") && document.getElementById("feedbackText")) {
        document.getElementById("feedbackText").value = localStorage.getItem("studentFeedback");
    }
});
