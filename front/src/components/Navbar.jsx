import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/space-mysteries', label: 'Space & Mysteries' },
    { to: '/puzzles', label: 'Puzzles & Games' },
    { to: '/what-if', label: 'What if..?' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return 'U'
  }

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar-nav">
          <div className="navbar-content">
            {/* Brand Logo */}
            <div className="navbar-brand">
              <Link to="/" className="navbar-logo-link">
                <img src="/assets/images/logo.png" alt="Vyomarr Logo" width="32" height="32" />
                <span className="navbar-brand-text">
                  <img src="/assets/images/vymoartext.png" alt="Vyomarr" height="28" />
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="navbar-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Auth Section */}
            <div className="navbar-auth-section">
              {user ? (
                <Link to="/dashboard" className="navbar-profile-btn">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="profile-icon" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="navbar-avatar">{getInitial()}</span>
                  )}
                </Link>
              ) : (
                <Link to="/login" className="navbar-login-btn">Login</Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="navbar-mobile-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="navbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="navbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu" style={{ display: 'block' }}>
          <nav className="navbar-mobile-nav">
            <div className="navbar-mobile-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="navbar-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <Link
                  to="/dashboard"
                  className="navbar-mobile-profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="navbar-mobile-avatar">{getInitial()}</span>
                  <span>My Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="navbar-mobile-login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: relative;
          z-index: 50;
          border-bottom: 1px solid rgba(191, 195, 198, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background-color: rgba(0, 11, 73, 0.8);
        }

        .navbar-nav {
          max-width: 100%;
          margin: 0;
          padding: 1rem 2rem;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .navbar-logo-link {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          text-decoration: none;
          transition: opacity 0.3s;
        }

        .navbar-logo-link:hover {
          opacity: 0.8;
        }

        .navbar-logo-link > img {
          height: 32px !important;
          width: 32px !important;
          object-fit: contain;
        }

        .navbar-brand-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          display: flex;
          align-items: center;
        }

        .navbar-brand-text img {
          height: 28px !important;
          width: auto !important;
          max-width: 120px;
          object-fit: contain;
        }

        .navbar-links {
          display: none;
          align-items: center;
          gap: 2rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        @media (min-width: 768px) {
          .navbar-links {
            display: flex;
          }
        }

        .navbar-link {
          font-family: var(--font-tech);
          font-style: italic;
          color: var(--color-mist-gray);
          text-decoration: none;
          padding: 0.25rem 0;
          transition: color 0.3s;
          white-space: nowrap;
          position: relative;
        }

        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-space-orange);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(252, 76, 0, 0.5);
        }

        .navbar-link:hover {
          color: var(--color-cosmic-white);
        }

        .navbar-link.active {
          color: var(--color-cosmic-white);
        }

        .navbar-link.active::after {
          transform: scaleX(1);
        }

        .navbar-login-btn {
          font-family: var(--font-tech);
          font-style: italic;
          color: white;
          background-color: #fc4c00;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: all 0.3s;
        }

        .navbar-login-btn:hover {
          background-color: rgba(252, 76, 0, 0.9);
        }

        .navbar-auth-section {
          display: none;
          align-items: center;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .navbar-auth-section {
            display: flex;
          }
        }

        .navbar-profile-btn {
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          transition: transform 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .navbar-profile-btn:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .navbar-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fc4c00, #e04400);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: white;
        }

        .profile-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .navbar-mobile-btn {
          display: block;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
        }

        @media (min-width: 768px) {
          .navbar-mobile-btn {
            display: none;
          }
        }

        .navbar-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .navbar-mobile-menu {
          position: relative;
          width: 100%;
          background-color: rgba(0, 11, 73, 0.95);
          backdrop-filter: blur(12px);
          z-index: 60;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .navbar-mobile-menu {
            display: none !important;
          }
        }

        .navbar-mobile-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .navbar-mobile-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: center;
        }

        .navbar-mobile-link {
          font-family: var(--font-tech);
          font-style: italic;
          color: var(--color-mist-gray);
          text-decoration: none;
          font-size: 1.125rem;
          transition: color 0.3s;
        }

        .navbar-mobile-link:hover {
          color: var(--color-cosmic-white);
        }

        .navbar-mobile-login {
          font-family: var(--font-tech);
          font-style: italic;
          color: white;
          background-color: #fc4c00;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          display: inline-block;
          margin: 0 auto;
          transition: all 0.3s;
        }

        .navbar-mobile-profile {
          font-family: var(--font-tech);
          color: white;
          background: linear-gradient(135deg, #fc4c00, #e04400);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
        }

        .navbar-mobile-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
        }
      `}</style>
    </>
  )
}
