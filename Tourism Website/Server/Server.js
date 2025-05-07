const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

// CORS configuration
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser requests like Postman or curl
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
  credentials: true
};
app.use(cors(corsOptions));  // Use custom CORS configuration

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'your-secret-key', // replace with a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set secure: true if using HTTPS
}));

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

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password.' });
  }

  // Relaxed email validation to accept all valid emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email must be a valid email address.' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Store user ID in session
    req.session.userId = user.id;

    console.log('Login success for user:', user);
    return res.status(200).json({ message: 'Login successful', name: user.name, surname: user.surname });
  });
});

// User profile route
app.get('/user/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = 'SELECT name, surname FROM users WHERE id = ?';
  db.query(sql, [req.session.userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    return res.status(200).json({ name: user.name, surname: user.surname });
  });
});

//Logout Implementation
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid');
    console.log("User logged out");
    // Redirect to index.html after logout
    res.redirect('../Home-Page/index.html');
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
