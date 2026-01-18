alert("JS connected");

// ================== SHOW LOGIN FORMS ==================
function showLoginForm(type) {
    document.getElementById("student-form").classList.remove("active");
    document.getElementById("teacher-form").classList.remove("active");

    if (type === "student") {
        document.getElementById("student-form").classList.add("active");
    } else {
        document.getElementById("teacher-form").classList.add("active");
    }
}

// ================== PASSWORD TOGGLE ==================
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// ================== PAGE SWITCH ==================
function showRegisterPage() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("register-container").style.display = "block";
}

function showLoginPage() {
    document.getElementById("register-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
}

// ================== STUDENT LOGIN ==================
async function studentLogin() {
    const email = document.getElementById("sEmail").value;
    const password = document.getElementById("sPass").value;

    const res = await fetch("http://localhost:3000/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        // ✅ SAVE DATA
        localStorage.setItem("studentName", data.student.name);
        localStorage.setItem("studentEmail", data.student.email);

        alert("Student Login Successful");
        window.location.href = "student.html";
    } else {
        alert(data.message);
    }
}




// ================== TEACHER LOGIN ==================
async function teacherLogin() {
    const email = document.getElementById("tEmail").value;
    const password = document.getElementById("tPass").value;

    const res = await fetch("http://localhost:3000/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        // ✅ SAVE DATA
        localStorage.setItem("teacherName", data.name);
        localStorage.setItem("teacherEmail", data.email);

        alert("Teacher Login Successful");
        window.location.href = "teachers.html";
    } else {
        alert(data.message);
    }
}




// ================== STUDENT REGISTER ==================
async function registerStudent() {
    const body = {
        name: document.getElementById("sName").value,
        email: document.getElementById("sRegEmail").value,
        password: document.getElementById("sRegPass").value,
        education: document.getElementById("sEducation").value,
        field: document.getElementById("sField").value
    };

    const res = await fetch("http://localhost:3000/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);
}

// ================== TEACHER REGISTER ==================
async function registerTeacher() {
    const body = {
        name: document.getElementById("tName").value,
        email: document.getElementById("tRegEmail").value,
        password: document.getElementById("tRegPass").value,
        subject: document.getElementById("tSubject").value
    };

    const res = await fetch("http://localhost:3000/teacher/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);
}
// ================= REGISTER TAB SWITCH =================
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form-container");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // remove active from all tabs
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // hide all forms
        forms.forEach(form => form.classList.remove("active"));

        // show selected form
        const target = tab.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");
    });
});


