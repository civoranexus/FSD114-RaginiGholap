const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db"); // ✅ USE db.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ================= STUDENT REGISTER ================= */
app.post("/student/register", async (req, res) => {
  let { name, email, password, education, field } = req.body;

  name = name?.trim();
  email = email?.trim().toLowerCase();
  education = education?.trim();
  field = field?.trim();

  if (!name || !email || !password || !education || !field) {
    return res.json({ success: false, message: "All fields are required" });
  }

  db.query(
    "SELECT id FROM student WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.json({ success: false });

      if (result.length > 0) {
        return res.json({ success: false, message: "Student already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO student (name, email, password, education, field) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, education, field],
        (err) => {
          if (err) return res.json({ success: false });
          res.json({ success: true });
        }
      );
    }
  );
});

/* ================= STUDENT LOGIN ================= */
app.post("/student/login", (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  db.query(
    "SELECT * FROM student WHERE email = ?",
    [email],
    async (err, result) => {
      if (err || result.length === 0) {
        return res.json({ success: false });
      }

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

/* ================= TEACHER REGISTER ================= */
app.post("/teacher/register", async (req, res) => {
  let { name, email, password } = req.body;

  name = name?.trim();
  email = email?.trim().toLowerCase();

  if (!name || !email || !password) {
    return res.json({ success: false });
  }

  db.query(
    "SELECT id FROM teacher WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.json({ success: false });

      if (result.length > 0) {
        return res.json({ success: false });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO teacher (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) return res.json({ success: false });
          res.json({ success: true });
        }
      );
    }
  );
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});