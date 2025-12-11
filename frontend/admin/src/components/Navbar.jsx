import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    photo: null
  });
  const location = useLocation();
  const linksRef = useRef(null);
  const indicatorRef = useRef(null);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/space-mysteries', label: 'Space & Mysteries' },
    { path: '/puzzles', label: 'Puzzles & Games' },
    { path: '/whatif', label: 'What if..?' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    return userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
  };

  // Update indicator position based on active link
  useEffect(() => {
    if (linksRef.current && indicatorRef.current) {
      const activeLink = linksRef.current.querySelector('.navbar-link-active');
      if (activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const containerRect = linksRef.current.getBoundingClientRect();
        indicatorRef.current.style.width = `${linkRect.width}px`;
        indicatorRef.current.style.left = `${linkRect.left - containerRect.left}px`;
      } else {
        indicatorRef.current.style.width = '0';
      }
    }
  }, [location.pathname]);

  return (
    <>
      {/* Navigation Bar */}
      <div className="navbar-wrapper">
        <nav className="navbar-nav">
          <div className="navbar-content">
            {/* Brand Logo */}
            <div className="navbar-brand">
              <Link to="/" className="navbar-logo-link">
                <img src="/img/logo.png" alt="Vyomarr Logo" width="40" height="40" />
                <span className="navbar-brand-text">
                  <img src="/img/vymoartext.png" alt="Vyomarr Text Logo" height="50" width="140" />
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="navbar-links" ref={linksRef}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${location.pathname === link.path ? 'navbar-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <span className="navbar-indicator" ref={indicatorRef}></span>
            </div>

            {/* Auth Section */}
            <div className="navbar-auth-section">
              {!isLoggedIn ? (
                <Link to="/login" className="navbar-login-btn">Login</Link>
              ) : (
                <Link to="/profile" className="navbar-profile-btn">
                  {userProfile.photo ? (
                    <img src={userProfile.photo} alt="Profile" className="navbar-profile-photo" />
                  ) : (
                    <span className="navbar-avatar">{getUserInitial()}</span>
                  )}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="navbar-mobile-btn" onClick={toggleMobileMenu}>
              {!mobileMenuOpen ? (
                <svg className="navbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="navbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'navbar-mobile-menu-open' : ''}`}>
        <nav className="navbar-mobile-nav">
          <div className="navbar-mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-mobile-link ${location.pathname === link.path ? 'navbar-mobile-link-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="navbar-mobile-auth">
              {!isLoggedIn ? (
                <Link to="/login" className="navbar-mobile-login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              ) : (
                <Link to="/profile" className="navbar-mobile-profile" onClick={() => setMobileMenuOpen(false)}>
                  {userProfile.photo ? (
                    <img src={userProfile.photo} alt="Profile" className="navbar-mobile-profile-photo" />
                  ) : (
                    <span className="navbar-mobile-avatar">{getUserInitial()}</span>
                  )}
                  <span className="navbar-mobile-profile-text">My Profile</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
