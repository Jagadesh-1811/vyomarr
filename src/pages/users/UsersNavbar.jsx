import { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import logoText from '../../assets/vymoartext.png';

const navLinks = [
  { to: '/users/home', label: 'Home' },
  { to: '/users/space-mysteries', label: 'Space & Mysteries' },
  { to: '/users/puzzles', label: 'Puzzles & Games' },
  { to: '/users/what-if', label: 'What if..?' },
  { to: '/users/about', label: 'About' },
  { to: '/users/contact', label: 'Contact' },
];

const UsersNavbar = () => {
  const [open, setOpen] = useState(false);

  const styles = useMemo(
    () => `
    :root {
      --color-deep-space: #000b49;
      --color-space-orange: #fc4c00;
      --color-cosmic-white: #f8f9f9;
      --color-mist-gray: #bfc3c6;
      --font-tech: 'Roboto Mono', monospace;
    }
    .navbar-wrapper {
      position: relative;
      z-index: 50;
      border-bottom: 1px solid rgba(191, 195, 198, 0.2);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background-color: rgba(0, 11, 73, 0.8);
    }
    .navbar-nav {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
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
      margin-right: 3rem;
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
      display: block;
      flex-shrink: 0;
    }
    .navbar-brand-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      font-family: 'Montserrat', sans-serif;
      display: flex;
      align-items: center;
    }
    .navbar-brand-text img {
      height: 28px !important;
      width: auto !important;
      max-width: 120px;
      object-fit: contain;
      display: block;
      vertical-align: middle;
    }
    .navbar-links {
      display: none;
      align-items: center;
      gap: 2rem;
      position: relative;
      padding-bottom: 0.5rem;
    }
    @media (min-width: 768px) {
      .navbar-links {
        display: flex;
      }
    }
    .navbar-link {
      font-family: var(--font-tech, 'Roboto Mono', monospace);
      font-style: italic;
      color: var(--color-mist-gray, #bfc3c6);
      text-decoration: none;
      padding: 0.25rem 0;
      transition: color 0.3s;
      white-space: nowrap;
    }
    .navbar-link:hover,
    .navbar-link.active {
      color: var(--color-cosmic-white, #f8f9f9);
    }
    .navbar-login-btn {
      font-family: var(--font-tech, 'Roboto Mono', monospace);
      font-style: italic;
      color: white;
      background-color: #fc4c00;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.3s;
      white-space: nowrap;
    }
    .navbar-login-btn:hover {
      background-color: rgba(252, 76, 0, 0.9);
    }
    .navbar-indicator {
      position: absolute;
      bottom: 0;
      height: 2px;
      background-color: var(--color-space-orange, #fc4c00);
      transition: all 0.3s ease-in-out;
      width: 0;
      left: 0;
    }
    .navbar-mobile-btn {
      display: block;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      position: relative;
      z-index: 70;
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
    .navbar-icon-hidden {
      display: none;
    }
    .navbar-mobile-menu {
      display: ${open ? 'block' : 'none'};
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 11, 73, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 60;
      padding-top: 6rem;
      transition: all 0.3s;
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
      font-family: var(--font-tech, 'Roboto Mono', monospace);
      font-style: italic;
      color: var(--color-mist-gray, #bfc3c6);
      text-decoration: none;
      font-size: 1.125rem;
      transition: color 0.3s;
    }
    .navbar-mobile-link:hover {
      color: var(--color-cosmic-white, #f8f9f9);
    }
    .navbar-mobile-login {
      font-family: var(--font-tech, 'Roboto Mono', monospace);
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
    .navbar-mobile-login:hover {
      background-color: rgba(252, 76, 0, 0.9);
    }
    .navbar-links {
      overflow-x: auto;
    }
    .navbar-links::-webkit-scrollbar {
      height: 4px;
    }
    .navbar-links::-webkit-scrollbar-track {
      background: transparent;
    }
    .navbar-links::-webkit-scrollbar-thumb {
      background-color: var(--color-mist-gray, #bfc3c6);
      border-radius: 20px;
    }
    `,
    [open],
  );

  const renderNavLink = (link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) =>
        `navbar-link ${isActive ? 'active' : ''}`
      }
      onClick={() => setOpen(false)}
    >
      {link.label}
    </NavLink>
  );

  return (
    <div className="navbar-wrapper">
      <style>{styles}</style>
      <nav className="navbar-nav">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/users/home" className="navbar-logo-link">
              <img src={logo} alt="Vyomarr Logo" />
              <span className="navbar-brand-text">
                <img src={logoText} alt="Vyomarr Text Logo" />
              </span>
            </Link>
          </div>

          <div id="nav-links-container" className="navbar-links">
            {navLinks.map(renderNavLink)}
            <Link to="/users/login" className="navbar-login-btn">
              Login
            </Link>
            <span id="nav-indicator" className="navbar-indicator" />
          </div>

          <button
            className="navbar-mobile-btn"
            id="mobile-menu-btn"
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg
              id="menu-open-icon"
              className={`navbar-icon ${open ? 'navbar-icon-hidden' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              id="menu-close-icon"
              className={`navbar-icon ${open ? '' : 'navbar-icon-hidden'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className="navbar-mobile-menu">
        <nav className="navbar-mobile-nav">
          <div className="navbar-mobile-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="navbar-mobile-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/users/login"
              className="navbar-mobile-login"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default UsersNavbar;

