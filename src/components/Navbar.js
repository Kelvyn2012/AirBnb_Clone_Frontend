import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Airbnb Clone
        </Link>

        <div className="navbar-menu">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/bookings" className="navbar-link">My Bookings</Link>
              <Link to="/messages" className="navbar-link">Messages</Link>

              {user?.role === 'host' || user?.role === 'admin' ? (
                <>
                  <Link to="/host/dashboard" className="navbar-link">Host Dashboard</Link>
                  <Link to="/host/create-property" className="navbar-link">Add Property</Link>
                </>
              ) : null}

              <Link to="/profile" className="navbar-link">Profile</Link>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
