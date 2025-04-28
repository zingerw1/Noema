const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://127.0.0.1:5500',  // Allow requests from your frontend
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
};
app.use(cors(corsOptions));  // Use custom CORS configuration

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // your db username
  password: '',        // your db password
  database: 'user'     // your db name
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    console.log('Received data:', req.body);

    const { name, surname, age, gender, phone, email, country, marital_status, next_of_kin, password } = req.body;

    // Validate required fields
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if email already exists
    const checkEmailSql = `SELECT * FROM users WHERE email = ?`;
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length > 0) {
        // Email already exists
        return res.status(400).json({ message: 'Email already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into database
      const insertSql = `
        INSERT INTO users
        (name, surname, age, gender, phone, email, country, marital_status, next_of_kin, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [name, surname, age, gender, phone, email, country, marital_status, next_of_kin, hashedPassword];

      db.query(insertSql, values, (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Registration failed' });
        }
        console.log('User registered:', result);
        return res.status(200).json({ message: 'Registration successful' });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
