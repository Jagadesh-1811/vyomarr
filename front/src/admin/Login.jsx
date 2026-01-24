import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Lock, Mail, Key } from 'lucide-react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.withCredentials = true;

const COOKIE_CONSENT_KEY = 'vyomarr_admin_cookie_consent';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetAllowed, setIsResetAllowed] = useState(false);

  const navigate = useNavigate();
  const ALLOWED_EMAIL = 'mohanreddysaigovindu@gmail.com';

  useEffect(() => {
    // Check cookie consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowCookieConsent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('/api/admin/login', { email, password });

      setSuccess('Login successful!');
      // Only set token in local storage if needed for client-side checks, 
      // primarily relying on httpOnly cookie for requests
      localStorage.setItem('adminInfo', JSON.stringify(data));

      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Logic ---

  const handleForgotClick = () => {
    setShowForgotModal(true);
    setResetStep(1);
    setResetError('');
    setResetSuccess('');
    setResetEmail('');
    setOtp('');
    setNewPassword('');
  };

  const handleEmailStep = (e) => {
    e.preventDefault();
    setResetError('');

    if (resetEmail !== ALLOWED_EMAIL) {
      setResetError('Password reset is not authorized for this email.');
      return;
    }

    setResetStep(2);
  };

  const handleOtpStep = (e) => {
    e.preventDefault();
    setResetError('');

    // Pre-validate OTP length/format if needed, but actual check is on submit or we can do a mock check here
    if (!otp) {
      setResetError('Please enter the OTP.');
      return;
    }
    setResetStep(3);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!newPassword) {
      setResetError('Please enter a new password.');
      return;
    }

    try {
      await axios.post('/api/admin/reset-password', {
        email: resetEmail,
        otp,
        newPassword
      });

      setResetSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        setShowForgotModal(false);
        setSuccess('Password updated. Please login with new password.');
      }, 2000);

    } catch (err) {
      setResetError(err.response?.data?.message || 'Password reset failed.');
      // If OTP failed, go back to step 2?
      if (err.response?.status === 401) {
        setResetStep(2);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000b49 0%, #001a66 50%, #000b49 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(252, 76, 0, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 100, 200, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Login Card */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(0, 11, 73, 0.9), rgba(0, 26, 102, 0.7))',
        border: '1px solid rgba(252, 76, 0, 0.3)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 60px rgba(252, 76, 0, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/assets/images/logo.png"
            alt="Vyomarr Logo"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              margin: '0 auto 16px',
              display: 'block'
            }}
          />
          <h1 style={{
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Vyomarr</h1>
          <p style={{ margin: 0, color: '#bfc3c6', fontSize: '14px' }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#f8f9f9',
              fontWeight: '600',
              fontSize: '14px',
              letterSpacing: '0.3px'
            }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bfc3c6'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: 'rgba(0, 11, 73, 0.6)',
                  border: '1px solid rgba(252, 76, 0, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  color: '#f8f9f9',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fc4c00';
                  e.target.style.boxShadow = '0 0 0 3px rgba(252, 76, 0, 0.15), 0 0 20px rgba(252, 76, 0, 0.1)';
                  e.target.style.background = 'rgba(0, 11, 73, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(252, 76, 0, 0.2)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(0, 11, 73, 0.6)';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#f8f9f9',
              fontWeight: '600',
              fontSize: '14px',
              letterSpacing: '0.3px'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bfc3c6'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: 'rgba(0, 11, 73, 0.6)',
                  border: '1px solid rgba(252, 76, 0, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  color: '#f8f9f9',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fc4c00';
                  e.target.style.boxShadow = '0 0 0 3px rgba(252, 76, 0, 0.15), 0 0 20px rgba(252, 76, 0, 0.1)';
                  e.target.style.background = 'rgba(0, 11, 73, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(252, 76, 0, 0.2)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(0, 11, 73, 0.6)';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#64748b' : 'linear-gradient(135deg, #fc4c00, #ff6a2b)',
              color: '#f8f9f9',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(252, 76, 0, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(252, 76, 0, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(252, 76, 0, 0.4)';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleForgotClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '4px'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fc4c00'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            Forgot Password?
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            color: '#34d399',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {success}
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: '#091026',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '400px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '24px'
              }}
            >
              &times;
            </button>

            <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '24px', textAlign: 'center' }}>
              Reset Password
            </h2>

            {resetSuccess ? (
              <div style={{ color: '#34d399', textAlign: 'center', padding: '20px' }}>
                {resetSuccess}
              </div>
            ) : (
              <form onSubmit={resetStep === 1 ? handleEmailStep : resetStep === 2 ? handleOtpStep : handleResetSubmit}>

                {resetStep === 1 && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px' }}>
                      Enter Admin Email
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter verified admin email"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {resetStep === 2 && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px' }}>
                      Enter Verification OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff',
                        outline: 'none',
                        letterSpacing: '2px',
                        textAlign: 'center'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                      Enter the secure OTP provided to you.
                    </p>
                  </div>
                )}

                {resetStep === 3 && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '14px' }}>
                      New Password
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {resetError && (
                  <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                    {resetError}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#fc4c00',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {resetStep === 1 ? 'Verify Email' : resetStep === 2 ? 'Verify OTP' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cookie Consent Popup */}
      {showCookieConsent && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          maxWidth: '360px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          animation: 'slideUp 0.5s ease-out'
        }}>
          <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
            🍪 Cookie Usage
          </h3>
          <p style={{ margin: '0 0 16px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5' }}>
            We use cookies to ensure you get the best experience on our dashboard.
            By continuing, you accept our use of cookies for authentication.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAcceptCookies}
              style={{
                flex: 1,
                padding: '8px',
                background: '#fc4c00',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Accept
            </button>
            <button
              onClick={() => setShowCookieConsent(false)}
              style={{
                flex: 1,
                padding: '8px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}