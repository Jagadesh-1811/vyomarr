import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import logoText from '../../assets/vymoartext.png';

const socialLinks = [
  { href: 'https://www.linkedin.com/in/govindumohan/', label: 'LinkedIn', iconPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { href: 'https://www.youtube.com/@vyomarr', label: 'YouTube', iconPath: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { href: 'https://www.instagram.com/vyomarr/', label: 'Instagram', iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { href: 'https://discord.gg/vyomarr', label: 'Discord', iconPath: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z' },
];

const UsersFooter = () => {
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
  };

  const linkStyle = {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '14px',
  };

  const socialButton = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    color: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s',
  };

  return (
    <footer
      style={{
        backgroundColor: '#1a1a2e',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '48px 0',
        color: '#f8f9f9',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={gridStyles}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <img src={logo} alt="Vyomarr Logo" style={{ width: '40px', height: '40px' }} />
              <img src={logoText} alt="Vyomarr" style={{ height: '24px' }} />
            </div>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                marginBottom: '24px',
                lineHeight: 1.6,
              }}
            >
              Join Vyomarr — Connect, Explore, Belong, and Become Part of Our Curious Cosmic
              Family.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  style={socialButton}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d={link.iconPath} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '16px', color: '#f8f9f9' }}>Explore</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/space-mysteries" style={linkStyle}>
                  Space & Mysteries
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/puzzles" style={linkStyle}>
                  Puzzles & Games
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/what-if" style={linkStyle}>
                  What If..?
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '16px', color: '#f8f9f9' }}>
              About & Community
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/community" style={linkStyle}>
                  Join Community
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/about" style={linkStyle}>
                  About Vyomarr
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/terms" style={linkStyle}>
                  Terms of service
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/policy" style={linkStyle}>
                  Privacy & Policy
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link to="/users/contact" style={linkStyle}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '16px', color: '#f8f9f9' }}>
              Stay Connected
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                marginBottom: '16px',
                lineHeight: 1.6,
              }}
            >
              Get the latest cosmic discoveries and mysteries delivered to your inbox.
            </p>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px 0 0 4px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                style={{
                  background: '#fc4c00',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '0 4px 4px 0',
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe to Our Articles
              </button>
            </div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <li style={{ marginBottom: '6px' }}>• Weekly space discoveries</li>
              <li style={{ marginBottom: '6px' }}>• New mystery alerts</li>
              <li>• Community highlights</li>
            </ul>
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          © 2025 Vyomarr Space Explorer. All rights reserved. | Exploring the infinite mysteries of
          the cosmos together.
        </p>
      </div>
    </footer>
  );
};

export default UsersFooter;

