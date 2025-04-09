import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="text-logo">
            <span className="logo-text-top">Ethical</span>
            <span className="logo-text-bottom">Childrens Partys</span>
          </div>
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="nav-link">Create Invitation</Link>
              <div className="user-menu-container">
                <button 
                  className="user-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="user-menu">
                    <button onClick={handleLogout} className="menu-item">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link highlight">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
