import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-icon">🎓</span>
          <span className="brand-name">Student<span>MS</span></span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/add-student"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMenu}
              >
                + Add Student
              </NavLink>

              <div className="nav-user-section">
                <span className="user-badge" title={user?.email}>
                  👤 {user?.name || 'User'}
                </span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
