import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

// Configure axios base URL locally or move to a global config file later
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true; // IMPORTANT for cookies



export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgot, setIsForgot] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)


  const { login, register, loginWithGoogle, resetPassword } = useAuth()
  const navigate = useNavigate()

  const slideImages = [
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1920',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1920'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])



  // Helper to sync with backend and get JWT cookie
  const syncBackendSession = async (user) => {
    try {
      await axios.post('/api/users/auth', {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } catch (err) {
      console.error("Backend auth sync failed:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isForgot && !termsAccepted) {
      setError('Please accept the terms and conditions')
      return
    }
    setError('')
    setLoading(true)

    try {
      if (isForgot) {
        await resetPassword(email)
        alert('Password reset link sent to your email! Please also check your spam/junk folder if you don\'t see it in your inbox.')
        setIsForgot(false)
        setIsLogin(true)
        setLoading(false)
        return
      } else if (isLogin) {
        const result = await login(email, password)
        await syncBackendSession(result.user)
      } else {
        const result = await register(email, password, displayName)
        await syncBackendSession(result.user)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!termsAccepted) {
      setError('Please accept the terms and conditions')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await loginWithGoogle()
      await syncBackendSession(result.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="login-page">
        <main className="login-card">
          {/* Left Side: Slideshow */}
          <div className="slideshow-side">
            <div className="slideshow-inner">
              {slideImages.map((img, i) => (
                <div key={i} className={`slide ${i === currentSlide ? 'active' : ''}`}>
                  <img src={img} alt={`Space art ${i + 1}`} />
                  <div className="slide-overlay"></div>
                </div>
              ))}
            </div>
            <div className="logo-overlay">
              <img src="/assets/images/logo.png" alt="Vyomarr" />
            </div>
            <div className="inner-shadow"></div>
          </div>

          {/* Right Side: Form */}
          <div className="form-side">
            <div className="form-logo">
              <img src="/assets/images/vymoartext.png" alt="Vyomarr" />
            </div>

            <div className="form-container">
              {isForgot ? (
                <div className="form-content">
                  <div className="form-header">
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a reset link</p>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      required
                    />
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Reset Link'} 🚀
                    </button>
                    <p className="toggle-form">
                      Remembered it? <button type="button" onClick={() => { setIsForgot(false); setIsLogin(true); }}>Login</button>
                    </p>
                  </form>
                </div>
              ) : isLogin ? (
                <div className="form-content">
                  <div className="form-header">
                    <h1>Ready for Liftoff? Log In to Proceed</h1>
                    <p>Enter your credentials to continue your journey</p>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      required
                    />
                    <div className="password-field">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type your secure password"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <div className="forgot-link">
                      <button type="button" onClick={() => { setIsLogin(false); setIsForgot(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#3b82f6', textDecoration: 'underline', fontSize: '0.75rem', fontWeight: '700' }}>
                        Forgot your password? Recover it
                      </button>
                    </div>
                    <p className="social-hint">One-tap access with Google</p>
                    <div className="social-buttons">
                      <button type="button" className="social-btn google" onClick={handleGoogleLogin} disabled={loading}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </button>
                    </div>
                    <label className="terms-checkbox">
                      <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
                      <span>I agree to the <Link to="/terms">Terms of Service</Link>, <Link to="/guidelines">Content Guidelines</Link>, and <Link to="/policy">Privacy Policy</Link></span>
                    </label>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Processing...' : 'Proceed'} 🚀
                    </button>
                    <p className="toggle-form">
                      New here? <button type="button" onClick={() => setIsLogin(false)}>Create an account</button>
                    </p>
                  </form>
                </div>
              ) : (
                <div className="form-content">
                  <div className="form-header">
                    <h1>Join Us</h1>
                    <p>Begin your cosmic journey</p>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                    <div className="password-field">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <label className="terms-checkbox">
                      <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
                      <span>I agree to the <Link to="/terms">Terms of Service</Link>, <Link to="/guidelines">Content Guidelines</Link>, and <Link to="/policy">Privacy Policy</Link></span>
                    </label>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                    <p className="toggle-form">
                      Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Login</button>
                    </p>
                  </form>
                </div>
              )}
            </div>

            <div className="social-footer">
              <span>Follow us on:</span>
              <div className="social-icons">
                <a href="https://youtube.com/@vyomarr" target="_blank" rel="noopener noreferrer">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
                <a href="https://x.com/vyomarr" target="_blank" rel="noopener noreferrer">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://instagram.com/vyomarr" target="_blank" rel="noopener noreferrer">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="https://discord.gg/vyomarr" target="_blank" rel="noopener noreferrer">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>



      <style>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }

                .login-card {
                    width: 100%;
                    max-width: 1200px;
                    height: min(750px, calc(100vh - 48px));
                    display: flex;
                    border-radius: 48px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                }

                /* Left Side - Slideshow */
                .slideshow-side {
                    width: 50%;
                    position: relative;
                    display: none;
                }

                @media (min-width: 768px) {
                    .slideshow-side { display: block; }
                }

                .slideshow-inner {
                    position: absolute;
                    inset: 0;
                    background: #000;
                }

                .slide {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    transition: opacity 2s ease-in-out;
                }

                .slide.active { opacity: 1; z-index: 2; }

                .slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .slide-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.3);
                }

                .logo-overlay {
                    position: absolute;
                    top: 24px;
                    left: 24px;
                    z-index: 30;
                }

                .logo-overlay img {
                    width: 44px;
                    height: 44px;
                    opacity: 0.5;
                }

                .inner-shadow {
                    position: absolute;
                    inset: 0;
                    box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.8);
                    pointer-events: none;
                    z-index: 20;
                }

                /* Right Side - Form */
                .form-side {
                    width: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 32px;
                    padding-top: 64px;
                    padding-bottom: 80px;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(24px);
                }

                @media (min-width: 768px) {
                    .form-side {
                        width: 55%;
                        padding: 32px 64px;
                        padding-top: 64px;
                        padding-bottom: 80px;
                    }
                }

                .form-side::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                    opacity: 0.03;
                    pointer-events: none;
                    z-index: -1;
                }

                .form-logo {
                    position: absolute;
                    top: 24px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    z-index: 30;
                }

                .form-logo img { height: 24px; object-fit: contain; }

                .form-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    max-width: 420px;
                    margin: 0 auto;
                    width: 100%;
                }

                .form-header { margin-bottom: 20px; }

                .form-header h1 {
                    font-size: 1.5rem;
                    margin-bottom: 8px;
                    color: var(--color-cosmic-white);
                }

                @media (min-width: 768px) {
                    .form-header h1 { font-size: 1.75rem; }
                }

                .form-header p {
                    color: var(--color-mist-gray);
                    font-size: 0.9rem;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-bottom: 16px;
                    color: #ef4444;
                    font-size: 0.9rem;
                }

                .form-content form { display: flex; flex-direction: column; gap: 12px; }

                .form-content input[type="email"],
                .form-content input[type="text"],
                .form-content input[type="password"] {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(191, 195, 198, 0.2);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: var(--color-cosmic-white);
                    font-size: 0.9rem;
                    transition: all 0.3s;
                }

                .form-content input:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--color-space-orange);
                    box-shadow: 0 0 0 2px rgba(252, 76, 0, 0.2);
                }

                .form-content input::placeholder { color: var(--color-mist-gray); opacity: 0.7; }

                .password-field {
                    position: relative;
                }

                .toggle-password {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }

                .forgot-link {
                    text-align: right;
                }

                .forgot-link a {
                    color: var(--color-space-orange);
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .social-hint {
                    text-align: center;
                    font-size: 0.75rem;
                    color: var(--color-mist-gray);
                    margin: 4px 0;
                }

                .social-buttons {
                    display: flex;
                    justify-content: center;
                }

                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    color: var(--color-cosmic-white);
                }

                .social-btn.google {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .social-btn.google:hover { background: rgba(255, 255, 255, 0.2); }

                .terms-checkbox {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    cursor: pointer;
                }

                .terms-checkbox input {
                    width: 16px;
                    height: 16px;
                    accent-color: var(--color-space-orange);
                    margin-top: 2px;
                }

                .terms-checkbox span {
                    font-size: 0.75rem;
                    color: var(--color-mist-gray);
                    line-height: 1.4;
                    color: #fff;
                }
                
                .terms-checkbox a {
                    color: var(--color-space-orange);
                }

                .btn-submit {
                    width: 100%;
                    padding: 12px;
                    background: var(--color-space-orange);
                    color: white;
                    border: none;
                    border-radius: 999px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 8px 20px rgba(252, 76, 0, 0.2);
                    margin-top: 8px;
                }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(252, 76, 0, 0.4);
                }

                .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

                .toggle-form {
                    text-align: center;
                    font-size: 0.8rem;
                    color: var(--color-mist-gray);
                }

                .toggle-form button {
                    background: none;
                    border: none;
                    color: var(--color-space-orange);
                    font-weight: 700;
                    cursor: pointer;
                    margin-left: 4px;
                }

                .social-footer {
                    position: absolute;
                    bottom: 24px;
                    left: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    color: var(--color-mist-gray);
                    font-size: 0.75rem;
                }

                .social-icons {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .social-icons a {
                    color: var(--color-mist-gray);
                    transition: color 0.3s;
                }

                .social-icons a:hover { color: var(--color-space-orange); }

                .social-icons svg { width: 18px; height: 18px; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </>
  )
}
