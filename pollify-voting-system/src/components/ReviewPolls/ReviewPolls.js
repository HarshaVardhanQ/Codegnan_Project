import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reviewpolls.css';

function ReviewPolls() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedIn(true);
      setUsername(user);
    }
  }, []);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/polls');
        if (response.status === 200) {
          const allPolls = response.data.polls;
          // Filter the polls based on the logged-in user
          const filteredPolls = allPolls.filter(poll => poll.user === username);
          setPolls(filteredPolls);
        } else {
          throw new Error('Failed to fetch polls');
        }
      } catch (error) {
        console.error('An error occurred while fetching polls');
        console.error(error);
        setError('Failed to fetch polls. Please try again later.');
      }
    };

    if (loggedIn) {
      fetchPolls();
    }
  }, [loggedIn, username]);

  const fetchVotes = async (pollId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/polls/${pollId}/votes`);
      if (response.status === 200) {
        const votes = response.data;
        const updatedPolls = polls.map(poll => {
          if (poll.pollId.toString() === votes.pollId.toString()) {
            const optionsVotes = votes.options.map(option => option.votes);
            const totalVotes = optionsVotes.reduce((total, vote) => total + vote, 0);
            return {
              ...poll,
              optionsVotes,
              totalVotes,
            };
          }
          return poll;
        });
        setPolls(updatedPolls);
      } else {
        throw new Error('Failed to fetch votes');
      }
    } catch (error) {
      console.error('An error occurred while fetching votes');
      console.error(error);
      // Handle the error
    }
  };

  const copyIdToClipboard = (pollId) => {
    navigator.clipboard.writeText(pollId);
  };

  return (
    <div className="review-polls-container">
      {loggedIn ? (
        <div>
          <h2 className="review-polls-title">User Polls</h2>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              {polls.length > 0 ? (
                <ul className="polls-list">
                  {polls.map(poll => (
                    <li className="poll-item" key={poll.pollId}>
                      <div className="poll-header">
                        <h3 className="poll-id">ID: {poll.pollId}</h3>
                        <button
                          className="copy-id-button"
                          onClick={() => copyIdToClipboard(poll.pollId)}
                        >
                          Copy ID
                        </button>
                      </div>
                      <h4 className="poll-question">Question: {poll.question}</h4>
                      <ol className="option-votes-list">
                        {poll.options.map((option, index) => (
                          <li className="option-vote-item" key={index}>
                            <span className="option-name">{`${index + 1}.) ${option}`}</span>
                            {poll.optionsVotes && poll.optionsVotes[index] !== undefined && (
                              <span className="vote-count">Votes: {poll.optionsVotes[index]}</span>
                            )}
                          </li>
                        ))}
                      </ol>
                      {poll.totalVotes !== undefined && (
                        <p className="total-votes">Total Votes: {poll.totalVotes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-polls-message">No polls found.</p>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="login-message">Please log in to view the polls.</p>
      )}
    </div>
  );
}

export default ReviewPolls;
