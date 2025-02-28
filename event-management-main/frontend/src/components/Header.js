import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
//import './header.css';

const Header = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post('https://event-management-krqp.onrender.com/auth/guest');
      login(res.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Guest Login Error:', error.response?.data);
      alert('Guest login failed');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <h1>
          <Link to="/">Event Management</Link>
        </h1>
        <nav className={menuOpen ? 'nav-menu open' : 'nav-menu'}>
          <ul>
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/create">Create Event</Link></li>
                <li>
                  <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li>
                  <button onClick={handleGuestLogin}>
                    Guest Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
