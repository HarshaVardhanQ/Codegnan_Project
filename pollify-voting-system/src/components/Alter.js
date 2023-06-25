import React, { useState } from 'react';
import './alter.css';
import { Link } from 'react-router-dom';
const Alter = () => {
  const [motionStyle, setMotionStyle] = useState({});
  const handleMouseMove = (e) => {

    const motionX = ((window.innerWidth / 2) - e.clientX) / 20; // Adjust motion intensity
    const motionY = ((window.innerHeight / 2) - e.clientY) / 20;

    setMotionStyle({ transform: `translate(${motionX}px, ${motionY}px)` });
  };

  return (
    <div className='Back'>
    <div className="intro-container" onMouseMove={handleMouseMove}>
      <div className="intro-content" style={motionStyle}>
        <h1 className="intro-heading">Welcome to Pollify!</h1>
        <p className="intro-description">   The Online Voting System</p>
        <form className="intro-form">
        <Link to="/HomePage" className="btn">Start Voting</Link> {/* Redirect to Login component */}
        </form>
      </div>
    </div>
    </div>
  );
};

export default Alter;
