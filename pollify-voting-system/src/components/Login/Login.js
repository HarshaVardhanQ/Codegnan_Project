import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    // Check if a user is already logged in
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    localStorage.removeItem('loggedInUser');
    setLoggedInUser('');
    // Send logout request to the server
    axios
      .post('http://localhost:5000/api/logout')
      .then(() => {
        console.log('Logout successful');
      })
      .catch((error) => {
        console.error('An error occurred during logout');
        console.error(error);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setError('');
          console.log('Login successful');
          // Store the logged-in user in local storage
          localStorage.setItem('loggedInUser', username);
          setLoggedInUser(username);
        } else {
          setError('Invalid username or password. Please try again or create a new account.');
        }
      } else {
        setError('An error occurred during login');
      }
    } catch (error) {
      setError('Invalid username or password. Please try again or create a new account.');
      console.error(error);
    }
  };

  const handleCreateAccount = () => {
    // Add your code here to navigate to the Create Account page or perform the desired action for creating an account
    window.location.href = `/SignUp`;
  };

  const handleCreatePoll = () => {
    // Add your code here to navigate to the Create Poll page or perform the desired action for creating a poll
    window.location.href = `/CreatePolls?loggedIn=${loggedInUser ? 'true' : 'false'}&username=${loggedInUser}`;
  };

  return (
    <div className="log-container">
      {loggedInUser ? (
        <>
          <h2>Welcome, {loggedInUser}!</h2>
          <button className="log-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="log-btn" onClick={handleCreatePoll}>
            Create Poll
          </button>
        </>
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="log-form-group">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="log-form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            {error && <p className="log-error">{error}</p>}
            <button className="log-btn" type="submit">
              Login
            </button>
          </form>
          <p className="log-info">Don't have an account? <a href="/SignUp">Create one</a>.</p>
        </>
      )}
    </div>
  );
};

export default Login;
