// ================== STUDENT LOGIN ==================
async function studentLogin() {
  const email = document.getElementById("sEmail").value;
  const password = document.getElementById("sPass").value;

  const res = await fetch("/student/login", {
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
    alert("Invalid login");
  }
}

// ================== TEACHER LOGIN ==================
async function teacherLogin() {
  const email = document.getElementById("tEmail").value;
  const password = document.getElementById("tPass").value;

  const res = await fetch("/teacher/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("teacherId", data.teacher.id);
    localStorage.setItem("teacherName", data.teacher.name);
    window.location.href = "teacher.html";
  } else {
    alert(data.message);
  }
}

// ================== STUDENT REGISTER ==================
async function registerStudent() {
  const body = {
    name: sName.value,
    email: sRegEmail.value,
    password: sRegPass.value,
    education: sEducation.value,
    field: sField.value
  };

  const res = await fetch("/student/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.success ? "Registered" : "Failed");
}

// ================== LOAD NOTES ==================
async function loadNotesForStudent() {
  const email = localStorage.getItem("studentEmail");

  const res = await fetch(`/notes/student/${email}`);
  const data = await res.json();

  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  if (!data.success) return;

  data.notes.forEach(note => {
    container.innerHTML += `
      <div>
        <h4>${note.course_name}</h4>
        <p>${note.content}</p>
        <small>${note.teacher_name}</small>
      </div>
    `;
  });
}

// ================== LOAD ASSIGNMENTS ==================
async function loadAssignments() {
  const email = localStorage.getItem("studentEmail");

  const res = await fetch(`/assignments/student/${email}`);
  const data = await res.json();

  const ul = document.getElementById("assignmentList");
  ul.innerHTML = "";

  if (!data.success) return;

  data.assignments.forEach(a => {
    ul.innerHTML += `
      <li>
        <b>${a.title}</b><br>
        ${a.description}<br>
        <small>${a.course_name}</small>
      </li>
    `;
  });
}
 