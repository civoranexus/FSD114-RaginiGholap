const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Temporary storage (we will replace with DB later)
const users = [];

// Home route
app.get('/', (req, res) => {
  res.send('EduVillage Backend Server is Running');
});

// Register API
app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Encrypt password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Save user
  users.push({
    name,
    email,
    password: hashedPassword,
    role
  });

  res.json({ message: 'Registration successful' });
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  res.json({
    message: 'Login successful',
    role: user.role
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
