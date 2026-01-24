import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState({ message: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setSubscribeStatus({ message: 'Please enter a valid email', type: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribeStatus({ message: data.message || 'Successfully subscribed!', type: 'success' })
        setEmail('')
      } else {
        setSubscribeStatus({ message: data.error || 'Subscription failed', type: 'error' })
      }
    } catch (error) {
      console.error('Subscribe error:', error)
      setSubscribeStatus({ message: 'Failed to subscribe. Please try again.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/assets/images/logo.png" alt="Vyomarr Logo" width="40" height="40" />
              <img src="/assets/images/vymoartext.png" alt="Vyomarr" height="24" />
            </Link>
            <p className="footer-tagline">
              Join Vyomarr — Connect, Explore, Belong, and Become Part of Our Curious Cosmic Family.
            </p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/govindumohan/" className="social-icon linkedin" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@vyomarr" className="social-icon youtube" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/vyomarr/" className="social-icon instagram" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://discord.gg/vyomarr" className="social-icon discord" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-column">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/space-mysteries">Space & Mysteries</Link></li>
              <li><Link to="/puzzles">Puzzles & Games</Link></li>
              <li><Link to="/what-if">What If..?</Link></li>
            </ul>
          </div>

          {/* About & Community */}
          <div className="footer-column">
            <h3>About & Community</h3>
            <ul>
              <li><Link to="/community">Join Community</Link></li>
              <li><Link to="/about">About Vyomarr</Link></li>
              <li><Link to="/terms">Terms of service</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/how-to-submit">How to submit a theory?</Link></li>
              <li><Link to="/issues">Account & Login Issues</Link></li>
              <li><Link to="/guidelines">Content Guidelines</Link></li>
              <li><Link to="/privacy">Privacy & Data Policy</Link></li>
              <li><Link to="/cookies">Cookies Policy</Link></li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="footer-newsletter">
            <h3>Stay Connected</h3>
            <p>Get the latest cosmic discoveries and mysteries delivered to your inbox.</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="button" onClick={handleSubscribe} disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {subscribeStatus.message && (
              <p style={{
                color: subscribeStatus.type === 'success' ? '#10b981' : '#ef4444',
                fontSize: '13px',
                marginTop: '8px'
              }}>
                {subscribeStatus.message}
              </p>
            )}
            <ul className="newsletter-benefits">
              <li>• Weekly space discoveries</li>
              <li>• New mystery alerts</li>
              <li>• Community highlights</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="copyright">
          © 2025 Vyomarr Space Explorer. All rights reserved. | Exploring the infinite mysteries of the cosmos together.
        </p>
      </div>

      <style>{`
        .footer {
          background-color: #1a1a2e;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 48px 0;
          color: #f8f9f9;
        }

        .footer-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 60px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 1.4fr;
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-container {
            padding: 0 24px;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 16px;
        }

        .footer-logo img:first-child {
          width: 40px;
          height: 40px;
        }

        .footer-logo img:last-child {
          height: 24px;
        }

        .footer-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s;
        }

        .social-icon:hover {
          transform: translateY(-4px);
        }

        /* Brand-specific hover colors */
        .social-icon.linkedin:hover {
          background: #0A66C2;
          border-color: #0A66C2;
          color: #ffffff;
        }

        .social-icon.youtube:hover {
          background: #FF0000;
          border-color: #FF0000;
          color: #ffffff;
        }

        .social-icon.instagram:hover {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          border-color: #E4405F;
          color: #ffffff;
        }

        .social-icon.discord:hover {
          background: #5865F2;
          border-color: #5865F2;
          color: #ffffff;
        }

        .footer-column h3 {
          font-weight: 600;
          margin-bottom: 16px;
          color: #f8f9f9;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-column li {
          margin-bottom: 12px;
        }

        .footer-column a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .footer-column a:hover {
          color: #fc4c00;
        }

        .footer-newsletter h3 {
          font-weight: 600;
          margin-bottom: 16px;
          color: #f8f9f9;
        }

        .footer-newsletter > p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .newsletter-form {
          display: flex;
          margin-bottom: 16px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px 0 0 4px;
          color: #fff;
          font-size: 14px;
          outline: none;
        }

        .newsletter-form button {
          background: #fc4c00;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
          transition: background 0.3s;
        }

        .newsletter-form button:hover {
          background: #ff6a2b;
        }

        .newsletter-benefits {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .newsletter-benefits li {
          margin-bottom: 6px;
        }

        .copyright {
          text-align: center;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </footer>
  )
}
