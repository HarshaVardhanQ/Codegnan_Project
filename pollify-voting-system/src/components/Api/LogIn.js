// Import required dependencies and setup database connection
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Assuming you have a separate file for database operations

const app = express();
app.use(bodyParser.json());

// Route handler for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Retrieve user data from the database
  const user = db.getUserByUsername(username);

  // Check if user exists and validate credentials
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  // Return success response
  return res.json({ success: true, message: 'Login successful' });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
