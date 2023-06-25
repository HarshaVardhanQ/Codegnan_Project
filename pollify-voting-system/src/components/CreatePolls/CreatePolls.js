import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './createpolls.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CreatePolls() {
  const query = useQuery();
  const loggedInParam = query.get('loggedIn');
  const usernameParam = query.get('username');

  const [loggedIn, setLoggedIn] = useState(loggedInParam === 'true');
  const [username, setUsername] = useState(usernameParam);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryDateValid, setExpiryDateValid] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pollId, setPollId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    setExpiryDateValid(true);
    setError('');
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
    setError('');
  };

  const handleAddOption = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    setExpiryDateValid(true);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const generatePollId = () => {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min; // Generate a random 10-digit poll ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question) {
      setError('Please enter the question');
      return;
    }
    if (options.length < 2) {
      setError('Please enter at least two options');
      return;
    }
    if (!expiryDate) {
      setError('Please enter the expiry date');
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(expiryDate);

    if (selectedDate <= currentDate) {
      setError('Expiry date must be a future date');
      setExpiryDateValid(false);
      return;
    }

    try {
      const pollId = generatePollId();

      const response = await axios.post('http://localhost:5000/api/create-poll', {
        pollId,
        question,
        options,
        expiryDate,
        user: username,
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setPollId(pollId);
          setSuccessMessage('Poll created successfully');
          setQuestion('');
          setOptions(['', '']);
          setExpiryDate('');
          setError('');
        } else {
          setError('An error occurred while creating the poll');
        }
      } else {
        setError('An error occurred while creating the poll');
      }
    } catch (error) {
      setError('An error occurred while creating the poll');
      console.error(error);
    }
  };

  return (
    <div className="create-polls-container">
      {loggedIn ? (
        <>
          <h2>Create Poll</h2>
          {successMessage && (
            <p className="success-message">
              {successMessage} Poll ID: {pollId}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="create-polls-form-group">
              <label htmlFor="question">Question:</label>
              <input
                type="text"
                id="question"
                name="question"
                value={question || ''}
                onChange={handleQuestionChange}
                required
              />
            </div>
            <div className="create-polls-form-group">
              <label htmlFor="options">Options:</label>
              {options.map((option, index) => (
                <div key={index} className="option-container">
                  <input
                    type="text"
                    id={`option-${index}`}
                    name={`option-${index}`}
                    value={option || ''}
                    onChange={(e) => handleOptionChange(e, index)}
                    required
                  />
                  {index >= 2 && (
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-option-btn"
                onClick={handleAddOption}
              >
                Add Option
              </button>
            </div>
            <div className="create-polls-form-group">
              <label htmlFor="expiry-date">Expiry Date:</label>
              <input
                type="date"
                id="expiry-date"
                name="expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className={!expiryDateValid ? 'error' : ''}
              />
            </div>
            <div className="create-polls-form-group">
              <button type="submit" className="submit-btn">
                Create Poll
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
        </>
      ) : (
        <h2>Please log in to create a poll.</h2>
      )}
    </div>
  );
}

export default CreatePolls;
