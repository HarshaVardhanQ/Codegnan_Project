import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './voting.css';

function Voting() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pollId, setPollId] = useState('');
  const [poll, setPoll] = useState({ optionsVotes: [], question: '', expiryDate: null, userVoted: false });
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  const handlePollIdChange = (event) => {
    setPollId(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlePollDetails = async () => {
    if (!loggedIn) {
      setError('Please log in to vote on polls.');
      return;
    }

    // Check if the entered poll ID is a number
    if (isNaN(pollId)) {
      setError('Invalid poll ID. Please enter a valid number.');
      setPoll({ optionsVotes: [], question: '', expiryDate: null, userVoted: false });
      setOptions([]);
      return;
    }

    // Check if the pollId is empty
    if (!pollId) {
      setError('Please give a poll ID.');
      setPoll({ optionsVotes: [], question: '', expiryDate: null, userVoted: false });
      setOptions([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/polls/${pollId}`);
      if (response.status === 200) {
        const fetchedPoll = response.data.poll;
        const expiryDate = new Date(fetchedPoll.expiryDate);
        const currentDate = new Date();
        if (expiryDate < currentDate) {
          setError('Poll is expired');
          setPoll({ ...fetchedPoll, userVoted: false });
          setOptions([]);
        } else {
          const user = localStorage.getItem('loggedInUser');
          const votedUsers = localStorage.getItem(`votedUsers_${pollId}`);
          const hasUserVoted = votedUsers && votedUsers.includes(user);
          setPoll({ ...fetchedPoll, userVoted: hasUserVoted });
          setOptions(fetchedPoll.options);
          setError('');
        }
      } else {
        throw new Error('Failed to fetch poll details');
      }
    } catch (error) {
      console.error('An error occurred while fetching poll details');
      console.error(error);
      setError('Failed to fetch poll details. Please try again later.');
      setPoll({ optionsVotes: [], question: '', expiryDate: null, userVoted: false });
      setOptions([]);
    }
  };

  const handleVote = async () => {
    if (!loggedIn) {
      setError('Please log in to vote on polls.');
      return;
    }

    if (selectedOption === '') {
      setError('Please select an option.');
      return;
    }

    const user = localStorage.getItem('loggedInUser');
    const votedUsers = localStorage.getItem(`votedUsers_${pollId}`);

    if (votedUsers && votedUsers.includes(user)) {
      setError('You have already voted.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, { option: selectedOption });
      if (response.status === 200) {
        setVoted(true);
        setError('');

        // Store the user in votedUsers list for the specific poll
        if (votedUsers) {
          localStorage.setItem(`votedUsers_${pollId}`, votedUsers + ',' + user);
        } else {
          localStorage.setItem(`votedUsers_${pollId}`, user);
        }
      } else {
        throw new Error('Failed to submit the vote.');
      }
    } catch (error) {
      console.error('An error occurred while submitting the vote');
      console.error(error);
      setError('Failed to submit the vote. Please try again later.');
    }
  };

  const isPollExpired = (expirationDate) => {
    const currentDate = new Date();
    return currentDate > new Date(expirationDate);
  };

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  return (
    <div className="voting-polls-container">
      {loggedIn ? (
        <>
          <h2 className="voting-polls-title">Vote on a Poll</h2>
          <div className="poll-id-input">
            <input
              type="text"
              placeholder="Enter Poll ID"
              value={pollId}
              onChange={handlePollIdChange}
            />
            <button className="poll-details-button" onClick={handlePollDetails}>
              Get Poll Details
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {poll.expiryDate !== null && (
            <div className="poll-details">
              {!isPollExpired(poll.expiryDate) ? (
                <>
                  <h3 className="poll-question">{poll.question}</h3>
                  {!voted && !poll.userVoted && (
                    <>
                      <ul className="poll-options">
                        {options.map((option, index) => (
                          <li className="option-vote-item" key={index}>
                            <input
                              type="radio"
                              name="option"
                              value={option}
                              checked={selectedOption === option}
                              onChange={handleOptionChange}
                            />
                            {option}
                          </li>
                        ))}
                      </ul>
                      {!isPollExpired(poll.expiryDate) && (
                        <p className="poll-expiration">
                          Expires on: {formatDateTime(poll.expiryDate)}
                        </p>
                      )}
                      <button className="vote-button" onClick={handleVote}>
                        Vote
                      </button>
                    </>
                  )}
                  {voted && <p className="vote-success-message">Vote submitted successfully!</p>}
                  {poll.userVoted && <p className="already-voted-message">You have already voted for this poll.</p>}
                </>
              ) : (
                <p className="poll-expired-message">This poll has expired.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Please log in to vote on polls.</p>
      )}
    </div>
  );
}

export default Voting;
