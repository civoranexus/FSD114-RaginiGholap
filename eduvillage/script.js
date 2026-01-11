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
async function registerStudent() {
    const name = document.getElementById("sName").value.trim();
    const email = document.getElementById("sRegEmail").value.trim();
    const password = document.getElementById("sRegPass").value.trim();
    if (!name || !email || !password) { alert("Please fill all fields"); return; }

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password, fullName: name, role: "student" })
        });
        const data = await res.json();
        alert(data.message);
        if(data.message === "Registration successful") showLoginPage();
    } catch(err) {
        console.error(err);
        alert("Server error");
    }
}

async function registerTeacher() {
    const name = document.getElementById("tName").value.trim();
    const email = document.getElementById("tRegEmail").value.trim();
    const password = document.getElementById("tRegPass").value.trim();
    if (!name || !email || !password) { alert("Please fill all fields"); return; }

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password, fullName: name, role: "teacher" })
        });
        const data = await res.json();
        alert(data.message);
        if(data.message === "Registration successful") showLoginPage();
    } catch(err) {
        console.error(err);
        alert("Server error");
    }
}

// ---------- LOGIN FUNCTIONS ----------
async function studentLogin() {
    const email = document.getElementById("sEmail").value.trim();
    const password = document.getElementById("sPass").value.trim();
    if (!email || !password) { alert("Please enter email and password"); return; }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password, role: "student" })
        });
        const data = await res.json();
        if(data.user) {
            localStorage.setItem("studentName", data.user.fullName);
            localStorage.setItem("studentEmail", data.user.username);
            window.location.href = "student.html";
        } else {
            alert(data.message || "Invalid credentials");
        }
    } catch(err) {
        console.error(err);
        alert("Server error");
    }
}

async function teacherLogin() {
    const email = document.getElementById("tEmail").value.trim();
    const password = document.getElementById("tPass").value.trim();
    if (!email || !password) { alert("Please enter email and password"); return; }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email, password, role: "teacher" })
        });
        const data = await res.json();
        if(data.user) {
            localStorage.setItem("teacherName", data.user.fullName);
            localStorage.setItem("teacherEmail", data.user.username);
            window.location.href = "teachers.html";
        } else {
            alert(data.message || "Invalid credentials");
        }
    } catch(err) {
        console.error(err);
        alert("Server error");
    }
}

// ---------- LOGOUT ----------
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ---------- DASHBOARD DATA LOADING ----------
window.addEventListener("DOMContentLoaded", () => {
    // Student Dashboard
    if (document.getElementById("studentName"))
        document.getElementById("studentName").innerText = localStorage.getItem("studentName") || "Student";
    if (document.getElementById("studentEmail"))
        document.getElementById("studentEmail").innerText = localStorage.getItem("studentEmail") || "Not Available";

    // Teacher Dashboard
    if (document.getElementById("teacherName"))
        document.getElementById("teacherName").innerText = localStorage.getItem("teacherName") || "Teacher";
    if (document.getElementById("teacherEmail"))
        document.getElementById("teacherEmail").innerText = localStorage.getItem("teacherEmail") || "Not Available";

    // Load notes/feedback
    if (localStorage.getItem("teacherNotes") && document.getElementById("notesText"))
        document.getElementById("notesText").value = localStorage.getItem("teacherNotes");

    if (localStorage.getItem("studentFeedback") && document.getElementById("feedbackText"))
        document.getElementById("feedbackText").value = localStorage.getItem("studentFeedback");
});
   
// ---------- LEADERBOARD ----------
function loadLeaderboard() {
    const list = document.getElementById("leaderboardList");
    if (!list) return;

    list.innerHTML = ""; // Clear old entries

    const studentName = localStorage.getItem("studentName") || "You";
    const score = localStorage.getItem("studentScore") || 90; // default score

    const li = document.createElement("li");
    li.innerText = `${studentName} – ${score}%`;
    list.appendChild(li);
}

// Call it when the page loads
window.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();
});

function loadStudents() {
    fetch("http://localhost:3000/getStudents")
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("studentList");
            ul.innerHTML = "";  // clear old items
            data.students.forEach(student => {
                const li = document.createElement("li");
                li.innerText = `${student.fullName} – ${student.course || "N/A"}`;
                ul.appendChild(li);
            });
        })
        .catch(err => console.error("Failed to list students:", err));
}


// Call this when teacher dashboard loads
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("studentList")) loadStudents();
});
