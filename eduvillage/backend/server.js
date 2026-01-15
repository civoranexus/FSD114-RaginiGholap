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
    if (err) {
        console.log("❌ DB Error:", err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

// ================= STUDENT REGISTER =================
app.post("/student/register", async (req, res) => {
    const { name, email, password, education, field } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO student (name, email, password, education, field) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, education, field],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: "Student already exists" });
                }
                res.json({ success: true, message: "Student registered successfully" });
            }
        );
    } catch (error) {
        res.json({ success: false, message: "Server error" });
    }
});

// ================= TEACHER REGISTER =================
app.post("/teacher/register", async (req, res) => {
    const { name, email, password, subject } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO teacher (name, email, password, subject) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, subject],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: "Teacher already exists" });
                }
                res.json({ success: true, message: "Teacher registered successfully" });
            }
        );
    } catch (error) {
        res.json({ success: false, message: "Server error" });
    }
});

// ================= STUDENT LOGIN =================
app.post("/student/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM student WHERE email = ?",
        [email],
        async (err, result) => {
            if (err || result.length === 0) {
                return res.json({ success: false, message: "Student not found" });
            }

            const match = await bcrypt.compare(password, result[0].password);
            if (!match) {
                return res.json({ success: false, message: "Wrong password" });
            }

            res.json({
                success: true,
                student: {
                  name: result[0].name,
                  email: result[0].email
                }
           });

        }
    );
});

// ================= TEACHER LOGIN =================
app.post("/teacher/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM teacher WHERE email = ?",
        [email],
        async (err, result) => {
            if (err || result.length === 0) {
                return res.json({ success: false, message: "Teacher not found" });
            }

            const match = await bcrypt.compare(password, result[0].password);
            if (!match) {
                return res.json({ success: false, message: "Wrong password" });
            }

            res.json({
                success: true,
                name: result[0].name,
                email: result[0].email
      });

        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
