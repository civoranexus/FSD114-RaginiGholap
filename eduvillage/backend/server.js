const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory user storage with test users
const users = [
  { username: "student1@example.com", passwordHash: bcrypt.hashSync("student123", 10), role: "student" },
  { username: "teacher1@example.com", passwordHash: bcrypt.hashSync("teacher123", 10), role: "teacher" }
];

console.log("Initial test users:", users);

// ---------- REGISTER ----------
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.json({ message: "Fill all fields." });

  const exists = users.find(u => u.username === username && u.role === role);
  if (exists) return res.json({ message: "User already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash, role });
  console.log("Users after registration:", users);
  return res.json({ message: `${role} registered successfully!` });
});

// ---------- LOGIN ----------
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.json({ message: "Fill all fields." });

  const user = users.find(u => u.username === username && u.role === role);
  if (!user) return res.json({ message: "User not found." });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (isMatch) return res.json({ user: { username: user.username, role: user.role } });
  else return res.json({ message: "Wrong password." });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
