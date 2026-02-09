const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect(err => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected");
  }
});

/* ================= SERVE FRONTEND ================= */
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= STUDENT REGISTER ================= */
app.post("/student/register", async (req, res) => {
  let { name, email, password, education, field } = req.body;

  if (!name || !email || !password || !education || !field) {
    return res.json({ success: false, message: "All fields required" });
  }

  db.query(
    "SELECT id FROM student WHERE email = ?",
    [email],
    async (err, result) => {
      if (result.length > 0) {
        return res.json({ success: false, message: "Student already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO student (name, email, password, education, field) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, education, field],
        err => {
          if (err) return res.json({ success: false });
          res.json({ success: true });
        }
      );
    }
  );
});

/* ================= STUDENT LOGIN ================= */
app.post("/student/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM student WHERE email = ?",
    [email],
    async (err, result) => {
      if (result.length === 0) return res.json({ success: false });

      const match = await bcrypt.compare(password, result[0].password);
      if (!match) return res.json({ success: false });

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

/* ================= TEACHER LOGIN ================= */
app.post("/teacher/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM teacher WHERE email = ?",
    [email],
    async (err, result) => {
      if (result.length === 0) {
        return res.json({ success: false, message: "Teacher not found" });
      }

      const match = await bcrypt.compare(password, result[0].password);
      if (!match) {
        return res.json({ success: false, message: "Invalid password" });
      }

      res.json({
        success: true,
        teacher: {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email
        }
      });
    }
  );
});

/* ================= NOTES (STUDENT) ================= */
app.get("/notes/student/:email", (req, res) => {
  const email = req.params.email;

  const sql = `
    SELECT n.content, c.course_name, t.name AS teacher_name, n.created_at
    FROM notes n
    JOIN courses c ON n.course_id = c.id
    JOIN teacher t ON n.teacher_id = t.id
    JOIN student_courses sc ON sc.course_id = c.id
    JOIN student s ON sc.student_id = s.id
    WHERE s.email = ?
    ORDER BY n.created_at DESC
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, notes: result });
  });
});

/* ================= ASSIGNMENTS ================= */
app.get("/assignments/student/:email", (req, res) => {
  const email = req.params.email;

  const sql = `
    SELECT a.title, a.description, c.course_name, t.name AS teacher_name
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    JOIN teacher t ON c.teacher_id = t.id
    JOIN student_courses sc ON sc.course_id = c.id
    JOIN student s ON sc.student_id = s.id
    WHERE s.email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, assignments: result });
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
 