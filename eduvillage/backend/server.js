const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "eduvillage"
});

db.connect(err => {
    if (err) console.log("❌ DB Error:", err);
    else console.log("✅ MySQL Connected");
});

// =====================================================
// ================= STUDENT REGISTER ==================
// =====================================================
app.post("/student/register", async (req, res) => {
    const { name, email, password, education, field } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO student (name, email, password, education, field) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, education, field],
            (err) => {
                if (err) return res.json({ success: false, message: "Student already exists" });
                res.json({ success: true, message: "Student registered successfully" });
            }
        );
    } catch {
        res.json({ success: false, message: "Server error" });
    }
});

// =====================================================
// ================= STUDENT LOGIN =====================
// =====================================================
app.post("/student/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM student WHERE email = ?", [email], async (err, result) => {
        if (err || result.length === 0)
            return res.json({ success: false, message: "Student not found" });

        const match = await bcrypt.compare(password, result[0].password);
        if (!match)
            return res.json({ success: false, message: "Wrong password" });

        res.json({
            success: true,
            student: {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email
            }
        });
    });
});

// =====================================================
// =========== SAVE STUDENT SELECTED COURSES ===========
// =====================================================
app.post("/student/courses", (req, res) => {
    const { student_id, courses } = req.body;

    console.log("Incoming enrollment:", student_id, courses);

    if (!courses || courses.length === 0)
        return res.json({ success: false, message: "No courses received" });

    db.query("DELETE FROM student_courses WHERE student_id = ?", [student_id], (delErr) => {
        if (delErr) {
            console.log("Delete Error:", delErr);
            return res.json({ success: false, message: "Delete failed" });
        }

        const values = courses.map(course => [student_id, course]);

        db.query(
            "INSERT INTO student_courses (student_id, course_name) VALUES ?",
            [values],
            (err) => {
                if (err) {
                    console.log("Insert Error:", err);  // 👈 THIS WILL SHOW REAL PROBLEM
                    return res.json({ success: false, message: "Insert failed" });
                }
                console.log("Enrollment saved!");
                res.json({ success: true });
            }
        );
    });
});

// =====================================================
// ===== GET ASSIGNMENTS FOR LOGGED-IN STUDENT =========
// =====================================================
app.get("/student/assignments/:studentId", (req, res) => {
    const studentId = req.params.studentId;

    db.query(
        `SELECT a.title, a.description, a.course_name, a.teacher_name
         FROM assignments a
         JOIN student_courses sc ON a.course_name = sc.course_name
         WHERE sc.student_id = ?
         ORDER BY a.id DESC`,
        [studentId],
        (err, result) => {
            if (err) return res.json({ success: false });
            res.json({ success: true, assignments: result });
        }
    );
});

// =====================================================
// ================= TEACHER REGISTER ==================
// =====================================================
app.post("/teacher/register", async (req, res) => {
    const { name, email, password, subject } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO teacher (name, email, password, subject) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, subject],
            (err) => {
                if (err) return res.json({ success: false, message: "Teacher already exists" });
                res.json({ success: true, message: "Teacher registered successfully" });
            }
        );
    } catch {
        res.json({ success: false, message: "Server error" });
    }
});

// =====================================================
// ================= TEACHER LOGIN =====================
// =====================================================
app.post("/teacher/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM teacher WHERE email = ?", [email], async (err, result) => {
        if (err || result.length === 0)
            return res.json({ success: false, message: "Teacher not found" });

        const match = await bcrypt.compare(password, result[0].password);
        if (!match)
            return res.json({ success: false, message: "Wrong password" });

        res.json({
            success: true,
            name: result[0].name,
            email: result[0].email
        });
    });
});

// =====================================================
// ================= COURSES ===========================
// =====================================================
app.post("/course/add", (req, res) => {
    db.query("INSERT INTO courses (course_name) VALUES (?)",
        [req.body.course_name],
        err => res.json({ success: !err })
    );
});

app.get("/courses", (req, res) => {
    db.query("SELECT * FROM courses", (err, result) =>
        res.json({ success: !err, courses: result })
    );
});

// =====================================================
// ================= ASSIGNMENTS =======================
// =====================================================
app.post("/assignment/add", (req, res) => {
    const { title, description, course_name, teacher_name } = req.body;

    db.query(
        "INSERT INTO assignments (title, description, course_name, teacher_name) VALUES (?, ?, ?, ?)",
        [title, description, course_name, teacher_name],
        err => res.json({ success: !err })
    );
});

app.get("/assignments/:teacherName", (req, res) => {
    db.query("SELECT * FROM assignments WHERE teacher_name = ?",
        [req.params.teacherName],
        (err, result) => res.json({ success: !err, assignments: result })
    );
});

// =====================================================
// ================= NOTES =============================
// =====================================================
app.post("/notes", (req, res) => {
    const { teacherName, content } = req.body;

    db.query(
        "INSERT INTO notes (teacher_name, content) VALUES (?, ?)",
        [teacherName, content],
        err => res.json({ success: !err })
    );
});

app.get("/notes", (req, res) => {
    db.query(
        "SELECT teacher_name, content, created_at FROM notes ORDER BY created_at DESC",
        (err, result) => res.json({ success: !err, notes: result })
    );
});


// =====================================================
// ========== 🆕 GET STUDENTS BY COURSE =================
// =====================================================
app.get("/course/students/:courseName", (req, res) => {
    const courseName = req.params.courseName;

    db.query(
        `SELECT s.id, s.name, s.email, s.education, s.field
         FROM student s
         JOIN student_courses sc ON s.id = sc.student_id
         WHERE sc.course_name = ?`,
        [courseName],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ success: false });
            }
            res.json({ success: true, students: result });
        }
    );
});


// ================= START SERVER ======================
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
