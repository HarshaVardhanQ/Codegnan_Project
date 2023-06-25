import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const usernameAvailabilityResponse = await checkUsernameAvailability(username);
      if (!usernameAvailabilityResponse.available) {
        setError('Username is already taken. Please choose a different username.');
        return;
      }

      const createAccountResponse = await createAccount({
        username,
        firstName,
        lastName,
        password
      });

      if (createAccountResponse.success) {
        console.log('Account created successfully');
        alert('Registration successful! Please log in with your new account.'); // Display an alert message
        navigate('/login'); // Redirect to the login page
      } else {
        setError(createAccountResponse.message || 'Failed to create account.');
      }
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error(error);
    }
  };

  const checkUsernameAvailability = async (username) => {
    const response = await fetch('http://localhost:5000/api/check-username-availability', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check username availability.');
    }

    return response.json();
  };

  const createAccount = async (accountData) => {
    const response = await fetch('http://localhost:5000/api/create-account', {
      method: 'POST',
      body: JSON.stringify(accountData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create account.');
    }

    return response.json();
  };

  return (
    <div className="Background4">
      <div className="container">
        <div>
          <h2>Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={firstName}
                onChange={handleFirstNameChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={lastName}
                onChange={handleLastNameChange}
                required
              />
            </div>
            <div className="form-group">
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
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <input type="submit" value="Register" className="btn" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
