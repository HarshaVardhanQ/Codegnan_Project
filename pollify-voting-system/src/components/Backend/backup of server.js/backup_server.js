const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Configure session middleware
app.use(
  session({
    secret: 'Sccder',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://react:pkLRMpF9F5zcajaU@internship.djlbzpr.mongodb.net/Project?retryWrites=true&w=majority',
    }),
  })
);

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
  username: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// API endpoint to check username availability
app.post('/api/check-username-availability', async (req, res) => {
  const { username } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    res.json({ available: !existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check username availability.' });
  }
});

// API endpoint to create an account
app.post('/api/create-account', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username is already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, firstName, lastName, password: hashedPassword });
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

const pollSchema = new mongoose.Schema({
  pollId: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  expiryDate: { type: Date, required: true },
  user: { type: String, required: true },
  optionsVotes: { type: [Number], default: 0 }, // Array to store the vote count for each option
});

const Poll = mongoose.model('Poll', pollSchema);

// Store the polls in memory (replace with a database in production)
const users = {};

app.post('/api/create-poll', async (req, res) => {
  try {
    const { pollId, question, options, expiryDate, user } = req.body;

    // Validate the request payload
    if (!pollId || !question || !options || !expiryDate || !user) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Assuming you have a database model named "Poll" (e.g., using Mongoose)
    // Create the poll object
    const poll = new Poll({
      pollId,
      question,
      options,
      expiryDate,
      user,
      optionsVotes: new Array(options.length).fill(0) // Initialize optionsVotes with 0 votes for each option
    });

    // Save the poll object to the database
    await poll.save();

    // Send the response
    return res.status(200).json({ success: true, message: 'Poll created successfully' });
  } catch (error) {
    console.error(error);

    // Check if the error is an Axios error
    if (error.isAxiosError) {
      // Access the error response details
      const { status, data } = error.response;
      console.error(`Request failed with status code ${status}`);
      console.error(data); // This will log the error response data from the server
    }

    return res.status(500).json({ success: false, message: 'An error occurred while creating the poll' });
  }
});


  app.get('/api/polls/:pollId', async (req, res) => {
    const pollId = req.params.pollId;

    try {
      const poll = await Poll.findOne({ pollId }).populate('user');

      if (!poll) {
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }

      // Check if the poll has expired
      if (new Date(poll.expiryDate) < new Date()) {
        return res.status(400).json({ success: false, message: 'Poll has expired' });
      }

      // Return the poll details with the username of the poll creator
      return res.status(200).json({
        success: true,
        poll: {
          pollId: poll.pollId,
          question: poll.question,
          options: poll.options,
          expiryDate: poll.expiryDate,
          user: poll.user.username,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching poll details' });
    }
  });


// API endpoint for fetching polls
app.get('/api/polls', async (req, res) => {
  try {
    // Fetch all the polls from the database
    const polls = await Poll.find();

    // Send the polls as a response
    return res.status(200).json({ success: true, polls });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ success: false, message: 'An error occurred while fetching polls' });
  }
});

// API endpoint for fetching user polls
app.get('/api/user-polls/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the polls associated with the user
    const userPolls = await Poll.find({ user: username });

    // Send the user polls as a response
    return res.status(200).json({ success: true, polls: userPolls });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ success: false, message: 'An error occurred while fetching user polls' });
  }
});


// Endpoint to get poll details
app.get('/api/polls/:pollId', async (req, res) => {
  const pollId = req.params.pollId;

  try {
    const poll = await Poll.findOne({ pollId });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.status(200).json({ poll });
  } catch (error) {
    console.error('An error occurred while fetching poll details');
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch poll details. Please try again later.' });
  }
});

// Endpoint to submit a vote
app.post('/api/polls/:pollId/vote', async (req, res) => {
  const pollId = req.params.pollId;
  const option = req.body.option;

  try {
    const poll = await Poll.findOne({ pollId });

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const optionIndex = poll.options.findIndex((opt) => opt === option);
    if (optionIndex === -1) {
      return res.status(400).json({ error: 'Invalid option' });
    }

    poll.optionsVotes[optionIndex] += 1;

    await poll.save();

    res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('An error occurred while submitting the vote');
    console.error(error);
    res.status(500).json({ error: 'Failed to submit the vote. Please try again later.' });
  }
});




// API endpoint for user logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// API endpoint to check login status
app.get('/api/checkLoginStatus', (req, res) => {
  const loggedIn = req.session.loggedIn || false;
  res.json({ loggedIn });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



