// ================== API BASE URL ==================
const API_BASE_URL = "https://edr-idsk.onrender.com";

// ================== SHOW LOGIN FORMS ==================
function showLoginForm(type) {
    const studentForm = document.getElementById("student-form");
    const teacherForm = document.getElementById("teacher-form");

    if (!studentForm || !teacherForm) return;

    studentForm.classList.remove("active");
    teacherForm.classList.remove("active");

    if (type === "student") {
        studentForm.classList.add("active");
    } else {
        teacherForm.classList.add("active");
    }
}

// ================== PASSWORD TOGGLE ==================
function togglePassword(id) {
    const input = document.getElementById(id);
    if (!input) return;
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

    const res = await fetch(`${API_BASE_URL}/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("studentName", data.student.name);
        localStorage.setItem("studentEmail", data.student.email);
        window.location.href = "student.html";
    } else {
        alert(data.message);
    }
}

// ================== TEACHER LOGIN ==================
async function teacherLogin() {
    const email = document.getElementById("tEmail").value;
    const password = document.getElementById("tPass").value;

    const res = await fetch(`${API_BASE_URL}/teacher/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("teacherName", data.teacher.name);
        localStorage.setItem("teacherEmail", data.teacher.email);
        localStorage.setItem("teacherId", data.teacher.id);
        window.location.href = "teacher.html";
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

    const res = await fetch(`${API_BASE_URL}/student/register`, {
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

    const res = await fetch(`${API_BASE_URL}/teacher/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);
}

// ================== LOAD NOTES (STUDENT) ==================
async function loadNotesForStudent() {
    const email = localStorage.getItem("studentEmail");
    if (!email) return;

    const res = await fetch(`${API_BASE_URL}/notes/student/${email}`);
    const data = await res.json();

    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    if (!data.success || data.notes.length === 0) {
        notesContainer.innerHTML = "<p>No notes available</p>";
        return;
    }

    data.notes.forEach(note => {
        const div = document.createElement("div");
        div.className = "note-card";
        div.innerHTML = `
            <h4>${note.course_name}</h4>
            <p>${note.content}</p>
            <small>By ${note.teacher_name}</small><br>
            <small>${new Date(note.created_at).toLocaleString()}</small>
        `;
        notesContainer.appendChild(div);
    });
}

// ================== LOAD ASSIGNMENTS ==================
async function loadAssignments() {
    const email = localStorage.getItem("studentEmail");
    if (!email) return;

    const res = await fetch(`${API_BASE_URL}/assignments/student/${email}`);
    const data = await res.json();

    const ul = document.getElementById("assignmentList");
    ul.innerHTML = "";

    if (data.success && data.assignments.length > 0) {
        data.assignments.forEach(a => {
            const li = document.createElement("li");
            li.innerHTML = `
                <b>${a.title}</b><br>
                ${a.description || ""}<br>
                <small>Course: ${a.course_name}</small><br>
                <small>Teacher: ${a.teacher_name}</small>
                <hr>
            `;
            ul.appendChild(li);
        });
    } else {
        ul.innerHTML = "<li>No assignments available</li>";
    }
}