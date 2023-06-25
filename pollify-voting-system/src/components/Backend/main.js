const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const MongoStore = require('connect-mongo');

const app = express();
app.use(cors());

  // Connect to MongoDB
mongoose.connect('mongodb+srv://react:pkLRMpF9F5zcajaU@internship.djlbzpr.mongodb.net/Project?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

  // Define the User schema
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Middleware function to check if the user is logged in
  const isLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
      next(); // User is logged in, proceed to the next middleware
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };
  
  // API endpoint to create an account
  app.post('/api/create-account', async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.json({ success: false, message: 'Username is already taken.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        firstName,
        lastName,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      req.session.loggedIn = true;
      req.session.user = newUser;
  
      res.json({ success: true, message: 'Account created successfully.', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create account.' });
    }
  });
  
  // API endpoint for user login
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        req.session.loggedIn = true;
        req.session.user = user;
        return res.status(200).json({ success: true, message: 'Login successful', user });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
  });
  
  // API endpoint for user logout
  app.post('/api/logout', (req, res) => {
    req.session.destroy();
  
    return res.status(200).json({ success: true, message: 'Logout successful' });
  });
  // Define the poll schema
const pollSchema = new mongoose.Schema({
    pollId: String,
    question: String,
    options: [String],
    expiryDate: Date,
  });
  
  // Create the poll model
  const Poll = mongoose.model('Poll', pollSchema);
  
  // API endpoint to create a poll (protected route)
  app.post('/api/create-poll', isLoggedIn, async (req, res) => {
    const { question, options, expiryDate, pollId } = req.body;
  
    try {
      const poll = new Poll({
        pollId,
        question,
        options,
        expiryDate,
      });
  
      await poll.save();
  
      res.json({ success: true, message: 'Poll created successfully.', pollId });
    } catch (error) {
      console.error('Failed to create poll:', error);
      res.status(500).json({ success: false, message: 'Failed to create poll.' });
    }
  });
  // Start the server
app.listen(5000, () => {
    console.log('Server started on port 5000');
  });
  