import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import HomePage from './components/HomePage/HomePage';
import CreatePolls from './components/CreatePolls/CreatePolls';
import Navigation from './components/Navigation';
import ReviewPolls from './components/ReviewPolls/ReviewPolls';
import Voting from './components/Voting/Voting';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import Alter from './components/Alter';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // State for tracking user login status

  const handleLogout = () => {
    // Perform logout logic here
    setLoggedIn(false); // Set loggedIn state to false after logout
  };

  return (
    <div className="App">
      <Router>
        <Navigation loggedIn={loggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Alter />} />
          <Route path="/About" element={<About />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/CreatePolls" element={<CreatePolls />} />
          <Route path="/ReviewPolls" element={<ReviewPolls />} />
          <Route path="/Voting" element={<Voting/>}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
