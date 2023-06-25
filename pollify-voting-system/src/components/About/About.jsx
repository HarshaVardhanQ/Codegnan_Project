import React from 'react';
import './about.css';

function About() {
  return (
    <div>
      <div className="About-about-us">
        <h1>About Us</h1>
        <p>
          Welcome to our website! We are a team of Codegnan Internship... Nowadays, there are tons of things we do online, from shopping to doing any kind of official arrangement. Why not voting online too? <br />
          Vote at any time from anywhere using our website....
        </p>
      </div>
      <div className="About-about_1">
        <h2>Our Team</h2>
        <p>Meet the people behind our team:</p>
        <ul>
          <li>Gayatri.Y</li>
          <li>Bhargavi.S</li>
          <li>Harshavardhan.V</li>
        </ul>
      </div>
      <div className="About-about_2">
        <h2>Contact Details</h2>
        <ul>
          <p>Email: harshavardhanveera2003@gmail.com, bhargavisankarana@gmail.com, ygayathri6574@gmail.com</p>
        </ul>
      </div>
      <footer>
        <p>&copy;2023 Codegnan. All rights reserved.</p>
      </footer>
    </div>
    
  );
}

export default About;
