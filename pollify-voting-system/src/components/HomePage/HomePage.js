import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Additional logic for performing the logout action (e.g., clearing session, redirecting, etc.)
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <button className="home-btn" onClick={handleLogout}>LOGOUT</button>
      );
    } else {
      return (
        <>
          <Link to="/login" className="home-btn">LOGIN</Link>
          <Link to="/signup" className="home-btn">REGISTER</Link>
        </>
      );
    }
  };

  return (
    <div className="Background1">
      <div className="home-title">
        <h1>Welcome to Pollify Online Voting System</h1>
        <h1>What are you waiting for!!</h1>
        <h2>Be Smart, do your part...</h2>
      </div>
      <div className="home-button">
        {renderAuthButtons()}
      </div>
    </div>
  );
}

export default HomePage;
