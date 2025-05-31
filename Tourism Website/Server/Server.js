const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
app.use(express.json());

app.set('trust proxy', 1); // trust first proxy

// CORS configuration
const allowedOrigins = ['http://127.0.0.1:5501', 'http://localhost:5501', 'http://localhost:3000'];

const corsOptions = {
  origin: function(origin, callback) {
    console.log('CORS origin:', origin); // Log origin for debugging
    if (!origin) return callback(null, true); // Allow non-browser requests like Postman or curl
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT',
  allowedHeaders: 'Content-Type',
  credentials: true
};

app.use(cors(corsOptions));  // Use custom CORS configuration

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  // Use default cookie name 'connect.sid' for compatibility
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'none', // Allow cross-origin cookies for localhost testing
    httpOnly: true
  }
}));

// Middleware to log Set-Cookie header for debugging
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      console.log('Set-Cookie header:', value);
    }
    originalSetHeader.apply(this, arguments);
  };
  next();
});

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
    console.log('Login attempt with credentials:', { email: email });
    console.log('Hashed password from DB:', user.password);
    console.log('Login time:', new Date().toISOString());

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Store user ID in session
    req.session.userId = user.id;

    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      console.log('Session saved, user ID:', req.session.userId); // ✅ New helpful log
      return res.status(200).json({ message: 'Login successful', name: user.name, surname: user.surname });
    });
  });
});

// User profile route
app.get('/user/profile', (req, res) => {
  console.log('GET /user/profile called, session userId:', req.session.userId);
  console.log('Request cookies:', req.headers.cookie); // Log cookies for debugging
  if (!req.session.userId) {
    console.log('Unauthorized access to /user/profile');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sql = 'SELECT name, surname, age, gender, phone, email, country, marital_status, next_of_kin FROM users WHERE id = ?';
  db.query(sql, [req.session.userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    return res.status(200).json(user);
  });
});

// User profile update route
app.put('/user/profile/update', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, surname, age, gender, phone, email, country, marital_status, next_of_kin, password } = req.body;

  if (!name || !surname || !email) {
    return res.status(400).json({ message: 'Name, surname, and email are required.' });
  }

  try {
    let hashedPassword = null;
    if (password && password.trim() !== '') {
      const bcrypt = require('bcrypt');
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let updateSql;
    let values;

    if (hashedPassword) {
      updateSql = `
        UPDATE users SET name = ?, surname = ?, age = ?, gender = ?, phone = ?, email = ?, country = ?, marital_status = ?, next_of_kin = ?, password = ? WHERE id = ?
      `;
      values = [name, surname, age, gender, phone, email, country, marital_status, next_of_kin, hashedPassword, req.session.userId];
    } else {
      updateSql = `
        UPDATE users SET name = ?, surname = ?, age = ?, gender = ?, phone = ?, email = ?, country = ?, marital_status = ?, next_of_kin = ? WHERE id = ?
      `;
      values = [name, surname, age, gender, phone, email, country, marital_status, next_of_kin, req.session.userId];
    }

    db.query(updateSql, values, (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: 'Update failed' });
      }
      return res.status(200).json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Update error:', error);console.log('CORS configuration loaded');
console.log('Middleware loaded');
console.log('Session middleware loaded');
console.log('Database connection established');
console.log('Register route loaded');
console.log('Login route loaded');
console.log('User profile route loaded');
console.log('User profile update route loaded');
console.log('Logout route loaded');
    return res.status(500).json({ message: 'Server error' });
  }
});

//Logout Implementation
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('user_sid');
    console.log("User logged out");
    // Redirect to index.html after logout
    res.redirect('../Home-Page/index.html');
  });
});


// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});