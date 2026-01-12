// ---------- UI PAGE CONTROL ----------
function showLoginForm(type) {
    document.getElementById("student-form").classList.remove("active");
    document.getElementById("teacher-form").classList.remove("active");
    if (type === "student") document.getElementById("student-form").classList.add("active");
    else document.getElementById("teacher-form").classList.add("active");
}
function togglePassword(id) {
    const passInput = document.getElementById(id);
    passInput.type = passInput.type === "password" ? "text" : "password";
}
function showRegisterPage() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("register-container").style.display = "block";
}
function showLoginPage() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("register-container").style.display = "none";
}

// ---------- TAB SWITCH ----------
const tabs = document.querySelectorAll(".tab");
const forms = document.querySelectorAll(".form-container");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.getAttribute("data-tab");
        forms.forEach(f => {
            f.id === target ? f.classList.add("active") : f.classList.remove("active");
        });
    });
});

// ---------- REGISTER ----------
async function registerStudent() {
    const name = document.getElementById("sName").value.trim();
    const email = document.getElementById("sRegEmail").value.trim();
    const password = document.getElementById("sRegPass").value.trim();
    const education = document.getElementById("sEducation").value.trim();
    const field = document.getElementById("sField").value.trim();

    if (!name || !email || !password || !education || !field) {
        alert("Please fill all fields"); 
        return; 
    }

    try {
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username: email, 
                password, 
                fullName: name, 
                role: "student",
                educationLevel: education,
                fieldOfStudy: field
            })
        });
        const data = await res.json();
        alert(data.message);
        if (data.message === "Registration successful") showLoginPage();
    } catch(err) {
        console.error(err);
        alert("Server error");
    }
}


async function registerTeacher() {
    const name = document.getElementById("tName").value.trim();
    const email = document.getElementById("tRegEmail").value.trim();
    const password = document.getElementById("tRegPass").value.trim();
    const subject = document.getElementById("tSubject").value.trim();

    if(!name || !email || !password || !subject){ alert("Fill all fields"); return;}

    try {
        const res = await fetch("http://localhost:3000/register", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username: email, password, role:"teacher", fullName: name, education: subject, field:""})
        });
        const data = await res.json();
        alert(data.message);
        if(data.message==="Registration successful") showLoginPage();
    } catch(err){ console.error(err); alert("Server error"); }
}

// ---------- LOGIN ----------
async function studentLogin(){
    const email = document.getElementById("sEmail").value.trim();
    const password = document.getElementById("sPass").value.trim();
    if(!email || !password){ alert("Enter email & password"); return;}
    try {
        const res = await fetch("http://localhost:3000/login", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username: email, password, role:"student"})
        });
        const data = await res.json();
        if(data.user){
            localStorage.setItem("studentName", data.user.fullName);
            localStorage.setItem("studentEmail", data.user.username);
            localStorage.setItem("studentEducation", data.user.education);
            localStorage.setItem("studentField", data.user.field);
            window.location.href="student.html";
        } else { alert(data.message || "Invalid credentials"); }
    } catch(err){ console.error(err); alert("Server error"); }
}

async function teacherLogin(){
    const email = document.getElementById("tEmail").value.trim();
    const password = document.getElementById("tPass").value.trim();
    if(!email || !password){ alert("Enter email & password"); return;}
    try {
        const res = await fetch("http://localhost:3000/login", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username: email, password, role:"teacher"})
        });
        const data = await res.json();
        if(data.user){
            localStorage.setItem("teacherName", data.user.fullName);
            localStorage.setItem("teacherEmail", data.user.username);
            window.location.href="teachers.html";
        } else { alert(data.message || "Invalid credentials"); }
    } catch(err){ console.error(err); alert("Server error"); }
}
