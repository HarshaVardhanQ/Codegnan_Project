import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavLink } from 'react-bootstrap';
import './navigation.css';

function Navigation({ loggedIn, handleLogout }) {
  return (
    <>
      <link rel="stylesheet" type="text/css" href="navigation.css" />
      <Navbar className='navbar' collapseOnSelect expand="sm" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="navbarScroll" data-bs-toggle="collapse" data-bs-target="#navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className='nav-container-a'>
            <NavLink className='h1' eventKey="1" as={Link} to="/About">About</NavLink>
            <NavLink className='h2' eventKey="2" as={Link} to="/HomePage">HomePage</NavLink>
            <NavLink className='h3' eventKey="3" as={Link} to="/CreatePolls">CreatePolls</NavLink>
            <NavLink className='h4' eventKey="4" as={Link} to="/ReviewPolls">ReviewPolls</NavLink>
            <NavLink className='h4' eventKey="7" as={Link} to="/Voting">VotePolls</NavLink>
            {loggedIn ? (
              <NavLink className='logout' eventKey="5" onClick={handleLogout}>Logout</NavLink>
            ) : (
              <>
                <NavLink className='login' eventKey="5" as={Link} to="/Login">Login</NavLink>
                <NavLink className='signup' eventKey="6" as={Link} to="/SignUp">Signup</NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Navigation;
