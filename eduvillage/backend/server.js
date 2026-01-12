// ---------------- server.js ----------------
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- MySQL Connection ----------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",        // <-- your MySQL root password
  database: "eduvillage"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
  } else {
    console.log("✅ MySQL connected!");
  }
});

// ---------- REGISTER ----------
app.post("/register", async (req, res) => {
  const { role, fullName, username, password, educationLevel, fieldOfStudy, subjectExpertise } = req.body;

  if (!role || !fullName || !username || !password) {
    return res.status(400).json({ message: "All required fields must be provided!" });
  }

  try {
    // Check if user exists in correct table
    const table = role === "student" ? "student" : "teacher";
    db.query(`SELECT * FROM ${table} WHERE username = ?`, [username], async (err, results) => {
      if (err) {
        console.error("❌ SELECT Error:", err);
        return res.status(500).json({ message: "Database error during select" });
      }

      if (results.length > 0) {
        return res.json({ message: "User already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Build insert query dynamically
      let insertQuery = "";
      let values = [];

      if (role === "student") {
        insertQuery = `INSERT INTO student (fullName, username, password, educationLevel, fieldOfStudy) VALUES (?, ?, ?, ?, ?)`;
        values = [fullName, username, hashedPassword, educationLevel || "", fieldOfStudy || ""];
      } else {
        insertQuery = `INSERT INTO teacher (fullName, username, password, subjectExpertise) VALUES (?, ?, ?, ?)`;
        values = [fullName, username, hashedPassword, subjectExpertise || ""];
      }

      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error("❌ INSERT Error:", err);
          return res.status(500).json({ message: "Database error during insert" });
        }
        res.json({ message: "Registration successful" });
      });
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { role, username, password } = req.body;

  if (!role || !username || !password) {
    return res.status(400).json({ message: "All required fields must be provided!" });
  }

  const table = role === "student" ? "student" : "teacher";

  db.query(`SELECT * FROM ${table} WHERE username = ?`, [username], async (err, results) => {
    if (err) {
      console.error("❌ SELECT Error:", err);
      return res.status(500).json({ message: "Database error during login" });
    }

    if (results.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        fullName: user.fullName,
        role: role
      }
    });
  });
});

// ---------- GET ALL STUDENTS (for teacher dashboard) ----------
app.get("/getStudents", (req, res) => {
  db.query("SELECT * FROM student", (err, results) => {
    if (err) {
      console.error("❌ SELECT students Error:", err);
      return res.status(500).json({ message: "Database error fetching students" });
    }
    res.json({ students: results });
  });
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
